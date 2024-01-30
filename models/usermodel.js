const mongoose = require('mongoose')

const validRoles = ['admin','subAdmin', 'user'];

const UserDetails = new mongoose.Schema({
  firstName: { type: String, required: [true, "User Name is Required"] },
  lastName: { type: String, required: [true, "User Name is Required"] },
  userName: { type: String, unique: true, required: [true, "User Name is Required"] },
  phoneNumber: { type: Number, unique: true, required: [true, "Phone Number is Required"] },
  email: { type: String, unique: true, required: [true, "User email is Required"],lowercase: true },
  password: { type: String, required: [true, "User password is Required"] },
  courseEnrolled: [{ type: mongoose.Schema.Types.ObjectId,  ref: 'Course' }], 
  role: { type: String, enum: validRoles, default: 'user'},
  affilliationLinkRequested: {type: Boolean,default: true },
  rewardRequested: {type: Boolean,default: true },
  created_on: { type: Date, default: Date.now }  
}); 
// UserDetails.pre('findOneAndUpdate', function (next) {
//   console.log("inside db")
//   const update = this.getUpdate();
//   console.log(update)
//   if (update && update.courseEnrolled && Array.isArray(update.courseEnrolled)) {
//     const uniqueCourses = new Set(update.courseEnrolled.map(course => course.toString()));
//     console.log(uniqueCourses)
//     if (uniqueCourses.size != update.courseEnrolled.length) {
//       throw{message:'Duplicate courses are not allowed.'}
//     }
//   }

//   next();
// });

module.exports = mongoose.model('UserDetails', UserDetails)  