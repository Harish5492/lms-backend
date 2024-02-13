console.log("inside index")
const userRouter = require('./user.router')
const otpRouter = require('./otp.router')
const courseRouter = require('./course.router')
const billingRouter = require('./billing.router')
const referalRouter = require('./refferal.router')
const affiliateRouter = require('./affiliate.router')
const rewardRouter = require('./reward.router')
const adminRouter = require('./admin.router')
const asbRouter = require('./asb.router')

// const routerIndex = { userRouter, otpRouter, billingRouter ,referalRouter ,affiliateRouter,adminRouter }
const routerIndex = { userRouter, otpRouter, courseRouter, billingRouter ,referalRouter ,affiliateRouter ,rewardRouter,adminRouter,asbRouter}

module.exports = routerIndex

// module.exports= { userRouter, otpRouter, courseRouter, billingRouter }