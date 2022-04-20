import axios from 'axios'
import { Message } from 'element-ui/'

const http = axios.create({
    baseURL: '',
    timeout: 60000
})

/* 请求拦截器 */
http.interceptors.request.use(config => {
    // 传递服务器Token
    const token = localStorage.getItem('token')
    if (token) {
        config.headers['token'] = token;
    }
    return config;
});

/* 响应拦截器 */
http.interceptors.response.use(response => {
    return response.data;
}, reason => {
    Message.error('小主，当前网络繁忙，请您稍后再试~');
    return Promise.reject(reason);
});

export default http