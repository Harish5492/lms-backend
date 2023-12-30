const userRouter = require('express').Router();
const userController = require('../controllers/usercontroller');
const { validateSignup, handleValidationErrors } = require('../middleware/expressvalidator');
console.log("inside user")
userRouter.post('/signUp', validateSignup, handleValidationErrors, userController.signUp)
userRouter.get('/getUser', userController.getUser);
userRouter.get('/getAllUsers', userController.getAllUsers),
userRouter.post('/login', userController.login);
userRouter.put('/updateUser/:id', userController.updateUser);
userRouter.delete('/removeUser/:id', userController.removeUser);
userRouter.put('/forgotPassword/:email', validateSignup[4], validateSignup[5], handleValidationErrors, userController.forgotPassword);


module.exports = userRouter;