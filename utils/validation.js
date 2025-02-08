const User = require('../Model/user'); 

const isValidation = async (req) => {
  try{
      const isPresent = await User.findOne({ emailId: req.body.emailId }); 
      if (isPresent) { 
        return new Error("Email already exists");
      }
  }
  catch(error){
    return new Error("Email alredy exit");
  }
  
};

const isUpdate = async(req)=>{
  try{
    if(req.body.email!=null)
      throw new Error("Email Id not be updated");
  }
  catch(error){
    return new Error({error:error.message});
  }
}
module.exports = { isValidation,isUpdate };