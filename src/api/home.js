/* 主页配置下的接口管理 */
import http from "./http";

/* 轮播图列表 */
const carousels = (pageNumber = 1, pageSize = 10) => {
    return http.get('/api/carousels', {
        params: {
            pageNumber,
            pageSize
        }
    })
};

/* 获取轮播图详细信息 */
const carouselsInfo = (id) => {
    return http.get(`/api/carousels/${id}`)
}

/* 删除轮播图信息 */
const carouselsRemove = (ids) => {
    return http.delete('/api/carousels', {
        data: ids
    })
}

/* 修改轮播图信息 */
const carouselsUpdate = (data) => {
    return http.put('/api/carousels', data);
}

/* 新增轮播图信息 */
const carouselsInsert = (data) => {
    return http.post('/api/carousels', data);
}

export default {
    carousels,
    carouselsInfo,
    carouselsRemove,
    carouselsUpdate,
    carouselsInsert
}