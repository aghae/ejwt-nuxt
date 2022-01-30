
 export default{
   namespaced: true,  //very important
   state  :{
      session:{},
      
   },

   //mutions called with $store.commit command
   mutations :{
      setState (state, {name, val}) {
            state[name] = val
      },
      getState(state, name) {
         return state[name] 
      }
   },

   //actions called with this.$store.dispatch
   actions : {

      login({commit},{data}){
         return this.$axios.post(this.$config.ejwt.loginUrl,data)
                  .then( res=>{
                     if(res.data.err){
                           return {err:res.data.err}
                     }
                     else if(res.data.loggined){

                        return this.$axios.post(this.$config.ejwt.apiPath+'/login',res.data)
                              .then(result=>{
                                 commit('setState',{name:'session',val:res.data})
                                 return {succ: true}
                              })
                              .catch(err=>{
                                 return {err: err.message}
                              })

                     }
                  })
      },

      logout({commit}){
         return this.$axios.get(this.$config.ejwt.apiPath+'/logout')
               .then(res=>{
                  commit('setState',{name:'session',val:{loggined:false}})
                  return {succ : true}
               })
      },

      get({commit}){
         return  this.$axios.get(this.$config.ejwt.apiPath+'/get')
                  .then((res)=>{
                        // res.data.loggined =res.data.loggined || false
                        commit('setState',{name:'session',val:res.data})
                  })
      },

      set({commit,state},payload){
         payload.loggined = state.session.loggined
         return this.$axios.post(this.$config.ejwt.apiPath+'/set',payload) //{withCredentials:true},
                  .then(res=>{
                     commit('setState',{name:'session',val:res.data})
                  })
      },

      setkey({commit,state},payload){  //payload ={ key,val,expire}
         return  this.$axios.post(this.$config.ejwt.apiPath+'/setkey',payload)
                  .then( res=>{  
                     commit('setState',{name:'session',val:res.data})
                  })
      },

      unsetkey({commit,state},payload){  //payload ={name:}
         return this.$axios.post(this.$config.ejwt.apiPath+'/captcha_gen',payload)
               .then( res=>{
                  commit('setState',{name:'session',val:res.data})
               })
      },
      


   }

}

