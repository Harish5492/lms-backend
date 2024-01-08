const bcrypt = require('bcrypt');
const model = require('../models/model');

class UserHelper{

    async encryptPassword(userPassword){
       const salt = await bcrypt.genSalt(10);
       const password = await bcrypt.hash(userPassword, salt);
       console.log("password",password)
       return password

    }

    async updateData(email,password){
        await model.findOneAndUpdate(
            { email: email },
            { password: password },
            { new: true }
          );
         
    }

    async userCheck(email,userName,phoneNumber){
        const emailExist = await model.findOne({ email: email })
      if (emailExist) throw "Email already exists";
      const usernameExist = await model.findOne({ userName: userName })
      if (usernameExist) throw "UserName already exists";
      const phoneExist = await model.findOne({ phoneNumber: phoneNumber })
      if (phoneExist) throw "phonNumber already exists"
    }

     generateAlphanumericCode() {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let code = '';
    
      for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters.charAt(randomIndex);
      }
    
      return code;
    }

   
}

module.exports = new UserHelper()