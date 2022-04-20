/* 创建自定义指令 */
import Vue from 'vue';
import store from '@/store';

// 权限校验的自定义指令
Vue.directive('permission', {
    inserted(el, binding) {
        // value:自定义指令的值「拥有这个权限，才会显示对应的DOM」
        let { value } = binding;
        // 获取当前登录者拥有的权限代码,去校验是否应该显示这个元素
        let { power = "" } = store.state.info || {};
        power = power.split('|');
        // 如果登录者不具备相关的权限,则移除页面中的这个元素
        if (!power.includes(value)) {
            if (el.parentNode) {
                el.parentNode.removeChild(el);
            }
        }
    }
});