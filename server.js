const express=require('express');
const mongoose=require('mongoose');
const Router=require('./Routes/userrouter');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const app=express();
app.use(express.json());
app.use(cookieParser());
app.use('/api',Router);
mongoose.connect(process.env.MONGO_URL)
.then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log("Server & db started ");
    })
}).catch((error)=>{
  console.log(error.message);
})