const express=require("express");
const connectionRouter=express.Router();
const connection = require("../Model/connection");
const {UserAuth} =require('./auth');
<<<<<<< HEAD
const User=require('../Model/user')
=======
>>>>>>> 860e64d3d546d3919ddb98f6339271865758067c
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

<<<<<<< HEAD
connectionRouter.get('/connection/viewallconnection', UserAuth, async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch all accepted connections involving the user
    const connections = await connection.find({
      $or: [{ fromUserId: userId }, { toUserId: userId }],
      status: "accepted"
    });

    // Extract IDs of the connected users
    const userIds = connections.map(conn => 
      conn.fromUserId.toString() === userId.toString() ? conn.toUserId : conn.fromUserId
    );

    // Fetch details of all connected users
    const otherUsers = await User.find({ _id: { $in: userIds } });

    res.status(200).json(otherUsers);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


connectionRouter.get('/connection/allpendingrequest', UserAuth, async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch all pending requests where the user is the recipient
    const pending = await connection.find({
      toUserId: userId,
      status: "interested"
    });

    // Extract all fromUserIds
    const fromUserIds = pending.map(request => request.fromUserId);

    // Fetch user profiles of the senders
    const fromUserProfiles = await User.find({ _id: { $in: fromUserIds } });

    // Map user profiles with their corresponding connection ID
    const response = pending.map(request => {
      const userProfile = fromUserProfiles.find(user => user._id.toString() === request.fromUserId.toString());
      return {
        connectionId: request._id,  // Adding connection ID
        fromUser: userProfile        // Adding user profile details
      };
    });

    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

connectionRouter.get('/allcountconnection',UserAuth,async(req,res)=>{
     try{
      const userId=req.user._id;
       const pending_request=await connection.find({
        $and:[
          {toUserId:userId},
          {status:"interested"}
        ]
       });
       const connection_request=await connection.find({
        $and:[
          {$or:[
            {fromUserId:userId},
            {toUserId:userId}
          ]},
          {status:'accepted'}

        ]
       });
       
       res.status(200).json({
        pending_count: pending_request.length, 
        connection_count: connection_request.length 
      });
     }
     catch(err){
      res.status(400).json(err.message);
     }
=======
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
>>>>>>> 860e64d3d546d3919ddb98f6339271865758067c
})

module.exports=
    connectionRouter

  

