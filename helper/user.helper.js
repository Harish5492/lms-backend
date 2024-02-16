const bcrypt = require('bcrypt');
const model = require('../models/usermodel');

class UserHelper {

  async encryptPassword(userPassword) {
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(userPassword, salt);
    console.log("password", password)
    return password;

  }

  async updateData(email, password) {
    await model.findOneAndUpdate(
      { email: email },
      { password: password },
      { new: true }
    ); 
  }

  async userCheck(email, userName, phoneNumber) {
    console.log("inside usercheck")
    const emailExist = await model.findOne({ email: email })
    if (emailExist) throw { message: "Email already exists", status: false };
    const usernameExist = await model.findOne({ userName: userName })
    if (usernameExist) throw { message: "UserName already exists", status: false };
    const phoneExist = await model.findOne({ phoneNumber: phoneNumber })
    if (phoneExist) throw { message: "phoneNumber already exists", status: false }
  }


}

module.exports = new UserHelper()