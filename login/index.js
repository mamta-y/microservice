const express = require('express');
const mongoose=require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const app = express();
const port =4000;
app.use(express.json());
mongoose.connect('mongodb://localhost:27017/verifying')
.then(()=>
    console.log('connected to db'))
    .catch((err)=> console.log('not connecting'))
    const User = mongoose.model('User',new mongoose.Schema({
        
        email:{
            type:String,
            required:true,
            minlength:5,
            maxlength:50,
            unique:true 
        },
    password:{
        type:String,
        required:true,
        minlength:5,
        maxlength:250 
    }
   
    }));

    app.post('/api/login', async (req, res) => {
        const result = validateCred(req.body); 
        if (result.error) {
            res.status(400).send(result.error.details[0].message)
        }
        let user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(400).send('email doesnot exist, please register') 
        
         const validpswd=await bcrypt.compare(req.body.password,user.password) 
        if(!validpswd) return res.status(400).send('invalid email and  password');
       
      const token= jwt.sign({_id:user._id},'Secretkey');
        res.send(token);
        });
    function validateCred(user){
        const schema = Joi.object({
           email:Joi.string().required().min(5).max(50).email(),
           password:Joi.string().required().min(5).max(50)
        });
        return schema.validate(user);
    } 
    app.listen(port, ()=>{
        console.log(`listening to port ${port}`);
    })
    