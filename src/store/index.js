import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'
import home from './home'
import classify from './classify'
import api from '@/api'

Vue.use(Vuex)
const env = process.env.Node_env // 部署环境
export default new Vuex.Store({
    // 基础公共状态管理
    state: {
        info: null,
    },
    getters: {},
    mutations: {
        queryProfile(state, payload) {
            state.info = payload
        },
    },
    actions: {
        async queryProfileAsync(context) {
            try {
                let { resultCode, data } = await api.base.profile()
                if (+resultCode === 200) {
                    data.power = "0x100|0x101|0x102|0x103|0x104|0x105"
                    context.commit('queryProfile', data)
                    return data
                }
            } catch (error) {}
            return false
        },
    },
    modules: {
        // 按模块管理的公共状态
        home,
        classify
    },
    plugins: env === "production" ? [] : [createLogger]
})