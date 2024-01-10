const affiliateRouter = require('express').Router();
const affiliateController = require('../controllers/affiliatecontroller')
const authMiddleware = require('../middleware/authenticate');

affiliateRouter.post('/affiliateLink/:id',authMiddleware,affiliateController.affiliateLink)


module.exports = affiliateRouter ;