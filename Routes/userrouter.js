const express=require('express');
const router=express.Router();
const User=require('../Model/user');
const Bcrypt=require('bcrypt');
const jwt = require('jsonwebtoken');
const {UserAuth} =require('./auth')


router.post('/signup',async(req,res)=>{
    try{
       
        const {firstName,lastName,emailId,password}=req.body;
        const isPresent=await User.findOne({emailId:emailId});
        if(isPresent)throw new Error("Email already exits1");
       const passwordHash=await Bcrypt.hash(password,12)
       const user=new User({
        firstName:firstName,
        lastName:lastName,
        emailId:emailId,
        password:passwordHash
       });
       await user.save();
       res.status(200).json("User Added Successfully");
    }
    catch(err){
        res.status(400).json(err.message);
    }
})

router.post("/login", async (req, res) => {
    try {
      const { emailId, password } = req.body;
      if (!emailId || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }
  
      const user = await User.findOne({ emailId });
      if (!user) {
        return res.status(400).json({ error: "Invalid Credentials" });
      }
  
      const isCorrectPassword = await Bcrypt.compare(password, user.password);
  
      if (!isCorrectPassword) {
        return res.status(400).json({ error: "Invalid Credentials" });
      }
  
      // Generate JWT token
      const token = await jwt.sign({ _id: user._id }, process.env.SECRET_KEY);
  
      // Set token in cookies
      res.cookie("token", token);
  
      res.status(200).json({ message: "Login successful", user });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  

router.get('/logout',async(req,res)=>{
    try{
        
        res.clearCookie('token',null).json("Logout Successfully");

    }
    catch(error){
        res.status(200).json({Error:Error.message});
    }

})

router.get('/profile',UserAuth,async(req,res)=>{
    try{
        if(!req.user){
            throw new Error("User not Login");
        }
        res.status(200).json(req.user)
    }
    catch(error){
        res.status(400).json({Error:Error.message});
    }
})
router.patch('/profile/edit', UserAuth,async(req,res)=>{
    try{
        const user=req.user;
        const update=req.body;
     
        if(update.emailId)throw new Error("Email should not be updated");
        if(update.password)throw new Error("Password should not be updated");
        const updatedData=await User.findOneAndUpdate({_id:user._id},update,{runValidators:true});
        await updatedData.save();
        res.status(200).json("update successfully");

    }catch(error){
        res.status(400).json(error.message);
    }

        
})


module.exports=router;
