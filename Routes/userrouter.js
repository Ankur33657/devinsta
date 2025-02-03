const express=require('express');
const mongoose=require('mongoose');
const router=express.Router();
const User=require('../Model/user');

router.post('/user',async(req,res)=>{
    try{
       const isemailPresent=User.find({emailId:req.body.emailId});
       if(isemailPresent){
        throw new Error("Email already exited");
       }
       const user=new User(req.body);
       await user.save();
       res.status(200).json("User Added Successfully");
    }
    catch(err){
        res.status(400).json(err.message);
    }
})

module.exports=router;
