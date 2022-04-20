const env = process.env.NODE_ENV;
module.exports = {
    publicPath: './',
    lintOnSave: env !== 'production',
    productionSourceMap: false,
    devServer: {
        proxy: {
            '/api': {
                target: 'http://backend-api-02.newbee.ltd/manage-api/v1',
                // target: 'http://backend-api-02.newbee.ltd/',
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    }
};