# JWT Nuxt module  
wrapper for [Express JWT Enhanced](https://www.npmjs.com/package/express-jwt-enhanced)

easy json web token on nuxt

### insall
`  npm install ejwt-nuxt `

### usage
in nuxt.config :

    modules : [
        .
        .

        ['ejwt-nuxt',{

            apiPath:'/auth',          //ejwt-nuxt module api's path that end user see

            loginUrl:'/your/api/login',    //server callback for login
            redirect:{
                login  : '/afer/success/login',   //if not be set redirect to current route
                logout : 'after/success/logout'   //if not be set redirect to current route
            },

            //enhanced express jwt default opttions :
            // you can set none or some these
             sec_cookie:true,
             expire: 3600,           // alive for seconds
             secret :`$eCr3T`,       // importat!!!! : change it
             sec_cookie: false,      // if true only pass on https. on develop dont set it to true
             use_redis : false,      // use redis or not
             redis_host:'localhost',
             redis_port:6379,
             redis_pass:'',

        }],

    ]
    

### login callback :
for example  `/your/api/login` that has shown in above as `loginUrl` can be like this :`

    const express = require('express)
    app=express()

    app.post("/login",async (req,res)=>{
        var user=req.body.user,
            pass=req.body.pass
        
        if(user=='aghae' && pass=='123'){
            res.json({
                        loggined:true,      //important : for authed user must be set
                        //... extra data
                   
                    })
        }
        else
            res.json({err:'Invalid username or password'})
    })

### api's

* **loggined()** : check loggined or not ; return true or false

* **login({user,pass},redirect='')** :call login callback 
        
        <button @click="$ejwt.login({user,pass})">login</button>

        <button @click="$ejwt.login({user,pass},'path/to/redirect/url')">login</button>

* **logout({user,pass},redirect)**

        <button @click="$ejwt.logout()">logout</button>

        <button @click="$ejwt.logout('path/to/redirect/url')">logout</button>

* **set(payload)**

        <button @click="$ejwt.set({profile:{name:'aghae'}})">set</button>
    
* **setkey({key,val,expire=''})** : expire in seconds

        <button @click="$ejwt.setkey({key:'profile.favs',val:['watch Movie','Read Book'],expire:5})">setkey</button>

* **unsetkey(key)**
        
        <button @click="$ejwt.unsetkey({name:'profile.favs'})">unsetkey</button>
        
   
* **get(key='')**  : if key not be set. it will return all payload 
       
        //in template
        {{$ejwt.get()}}   

        //in methods    
        var payload = this.$ejwt.get()

* **fetch()**  :  fetch payload on refresh page:

    *for ssr app  ,   in store/index.js :*

        export const actions = {
            .
            .
            async nuxtServerInit ({dispatch}) {
                this.$ejwt.fetch()
            } 

        }

    
    *for spa app in nuxt page :*  

        export default {
            .
            .  
            async fetch() {
                this.$ejwt.fetch()   
            },
        }


* **captcha_get(type='math',name='captcha')**  //type= math or text

        //in template :
        <div ref='captcha'></div>

        //in methods:
        this.$refs.captcha.innerHTML = await this.$ejwt.captcha_gen('math','captcha_name')

* **captcha_check(text,name='captcha')**  

        await this.$ejwt.captcha_chk(this.captcha_txt,'captcha_name')


* **csrfgen()**  : generate csurf

        await this.$ejwt.csrfgen()


* **csrfchk()**  :check csurf
    
        var csrf_chk = await this.$ejwt.csrfchk()

        if(csrf_chk.err) 
            console.log('csruf token error')
        else
            do somthing....



Fin.


