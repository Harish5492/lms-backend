const otpRouter = require('express').Router();
const userController = require('../controllers/usercontroller');
const { validateSignup, handleValidationErrors } = require('../middleware/expressvalidator');
const authMiddleware = require('../middleware/authenticate');
const role = require('../middleware/role')

otpRouter.get('/generateOTP', userController.generateOTP),
otpRouter.get('/otpbyemail',userController.otpbyemail),
otpRouter.get('/verifyOTP',userController.verifyOTP),
// otpRouter.get('/profile', authMiddleware, userController.profile);


module.exports = otpRouter;