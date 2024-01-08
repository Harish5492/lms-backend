const referalRouter = require('express').Router();
const referralController = require('../controllers/refferalcontroller');
const authMiddleware = require('../middleware/authenticate');

referalRouter.get('/referalCode',authMiddleware,referralController.referalCode);
referalRouter.get('/applyReferalCode',authMiddleware,referralController.applyReferalCode)

module.exports = referalRouter