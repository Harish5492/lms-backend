const mongoose = require('mongoose');

const asbStudentEnroll = new mongoose.Schema({
    firstName: { type: String, required: [true, "User Name is Required"] },
    lastName: { type: String, required: [true, "User Name is Required"] },
    city: { type: String, required: [true, "City Name is Required"] },
    state: { type: String, required: [true, "State Name is Required"] },
    phone: { type: Number, required: [true, "Phone Number is Required"] },
    email: { type: String, required: [true, "User email is Required"] },
    created_on: { type: Date, default: Date.now }
});

module.exports = mongoose.model('asbStudentEnroll',asbStudentEnroll)