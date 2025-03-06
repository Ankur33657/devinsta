const express=require('express');
const Message=require("../Model/message");
const {UserAuth}=require('../Routes/auth')
const ChatRouter=express.Router();
ChatRouter.post('/connection/chat',UserAuth,async(req,res)=>{
    try{
        const {fromUserId,toUserId}=req.body;
        const data=await Message.find({
            $or:[
                {
                toUserId:toUserId,
                fromUserId:fromUserId
                },
                {
                    toUserId:fromUserId,
                    fromUserId:toUserId
                }
            ]
           
        })
        if(!data)return res.status(200).json("NO data found");
        res.status(200).json(data);
    }
    catch(error){
        res.status(400).json(error.message);
    }
   
})
module.exports=ChatRouter;