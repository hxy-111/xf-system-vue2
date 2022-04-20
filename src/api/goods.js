import http from './http'

/* 商品列表 */
const indexConfigs = (pageNumber = 1, pageSize = 10, configType = 3) => {
    return http.get('/api/indexConfigs', {
        params: {
            pageNumber,
            pageSize,
            configType
        }
    })
}

/* 获取商品详细信息 */
const indexConfigsInfo = (id) => {
    return http.get(`/api/indexConfigs/${id}`)
}

/* 新增商品 */
const indexConfigsInsert = (data) => {
    return http.post('/api/indexConfigs', data)
}

/* 修改商品 */
const indexConfigsUpdate = (data) => {
    return http.put('/api/indexConfigs', data)
}

/* 删除商品 */
const indexConfigsRemove = (ids) => {
    return http.delete('/api/indexConfigs', {
        data: ids
    })
}

/* 商品管理查询 */
const goodsList = (pageNumber = 0, pageSize = 10) => {
    return http.get('/api/goods/list', {
        params: {
            pageNumber,
            pageSize,
        }
    })
}

/* 商品上架 */
const goodsOn = (ids) => {
    return http.put('/api/goods/status/0', {
        ids: ids
    })
}

/* 商品下架 */
const goodsOff = (ids) => {
    return http.put('/api/goods/status/1', {
        ids: ids
    })
}

/* 商品管理详细信息 */
const goodsInfo = (ids) => {
    return http.get(`/api/goods/${ids}`)
}

/* 商品管理新增 */
const goodsInsert = (data) => {
    return http.post('/api/goods', data)
}

/* 商品管理修改 */
const goodsUpdate = (data) => {
    return http.put('/api/goods', data)
}

export default {
    indexConfigs,
    indexConfigsInfo,
    indexConfigsInsert,
    indexConfigsUpdate,
    indexConfigsRemove,
    goodsList,
    goodsOn,
    goodsOff,
    goodsInfo,
    goodsInsert,
    goodsUpdate
}