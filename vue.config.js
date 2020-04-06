module.exports = {
    lintOnSave: true,
    productionSourceMap: false,
    pages: {
        index: {
            entry: 'src/main.js',
            template: 'public/index.html',
        }
    },
    devServer: {
        host: '127.0.0.1',
        port: 8090,
        proxy: {
            '/api/': {
                target: 'http://127.0.0.1:5000',
                changeOrigin: true,
            }
        }
    },
    css: {
        loaderOptions: {
            sass: {
                prependData: `@import '~@/assets/css/color.scss';`
            }
        }
    }
}