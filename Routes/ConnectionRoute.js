const express=require("express");
const connectionRouter=express.Router();
const connection = require("../Model/connection");
const {UserAuth} =require('./auth');
connectionRouter.post('/connection/:status/:userId',UserAuth,async(req,res)=>{
  try{
      const fromuser=req.user._id;
      const touser=req.params.userId;
      const status=req.params.status;
      if(fromuser==touser){
        throw new Error("Invalid connections");
      }
      else if(!(status=="interested" || status=="ignored")){
        throw new Error("Invalid connetions");
      }
      const isConnection=await connection.findOne({
        $or:[
        {fromUserId:fromuser,toUserId:touser},
        {fromUserId:touser,toUserId:fromuser}
        ]
      })
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
module.exports=
    connectionRouter

