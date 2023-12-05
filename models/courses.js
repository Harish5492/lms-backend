const mongoose = require('mongoose')

const courses = new mongoose.Schema({
  firstName:{ type: String, required: [true,"First name is Required"] },
  lastName:{ type: String, required: [true,"Last name is Required"] },
  userName:{ type: String, required: [true,"User name is Required"] },
  email:{ type: String, unique:true, required: [true,"User email is Required"] },
  password:{ type: String, required: [true,"User password is Required"]},
  created_on: {type: Date, default: Date.now}
});
//cardImg: cardImage,
// button: "All Levels",
// heading: "Communications",
// title: "Successful Negotiation: Master Your Negotiating Skills",
// description: "Negotiation is a skill well worth mastering – by putting …",
// price: "Free"
module.exports = mongoose.model('Courses', courses)