const express = require('express');
const mongoose=require('mongoose');
const Joi = require('joi');
const app = express();
const port =1000;
app.use(express.json());
mongoose.connect('mongodb://localhost:27017/posting')
.then(()=>
    console.log('connected to db'))
    .catch((err)=> console.log('not connecting'))
    const Post =  mongoose.model('Post', new mongoose.Schema({
        title:{
            type:String,
            required:true,
            minlength:6,
            maxlength:15,
            trim:true
        },
        postt:{
            type:String,
            required:true,
            minlength:6,
            maxlength:50,
            trim:true
            
    
        },
        author:{
            type:String,
            required:true,
            minlength:6,
            maxlength:15,
            trim:true
        },
        imageURL:{
            type:String,
    
        },
        date:{
          type:Date,
          required:true,
          default:Date.now
    
        }
    }))
    app.get('/api/posted',async (req,res)=>{
        const posts = await Post.find();
        res.send(posts);
    })
    app.get('/api/posted/:id' ,async (req,res)=>{
       const post= await Post.findById(req.params.id);
       if(!post) res.status(404).send('post not found')
       res.send(post);
    })
    app.post('/api/posted',async (req,res)=>{
        const result=validatePost(req.body);
        if(result.error){
            res.status(400).send(result.error.details[0].message)
        }
         let post = new Post({
            title:req.body.title,
            postt:req.body.postt,
            author:req.body.author,
            imageURL:req.body.imageURL,
            date:req.body.date
        });
        post= await post.save();
        res.send(post);
    })

    app.put('/api/posted/:id',async(req,res)=>{
        const result = validatePost(req.body); 
    if(result.error){
        res.status(400).send(result.error.details[0].message)}
     const post=await Post.findByIdAndUpdate(req.params.id,{ title:req.body.title,
        postt:req.body.postt,
        author:req.body.author,
        imageURL:req.body.imageURL,
        date:req.body.date}
       ,{new:true});
     res.send(post);
    })
    
    app.delete('/api/posted/:id',async(req,res)=>{
     const post= await Post.findByIdAndRemove(req.params.id);
     if(!post) res.status(404).send('post not found')
     res.send(post);
    })
   
  function validatePost(post){
        const schema = Joi.object({
            title:Joi.string().required().min(6).max(15).trim(),
            postt:Joi.string().required().min(6).max(50).trim(),
            author:Joi.string().required().min(6).max(50).trim(),
            imageURL:Joi.string(),
            date:Joi.date()
        });
        return schema.validate(post);
    }
    app.listen(port, ()=>{
        console.log(`listening to port ${port}`);
    })