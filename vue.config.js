module.exports = {
    publicPath: '/',
    outputDir: 'dist',
    // assetsDir: "",
    // indexPath: 'index.html',
    filenameHashing: true,
    // lintOnSave: false,
    // runtimeCompiler: false,
    // transpileDependencies: [],
    // productionSourceMap: false,
    // integrity: false,
    // configureWebpack:{ 
    //     resolve:{   
    //         alias:{
    //             '@': resolve('src'),
    //         } 
    //     }
    // },
    devServer: {
        port: 8082,
        host: '0.0.0.0',
        open: false,
        https: false,
        overlay: {
            warnings: true,
            errors: true
        },
        proxy: {
            '/api': {
                target: process.env.VUE_APP_URL,
                ws: true,
                changeOrigin: true
                // pathRewrite: {
                //     '^/api': "/api"
                // }
            }
        }
    }
}