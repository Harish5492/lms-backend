const billingRouter = require('express').Router();
const billingController = require('../controllers/billingcontroller')
const authMiddleware = require('../middleware/authenticate');
const { validateSignup, handleValidationErrors } = require('../middleware/expressvalidator');

billingRouter.post('/billing',validateSignup[4],handleValidationErrors,billingController.billingDetails)

billingRouter.get('/payment/getDetails',billingController.getDetails)

billingRouter.post('/payment',authMiddleware,billingController.payment)
billingRouter.get('/payment/checkStatus/:txnId',billingController.checkStatus)

billingRouter.delete('/payment/deleteMany/:id',billingController.deleteMany)


module.exports = billingRouter;