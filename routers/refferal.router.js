const referalRouter = require('express').Router();
const Controller = require('../controllers/index')
const { ReferalController} = Controller.module
const authMiddleware = require('../middleware/authenticate');

referalRouter.get('/referalCode',authMiddleware,ReferalController.referalCode);
referalRouter.post('/applyReferalCode',authMiddleware,ReferalController.applyReferalCode)


module.exports = referalRouter