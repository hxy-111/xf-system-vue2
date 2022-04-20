import http from './http'

/* 会员列表 */
const users = (pageNumber = 1, pageSize = 10) => {
    return http.get('/api/users', {
        params: {
            pageNumber,
            pageSize
        }
    })
}

/* 禁用账户 */
const usersLocked = (ids) => {
    return http.put('/api/users/1', {
        ids
    });
}

/* 解除禁用 */
const usersUnLocked = (ids) => {
    return http.put('/api/users/0', {
        ids
    });
}

export default {
    users,
    usersLocked,
    usersUnLocked
}