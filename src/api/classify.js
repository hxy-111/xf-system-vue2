import http from './http'

/* 分类管理列表 */
const categories = (pageNumber = 1, pageSize = 10, categoryLevel = 1, parentId = 0) => {
    return http.get('/api/categories', {
        params: {
            pageNumber,
            pageSize,
            categoryLevel,
            parentId
        }
    })
}

/* 获取分类详细信息 */
const categoriesInfo = (id) => {
    return http.get(`/api/categories/${id}`)
}

/* 新增分类 */
const categoriesInsert = (data) => {
    return http.post('/api/categories', data);
}

/* 修改分类 */
const categoriesUpdate = (data) => {
    return http.put('/api/categories', data);
}

/* 删除分类 */
const categoriesRemove = (ids) => {
    return http.delete('/api/categories', {
        data: ids
    });
}

export default {
    categories,
    categoriesInfo,
    categoriesInsert,
    categoriesUpdate,
    categoriesRemove
}