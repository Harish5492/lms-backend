const billingRouter = require('express').Router();
const Controller = require('../controllers/index')
const { BillingController} = Controller.module
const authMiddleware = require('../middleware/authenticate');
const role = require('../middleware/role')
const { validateSignup, handleValidationErrors } = require('../middleware/expressvalidator');

billingRouter.post('/billing',validateSignup[4],handleValidationErrors,BillingController.billingDetails)

// billingRouter.get('/payment/getDetails',authMiddleware,role.isAdmin,BillingController.getDetails)
// billingRouter.get('/payment/getAllDetails',BillingController.getAllDetails)

billingRouter.post('/payment',authMiddleware,BillingController.payment)
billingRouter.get('/payment/checkStatus/:txnId',BillingController.checkStatus)

// billingRouter.delete('/payment/deleteMany/:id',BillingController.deleteMany)


module.exports = billingRouter;