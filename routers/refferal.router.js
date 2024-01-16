const referalRouter = require('express').Router();
const referralController = require('../controllers/refferalcontroller');
const authMiddleware = require('../middleware/authenticate');
const role = require('../middleware/role')

referalRouter.get('/referalCode',authMiddleware,referralController.referalCode);
referalRouter.post('/applyReferalCode',authMiddleware,referralController.applyReferalCode)


module.exports = referalRouter