const affiliateRouter = require('express').Router();
const affiliateController = require('../controllers/affiliatecontroller')
const authMiddleware = require('../middleware/authenticate');
const role = require('../middleware/role')

affiliateRouter.post('/affiliateRequestStatus',authMiddleware,affiliateController.affiliationRequestStatus)
affiliateRouter.get('/pendingRequests',authMiddleware,role.isAdmin,affiliateController.pendingRequests)
affiliateRouter.post('/affiliationRequest',authMiddleware,affiliateController.affiliationRequest)
affiliateRouter.post('/affiliationRequestAction/:id',authMiddleware,role.isAdmin,affiliateController.affiliationRequestAction)



module.exports = affiliateRouter ;