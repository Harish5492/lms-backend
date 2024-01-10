const mongoose = require('mongoose')

const validRoles = ['admin', 'user'];

const UserDetails = new mongoose.Schema({
  firstName: { type: String, required: [true, "User Name is Required"] },
  lastName: { type: String, required: [true, "User Name is Required"] },
  userName: { type: String, unique: true, required: [true, "User Name is Required"] },
  phoneNumber: { type: Number, unique: true, required: [true, "Phone Number is Required"] },
  email: { type: String, unique: true, required: [true, "User email is Required"] },
  password: { type: String, required: [true, "User password is Required"] },
  courseEnrolled: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }], 
  role: { type: String, enum: validRoles, default: 'user'},
  created_on: { type: Date, default: Date.now }  
}); 

module.exports = mongoose.model('UserDetails', UserDetails)  