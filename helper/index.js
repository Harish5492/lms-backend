const OTPHelper =require('./otp.helper')
const UserHelper = require('./user.helper')
const paymentHelper = require('./payment.helper')
const referalAndAffiliate = require('./referral.affiliate.helper')
const Helper = { OTPHelper, UserHelper, paymentHelper,referalAndAffiliate}


exports.module = Helper