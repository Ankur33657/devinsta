const mongoose=require('mongoose');
var validator = require('validator');
const UserSchema=mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength:4,
        maxLength:25
    },
    lastName:{
        type:String,
        maxLength:25
    },
    emailId:{
        type:String,
        unique:true,
        required:true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email");
            }
        }
        
    },
    password:{
        type:String,
        required:true,
        maxLength:25,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Invalid password");
            }
        }
    }
})
module.exports=mongoose.model('user',UserSchema);