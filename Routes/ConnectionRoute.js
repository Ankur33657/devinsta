const express=require("express");
const connectionRouter=express.Router();
const connection = require("../Model/connection");
const {UserAuth} =require('./auth');
const User=require('../Model/user')
const mongoose=require('mongoose');

connectionRouter.post('/connection/request/:status/:userId',UserAuth,async(req,res)=>{
  try{
      const fromuser=req.user._id;
      const touser=req.params.userId;
      const status=req.params.status;
      
      if(fromuser.toString()===touser.toString()){
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
      if(status ==="ignored"){
        return res.status(200).json("You ignored the profile");
        
      }
      
      const data=new connection({
        fromUserId:fromuser,
        toUserId:touser,
        status:status
      })
    
      await data.save();
      return res.status(200).send("Connection successfully");
  }
  catch(error){
    res.status(400).json("Final error");
  }
})

connectionRouter.post('/connection/review/:statusReview/:connectionId',UserAuth,async(req,res)=>{
  try {
    const loginUser = req.user._id;
    const { statusReview, connectionId } = req.params;

    // Validate statusReview
    if (statusReview !== "accepted" && statusReview !== "rejected") {
        throw new Error("Invalid request1");
    }

    // Find user with matching criteria
    const user = await connection.findOne({
        _id: new mongoose.Types.ObjectId(connectionId),
        status: "interested",
        toUserId: loginUser
    });

    // Check if the user exists
    if (!user) {
        throw new Error("Invalid request2");
    }

    // If status is 'rejected', delete the user
    if (statusReview === "rejected") {
        await connection.deleteOne({ _id: connectionId });
        return res.status(200).json({ message: "User connection rejected and deleted" });
    }

    // Otherwise, update the status
    user.status = statusReview;
    await user.save();

    res.status(200).json({ message: "Status updated successfully" });
} catch (error) {
    res.status(400).json({ error: error.message });
}


})

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
})

connectionRouter.get('/feed',UserAuth,async(req,res)=>{
  try{
    const userId = req.user._id;

    // Get all users (assuming 'User' is your users collection model)
    const allUsers = await User.find({_id: { $ne: userId }});

    
    // Get connected users based on the user's connections
    const connectedUsers = await connection.find({
      $and: [
        {
          $or: [
            { fromUserId: userId },
            { toUserId: userId }
          ]
        },
        {$or:[
          { status: "accepted" },
          {status:"interested"}
          
        ]}
      ]
    }).select('fromUserId toUserId');

    let filteredConnectedUsers =[];
    for (const c of connectedUsers) {
      if(c.fromUserId.toString()===userId.toString()){
        filteredConnectedUsers.push(c.toUserId);
      }
      else{
        filteredConnectedUsers.push(c.fromUserId);
      }
    }
    let feeduser=[];
    for(const c of allUsers){
      if(!filteredConnectedUsers.find(x => x.toString() === c._id.toString())){
        feeduser.push(c);
        
      }
    }

    res.status(200).json(feeduser);

  }
  catch(error){
    res.status(400).json(error.message);
  }
   
})

module.exports=
    connectionRouter

  

