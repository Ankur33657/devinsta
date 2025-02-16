const socket=require('socket.io')
const InitializingSocket= (server)=>{
   const io=socket(server,{
    cors:{
        origin:'http://localhost:5173'
    },
   });
   io.on("connection",(socket)=>{
    //handle event

    socket.on("joinchat",({targetuserId,UserId})=>{
      const room=[targetuserId,UserId].sort().join("_");
      console.log("Joining room ",room);
      socket.join(room);
    })
    socket.on("sendmessage",({targetuserId,UserId,message})=>{
     const room =[targetuserId,UserId].sort().join("_");
     io.to(room).emit("messagerecieve" , {message});
    
    })

    socket.on("disconnect",()=>{
        
    })
   })
}
module.exports=InitializingSocket