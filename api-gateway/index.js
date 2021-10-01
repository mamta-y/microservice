const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
const gateway= require('fast-gateway');
const port = 9090;

    // function auth(req,res,next){
    // const token= req.header('token');//
    //  if(!token) return res.status(401).send('access deneid......no token provided');
    //  try{
    // const decodedtoken=jwt.verify(token,'Secretkey')
    // console.log(decodedtoken);
    // req.user=decodedtoken
    // next();
    // }
    // catch(err){
    //     res.status(400).send('invalid token.....')
    // }}
    
        
const auth=(req,res,next)=>{
    if(req.headers.token && req.headers.token !=''){
        next();
    }else{
        res.send(JSON.stringify({message:"access deneid......no token provided"}))
        
    }
}

const server = gateway({
    routes:[{
        prefix:'/post', 
        target:'http://localhost:1000/',
       middlewares:[auth]
    },
    {
        prefix:'/comment', 
        target:'http://localhost:2000/',

    },
    { prefix:'/register', 
    target:'http://localhost:3000/',
    },
    {
        prefix:'/login', 
    target:'http://localhost:4000/',
    }
]
});

server.start(port).then(()=>{
    console.log(`listening to apigateway at ${port}`);
}).catch((err)=>{
    console.log(err);
})