const express = require('express');
const mongoose=require('mongoose');
const bcrypt = require('bcrypt');
const lodash = require('lodash');
const Joi = require('joi');
const app = express();
const port =3000;
app.use(express.json());
mongoose.connect('mongodb://localhost:27017/verifying')
.then(()=>
    console.log('connected to db'))
    .catch((err)=> console.log('not connecting'))

    const User = mongoose.model('User',new mongoose.Schema({
        name:{                     
            type:String,
            required:true,
            minlength:5,
            maxlength:15,
            trim:true
        } ,
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
    },
    phone:{
        type:Number,
          required:true,
          }
    }));


    app.post('/api/register', async (req, res) => {
        const result = validateUser(req.body); 
        if (result.error) {
            res.status(400).send(result.error.details[0].message)
        }
        let user = await User.findOne({ email: req.body.email });
        if (user) return res.status(400).send('email already exist')
       
        user = new User(lodash.pick(req.body, ["name", "email", "password","phone"]));
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password,salt);
        user = await user.save();
      res.send(lodash.pick(user, ["name", "email","phone"]));
        
        
    });
    function validateUser(user){
        const schema = Joi.object({
            name:Joi.string().min(5).max(15).required().trim(),
           email:Joi.string().required().min(5).max(50).email(),
           password:Joi.string().required().min(5).max(50),
    phone:Joi.string().required().length(10),
      });
        return schema.validate(user);
    } 
    app.listen(port, ()=>{
        console.log(`listening to port ${port}`);
    })