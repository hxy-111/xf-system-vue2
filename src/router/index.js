import store from '@/store'
import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'
import { Message, Loading } from 'element-ui/'

Vue.use(VueRouter)


const router = new VueRouter({
    mode: 'hash',
    routes
})

/* 全局前置守卫 */
let loading;
router.beforeEach(async(to, from, next) => {
    if (to.path === '/login') {
        next();
        return
    }
    // 校验当前用户是否登录
    let { info } = store.state;
    if (info === null) {
        // 开启Loading层
        loading = Loading.service({
            lock: true,
            text: '小主，奴家正在努力加载中，请稍后...'
        });
        let res = await store.dispatch('queryProfileAsync');
        if (!res) {
            Message.error('您当前还未登录，请重新登录！')
                // next(`/login`)
            next(`/login?target=${to.path}`)
            return
        }
        info = res;
    }

    // 校验权限
    let power = (info.power || "").split('|'),
        code = to.meta.code;
    if (code && !power.includes(code)) {
        Message.error('您无权限访问此页面!');
        next(from.fullPath);
        return;
    }

    next()
})

/* 全局后置守卫 */
router.afterEach((to) => {
    // 关闭开启的Loading层
    if (loading) loading.close();

    // 路由跳转后，修改页面标题
    let { title } = to.meta;
    title = title ? '-' + title : '';
    document.title = `新蜂商城CMS系统${title}`;
})

export default router