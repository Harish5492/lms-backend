const mongoose = require('mongoose');

const Billing = new mongoose.Schema({
    firstName: { type: String, required: [true, "User Name is Required"] },
    lastName: { type: String, required: [true, "User Name is Required"] },
    countryName: { type: String,  required: [true, "Country Name is Required"] },
    stateAddress: { type: String,  required: [true, "Country Name is Required"] },
    Apartment: { type: String,  required: [true, "Country Name is Required"] },
    city: { type: String, required: [true, "City Name is Required"] },
    state: { type: String, required: [true, "State Name is Required"] },
    zip: { type: String, required: [true, "zip code is Required"] },
    phone: { type: Number, required: [true, "Phone Number is Required"] },
    email: { type: String, required: [true, "User email is Required"] },
    otherNotes: { type: String },
    created_on: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Billing',Billing)