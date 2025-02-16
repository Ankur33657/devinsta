const express=require('express');
const mongoose=require('mongoose');
const userRouter=require('./Routes/userrouter');
const connectionRouter=require('./Routes/ConnectionRoute');
const cookieParser = require('cookie-parser');
const cors = require('cors')
require('dotenv').config();
const app=express();
app.use(cors({
  origin: "http://localhost:5173" ,
   credentials: true,
  }));
app.use(express.json());
app.use(cookieParser());
app.use('/api',userRouter);
app.use('/api',connectionRouter);
mongoose.connect(process.env.MONGO_URL)
.then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log("Server & db started ",process.env.PORT);
    })
}).catch((error)=>{
  console.log(error.message);
})