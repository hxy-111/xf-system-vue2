/* 登录用户信息的管理 */
import http from "./http";

/* 用户登录 */
const login = (userName, passwordMd5) => {
    return http.post('/api/adminUser/login', {
        userName,
        passwordMd5
    });
}

/* 获取用户信息 */
const profile = () => {
    return http.get('/api/adminUser/profile')
}

/* 上传图片 */
const upload = (file) => {
    let fm = new FormData();
    fm.append('file', file)
    return http.post('/api/upload/file', fm);
}

export default {
    login,
    profile
}