console.log("inside index")
const userRouter = require('./user.router')
const otpRouter = require('./otp.router')
const courseRouter = require('./course.router')
const billingRouter = require('./billing.router')
const routerIndex = { userRouter, otpRouter, courseRouter, billingRouter }

module.exports = routerIndex