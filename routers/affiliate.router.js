const affiliateRouter = require('express').Router();
const Controller = require('../controllers/index')
const { AffiliateController} = Controller.module
const authMiddleware = require('../middleware/authenticate');
const role = require('../middleware/role')

affiliateRouter.post('/affiliateRequestStatus',authMiddleware,AffiliateController.affiliationRequestStatus)
// affiliateRouter.get('/pendingRequests',authMiddleware,role.isAdmin,affiliateController.pendingRequests)
affiliateRouter.post('/affiliationRequest',authMiddleware,AffiliateController.affiliationRequest)
// affiliateRouter.post('/affiliationRequestAction/:id',authMiddleware,role.isAdmin,affiliateController.affiliationRequestAction)



module.exports = affiliateRouter ;