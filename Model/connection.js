const mongoose=require('mongoose');
const ConnectionSchema=new mongoose.Schema({
 fromUserId:{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
 },
 toUserId:{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
 },
 status:{
     type:String,
     enum:["interested","ignored","accepted","rejected"],
     required:true
 }
},{timestamps:true})
module.exports=mongoose.model('connection',ConnectionSchema);