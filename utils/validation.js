const User = require('../Model/user'); 

const isValidation = async (req) => {
  try{
      const isPresent = await User.findOne({ emailId: req.body.emailId }); 
      if (isPresent) { 
        return new Error("Email already exists");
      }
  }
  catch(error){
    console.log("Email is already exist");
  }
  
};

module.exports = { isValidation };