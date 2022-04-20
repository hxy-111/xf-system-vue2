import http from './http'

/* 订单列表 */
const orders = (pageNumber = 1, pageSize = 10, orderNo = '', orderStatus = '') => {
    return http.get('/api/orders', {
        params: {
            pageNumber,
            pageSize,
            orderNo,
            orderStatus
        }
    })
}

/* 获取订单详细信息 */
const ordersInfo = (id) => {
    return http.get(`/api/orders/${id}`)
}

/* 配货完成 */
const ordersCheckDone = (ids) => {
    return http.put('/api/orders/checkDone', {
        ids
    });
}

/* 出库 */
const ordersCheckOut = (ids) => {
    return http.put('/api/orders/checkOut', {
        ids
    });
}

/* 删除订单 */
const ordersClose = (ids) => {
    return http.put('/api/orders/close', {
        data: ids
    });
}

export default {
    orders,
    ordersInfo,
    ordersCheckDone,
    ordersCheckOut,
    ordersClose
}