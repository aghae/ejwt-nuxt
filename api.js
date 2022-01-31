const express= require("express")
const app = express()

jwt_envopt =JSON.parse(process.env.ejwt)

const options={
    expire:     jwt_envopt.expire       || 3600 ,      // alive for seconds
    secret :    jwt_envopt.secret       || `$eCr3T`,   // importat!!!! : change it
    sec_cookie: jwt_envopt.sec_cookie   || false,      // if true only pass on https. on develop dont set it to true

    use_redis : jwt_envopt.use_redis    || false,      // use redis or not
    redis_host: jwt_envopt.redis_host   || 'localhost',
    redis_port: jwt_envopt.redis_port   || 6379,
    redis_pass: jwt_envopt.redis_pass   || '',
}

ejwt  = require('express-jwt-enhanced')(options); 
cookieParser = require('cookie-parser')

app.use(express.json())
app.use(express.urlencoded())
app.use(cookieParser())
app.use(function(req,res,next){ejwt.req=req,ejwt.res=res,next()}) 


app.get("/",(req,res)=>{
    res.send(`auth api's : <br>
        <pre>
        auth/login 
        auth/logout
        </pre>
    `)
})

app.post("/login",async (req,res)=>{
    await ejwt.set(req.body)
    res.json({succ:'loggined'})
})

app.get("/logout",async(req,res)=>{
    await ejwt.set({loggined:false})
    res.send('logouted')
})

app.get("/get", async (req,res)=>{
    res.json(await ejwt.get() || {})
})

app.post("/set",async(req,res)=>{
    var data=req.body
    res.json( await ejwt.set(data))
})

app.post("/setkey",async (req,res)=>{
    try{
        data= req.body
        var ret = await ejwt.setkey(data.key,data.val,data.expire || null)
        res.json(ret)
    }catch(err){
        console.log(err)
    }
})

app.post("/unsetkey",async(req,res)=>{
    data = await ejwt.unsetkey(req.body.key)
    res.json(data)
})


app.post('/captcha', async function(req, res) {
    res.type('svg').send(await ejwt.captcha_gen(req.body.type,0,req.body.name))
});

app.post('/captcha_chk', async function(req, res) {     //this must be post method
    req.body[req.body.name]=req.body.text
    res.json(await ejwt.captcha_chk(req.body.name))
})


app.get('/csrfgen', async (req, res)=> {
    res.send(await ejwt.csrfgen())
})

app.get('/csrfchk', async (req, res)=> {
 
    res.json(await ejwt.csrfchk())
    //   var csrf_chk = await ejwt.csrfchk()
    //   if(csrf_chk.err) 
    //       res.send('csruf token error')
    //   else
});

module.exports = app