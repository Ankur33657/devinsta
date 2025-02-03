const express=require('express');
const mongoose=require('mongoose');
const router=express.Router();
const User=require('../Model/user');
const {isValidation}= require('../utils/validation')
router.post('/user',async(req,res)=>{
    try{
       isValidation(req);
       const user=new User(req.body);
       await user.save();
       res.status(200).json("User Added Successfully");
    }
    catch(err){
        res.status(400).json(err.message);
    }
})

module.exports=router;
