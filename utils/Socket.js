const socket=require('socket.io')
const InitializingSocket= (server)=>{
   const io=socket(server,{
    cors:{
        origin:'http://localhost:5173'
    },
   });
   io.on("connection",(server)=>{
    //handle event

    socket.on("joinchat",()=>{

    })
    socket.on("sendmessage",()=>{

    })

    socket.on("disconnect",()=>{
        
    })
   })
}
module.exports=InitializingSocket