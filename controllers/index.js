const AffiliateController =require('./affiliatecontroller')
const BillingController =require('./billingcontroller')
const CourseController =require('./coursecontroller')
const ReferalController =require('./refferalcontroller')
const UserController =require('./usercontroller')
const RewardToSubAdminController = require('./rewadtosubadmin')

const Controller = { AffiliateController, BillingController, CourseController,ReferalController,UserController,RewardToSubAdminController}


exports.module = Controller