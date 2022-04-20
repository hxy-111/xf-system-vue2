import Login from '@/views/Login.vue'
import Home from '@/views/Home.vue'

const routes = [{
    path: '',
    redirect: '/home/controlpanel'
}, {
    path: '/login',
    name: 'login',
    component: Login
}, {
    path: '/home',
    name: 'home',
    component: Home,
    meta: { title: 'CMS首页' },
    children: [{
            path: '',
            redirect: '/home/controlpanel'
        }, {
            path: 'controlpanel',
            name: 'controlpanel',
            component: () =>
                import ('@/views/ControlPanel.vue'),
            meta: { title: '控制面板', icon: 'el-icon-odometer', code: '0x100' }
        }, {
            path: 'bannersetting',
            name: 'bannersetting',
            component: () =>
                import ('@/views/Home/BannerSetting.vue'),
            meta: { title: '轮播图设置', icon: 'el-icon-picture', code: '0x101' }
        }, {
            path: 'goodssetting',
            name: 'goodssetting',
            component: () =>
                import ('@/views/Home/GoodsSetting.vue'),
            meta: { title: '热销商品设置', icon: 'el-icon-star-on', code: '0x101' }
        }, {
            path: 'productsetting',
            name: 'productsetting',
            component: () =>
                import ('@/views/Home/ProductSetting.vue'),
            meta: { title: '新品上线', icon: 'el-icon-sell', code: '0x101' }
        }, {
            path: 'recommendsetting',
            name: 'recommendsetting',
            component: () =>
                import ('@/views/Home/RecommendSetting.vue'),
            meta: { title: '推荐设置', icon: 'el-icon-thumb', code: '0x101' }
        }, {
            path: 'classification',
            name: 'classification',
            component: () =>
                import ('@/views/ClassiFication.vue'),
            meta: { title: '分类管理', icon: 'el-icon-menu', code: '0x102' },
            // children: [{
            //     path: 'level2',
            //     name: 'level2',
            //     component: () =>
            //         import ('@/views/ClassiFication.vue'),
            //     meta: { title: '分类二级管理' },
            // }, {
            //     path: 'level3',
            //     name: 'level3',
            //     component: () =>
            //         import ('@/views/ClassiFication.vue'),
            //     meta: { title: '分类三级管理' },
            // }]
        },
        {
            path: 'level2',
            name: 'level2',
            component: () =>
                import ('@/views/ClassiFication.vue'),
            meta: { title: '分类二级管理' },
        }, {
            path: 'level3',
            name: 'level3',
            component: () =>
                import ('@/views/ClassiFication.vue'),
            meta: { title: '分类三级管理' },
        },
        {
            path: 'goodsmanager',
            name: 'goodsmanager',
            component: () =>
                import ('@/views/GoodsManager.vue'),
            meta: { title: '商品管理', icon: 'el-icon-s-goods', code: '0x103' }
        }, {
            path: 'membermanager',
            name: 'membermanager',
            component: () =>
                import ('@/views/MemberManager.vue'),
            meta: { title: '会员管理', icon: 'el-icon-user-solid', code: '0x104' }
        }, {
            path: 'ordermanager',
            name: 'ordermanager',
            component: () =>
                import ('@/views/OrderManager.vue'),
            meta: { title: '订单管理', icon: 'el-icon-s-order', code: '0x105' }
        }, {
            path: 'goods_detail',
            name: 'goods_detail',
            component: () =>
                import ('@/views/GoodsInfo.vue'),
            meta: { title: '商品详情' }
        }, {
            path: 'order_detail',
            name: 'order_detail',
            component: () =>
                import ('@/views/OrderInfo.vue'),
            meta: { title: '订单详情' }
        }
    ]
}, {
    path: '*',
    redirect: '/home/controlpanel'
}]

export default routes