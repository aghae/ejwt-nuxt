
// import ejwtstore from  '~/modules/__ejwt/store.js'
import ejwtstore from  '@nuxtjs/ejwt/store.js'

export default  (ctx,inject) => {
  //important :get options from addplugin
  const opts = JSON.parse('<%= JSON.stringify(options) %>')

   ctx.store.registerModule('ejwt', ejwtstore)
   
   inject('ejwt',{
      loggined : ()   => ctx.store.state.ejwt.session['loggined'],
      login:(data,redirect=opts.redirect.login) => {
         return ctx.store.dispatch('ejwt/login',{data}).then(ret=>{
            if(ret.succ && redirect){
               ctx.redirect(redirect)
            }
            return ret
         })  
      },
      logout: (redirect=opts.redirect.logout)=>{
         ctx.store.dispatch('ejwt/logout').then(ret=>{
            if(ret.succ && redirect){
               ctx.redirect(redirect)
            }
         })
      },
      fetch:()        => ctx.store.dispatch('ejwt/get'),
      get: (key='')   => key?ctx.store.state.ejwt.session[key]:ctx.store.state.ejwt.session,
      set:      data  => ctx.store.dispatch('ejwt/set',data),      
      setkey:   data  => ctx.store.dispatch('ejwt/setkey',data),  // data={ key,val,expire}
      unsetkey: data  => ctx.store.dispatch('ejwt/unsetkey',data),  
      captcha_gen: async(type='math',name='captcha') =>  {  //type=math or text
            return await ctx.$axios.post(ctx.$config.ejwt.apiPath+`/captcha`,{type,name})
               .then( res=>{ 
                     return res.data
               })
      },

      captcha_chk: async (text,name='captcha') => {
         return await ctx.$axios.post(ctx.$config.ejwt.apiPath+'/captcha_chk',{text,name})
               .then( res=>{ 
                     return res.data
               })
      },

      csrfgen: async() =>  { 
         return await ctx.$axios.get(ctx.$config.ejwt.apiPath+`/csrfgen`)
            .then( res=>{ 
                  return res.data
            })
      },

      csrfchk: async () => {
         return await ctx.$axios.get(ctx.$config.ejwt.apiPath+'/csrfchk')
               .then( res=>{ 
                     return res.data
               })
      },


   })
  

};