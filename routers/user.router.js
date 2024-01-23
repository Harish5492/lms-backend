const userRouter = require('express').Router();
const Controller = require('../controllers/index')
const {UserController} = Controller.module
const { validateSignup, handleValidationErrors } = require('../middleware/expressvalidator');
const authMiddleware = require('../middleware/authenticate');
const role = require('../middleware/role')

userRouter.post('/signUp', validateSignup, handleValidationErrors, UserController.signUp)
userRouter.get('/getUser', UserController.getUser);
userRouter.get('/getAllUsers', UserController.getAllUsers),
userRouter.post('/login', UserController.login);
userRouter.put('/updateUser/:id',validateSignup[0],validateSignup[1],validateSignup[2],validateSignup[3], handleValidationErrors, UserController.updateUser);
userRouter.delete('/removeUser/:id', UserController.removeUser);
userRouter.put('/forgotPassword/:email', validateSignup[4], validateSignup[5], handleValidationErrors, UserController.forgotPassword);
userRouter.get('/profile', authMiddleware, UserController.profile);

 
userRouter.post('/changePassword',validateSignup[5],validateSignup[6],handleValidationErrors,UserController.updatePassword); 

userRouter.get('/myCourses',authMiddleware,UserController.myCourses);


userRouter.get('/test',UserController.test)
module.exports = userRouter;   