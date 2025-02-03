const User = require('../Model/user'); 

const isValidation = async (user) => {
  try{
      const isPresent = await User.findOne({ emailId: user.emailId }); 
      if (isPresent) { 
        throw new Error("Email already exists");
      }
  }
  catch(error){
    console.log("Email is already exist");
  }
  
};

module.exports = { isValidation };