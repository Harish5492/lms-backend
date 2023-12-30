const otpRouter = require('express').Router();
const userController = require('../controllers/usercontroller');
const { validateSignup, handleValidationErrors } = require('../middleware/expressvalidator');
const authMiddleware = require('../middleware/authenticate');

otpRouter.get('/generateOTP', userController.generateOTP),
otpRouter.get('/otpbyemail',userController.otpbyemail),
otpRouter.get('/verifyOTP',userController.verifyOTP),
otpRouter.get('/profile', authMiddleware, userController.profile);
otpRouter.post('/updatePassword',validateSignup[6],validateSignup[5],handleValidationErrors,userController.updatePassword);


module.exports = otpRouter;