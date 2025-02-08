const express=require("express");
const connectionRouter=express.Router();
const connection = require("../Model/connection");
const {UserAuth} =require('./auth');
const mongoose=require('mongoose');

connectionRouter.post('/connection/request/:status/:userId',UserAuth,async(req,res)=>{
  try{
      const fromuser=req.user._id;
      const touser=req.params.userId;
      const status=req.params.status;
      if(fromuser==touser){
        throw new Error("Invalid connections");
      }
      else if(!(status==="interested" || status==="ignored")){
        throw new Error("Invalid connetions");
      }
      const isConnection=await connection.findOne({
        $or:[
        {fromUserId:fromuser,toUserId:touser},
        {fromUserId:touser,toUserId:fromuser}
        ]
      },{runValidator:true})
      if(isConnection){
        throw new Error("Invalid connections");
      }
      const data=new connection({
        fromUserId:fromuser,
        toUserId:touser,
        status:status
      })
      await data.save();
      res.send("Connection successfully");
  }
  catch(error){
    res.status(400).json(error.message);
  }
})

connectionRouter.post('/connection/review/:status/:connectionId',UserAuth,async(req,res)=>{
  try{
    const loginUser=req.user._id;
    const {status,connectionId}=req.params;
    if(!(status=='accepted' || status=='rejected')){
       throw new Error("Invalid request");
    }
    const user=await connection.findById({
      _id: new mongoose.Types.ObjectId(connectionId), 
     status:"interested",
     toUserId:loginUser
    },{runValidator:true})
    if(!user){
      throw new Error("Invalid request");
    }
    console.log(user);
    user.status=status;
    await user.save()
    res.status(200).json("Requested");
  }
  catch(error){
    res.status(400).json(error.message);
  }

})

connectionRouter.get('/connection/viewallconnection',UserAuth,async(req,res)=>{
  try{
    const userId=req.user._id;
    
    const view=await connection.find({
      $and:[
        {$or:[
          {fromUserId:userId},
          {toUserId:userId}
       ]},
       {status:"accepted"}
      ]
    
    
    })
    res.status(200).json(view);
  }
  catch(error){
    res.status(400).json({error});
  }
})

connectionRouter.get('/connection/allpendingrequest',UserAuth,async(req,res)=>{
  try{
    const userId=req.user._id;
    const pending=await connection.find({
      toUserId:userId,
      status:"interested"
    })
    res.status(200).json(pending);

  }
  catch(error){
    res.status(400).json(error);
  }
})

module.exports=
    connectionRouter

  

