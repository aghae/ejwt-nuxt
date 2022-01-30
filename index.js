export default  function(opts={}){
  
    process.env.ejwt =  JSON.stringify(opts)  //for api

    this.addServerMiddleware({ path: opts.apiPath , 
                            //    handler: '~/modules/ejwt/api.js' 
                               handler: '@nuxtjs/ejwt/api.js' 
                            })

    this.options.publicRuntimeConfig.ejwt = this.options.publicRuntimeConfig.ejwt || {}
    this.options.publicRuntimeConfig.ejwt.apiPath = opts.apiPath
    this.options.publicRuntimeConfig.ejwt.loginUrl = opts.loginUrl

    this.addPlugin({
        src:  __dirname+'/plugin.js',
        options: opts 
    })
    
}


module.exports.meta = require('./package.json')
