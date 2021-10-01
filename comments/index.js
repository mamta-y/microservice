const mongoose = require('mongoose');

const express = require('express');
const app = express();
const Joi = require('joi');
const port =2000;
app.use(express.json());
mongoose.connect('mongodb://localhost:27017/posting')
.then(()=>
    console.log('connected to db'))
    .catch((err)=> console.log('not connecting'))

    const Comment = mongoose.model('Comment', new mongoose.Schema({
        id:{
         type:String,
         required:true
        },
         coment:{
             type:String,
             minlength:5,
             maxlength:200,
             required:true,
             trim:true
         }
     }))
     
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
    
     app.get('/api/comment/:id' ,async (req,res)=>{
        const comments= await Comment.findById(req.params.id);
        if(!comments) res.status(404).send('comment with id  not found')
        res.send(comments);
     })
    app.post('/api/comment', async (req, res) => {
    const result = validateComments(req.body); 
    if (result.error) {
        res.status(400).send(result.error.details[0].message)
    }
    let comment = new Comment({
        id:req.body.id,
        coment:req.body.coment
    })
     comment= await comment.save();
    res.send(comment);
});

app.get('/api/post-comment/:id',async(req,res)=>{
    const post=await Post.findById(req.params.id)
    const comment = await Comment.find();
    let fetching = {
        getpost:post,
        getcomments:comment
    }
    res.send(fetching)
    })

function validateComments(comment){
    const schema = Joi.object({
       coment:Joi.string().required().min(5).max(50).trim(),
       id:Joi.string().required()
       
    });
    return schema.validate(comment);
};
app.listen(port, ()=>{
    console.log(`listening to port ${port}`);
})