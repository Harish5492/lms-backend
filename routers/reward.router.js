const rewardRouter = require('express').Router();
const Controller = require('../controllers/index')
const  {RewardToSubAdminController}  = Controller.module
const authMiddleware = require('../middleware/authenticate');
const role = require('../middleware/role')
rewardRouter.post('/subAdminRequests',authMiddleware,role.isSubAdmin,RewardToSubAdminController.subAdminRequests)
rewardRouter.get('/pendingRewardRequests',authMiddleware,role.isAdmin,RewardToSubAdminController.pendingRewardRequests)
rewardRouter.post('/sendAmountToSubAdmin',authMiddleware,role.isAdmin,RewardToSubAdminController.sendAmountToSubAdmin)
rewardRouter.get('/sendAmountToSubAdmin/checkRewardStatus/:txnId',RewardToSubAdminController.checkRewardStatus)



module.exports = rewardRouter