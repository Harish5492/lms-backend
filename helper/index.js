const OTPHelper =require('./otp.helper')
const UserHelper = require('./user.helper')
const paymentHelper = require('./payment.helper')
const Helper = { OTPHelper, UserHelper, paymentHelper}


exports.module = Helper