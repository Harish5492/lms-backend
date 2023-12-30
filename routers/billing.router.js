const billingRouter = require('express').Router();
const billingController = require('../controllers/billingcontroller')
const authMiddleware = require('../middleware/authenticate');
const { validateSignup, handleValidationErrors } = require('../middleware/expressvalidator');

billingRouter.post('/billing',validateSignup[4],handleValidationErrors,billingController.billingDetails)
billingRouter.post('/payment',authMiddleware,billingController.payment)
billingRouter.get('/payment/checkStatus/:txnId',billingController.checkStatus)

module.exports = billingRouter;