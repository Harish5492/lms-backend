const mongoose = require('mongoose')

const UserDetails = new mongoose.Schema({
  firstName:{ type: String, required: [true,"First name is Required"] },
  lastName:{ type: String, required: [true,"Last name is Required"] },
  userName:{ type: String, unique:true, required: [true,"User name is Required"] },
  phoneNumber:{ type: Number, required: [true,"Phone number is Required"] },
  email:{ type: String, unique:true, required: [true,"User email is Required"] },
  password:{ type: String, required: [true,"User password is Required"]},
  role:{type: String, required:[true,"User password is Required"]},
  created_on: {type: Date, default: Date.now}
});
  
module.exports = mongoose.model('UserDetails', UserDetails)