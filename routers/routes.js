// const router = require('express').Router();
// const userController = require('../controllers/usercontroller');
// const courseController = require('../controllers/coursecontroller');
// const billingController = require('../controllers/billingcontroller')
// const authMiddleware = require('../middleware/authenticate');
// const { validateSignup, handleValidationErrors } = require('../middleware/expressvalidator');

// router.post('/signUp', validateSignup, handleValidationErrors, userController.signUp)
// router.get('/getUser', userController.getUser);
// router.get('/getAllUsers', userController.getAllUsers),
// router.post('/login', userController.login);
// router.put('/updateUser/:id', userController.updateUser);
// router.delete('/removeUser/:id', userController.removeUser);
// router.put('/forgotPassword/:email', validateSignup[4], validateSignup[5], handleValidationErrors, userController.forgotPassword);


// router.get('/generateOTP', userController.generateOTP),
// router.get('/otpbyemail',userController.otpbyemail),
// router.get('/verifyOTP',userController.verifyOTP),
// router.get('/profile', authMiddleware, userController.profile);
// router.post('/updatePassword',validateSignup[6],validateSignup[5],handleValidationErrors,userController.updatePassword);


// router.post('/courseAdd', courseController.courseAdd)
// router.post('/lessonAdd', courseController.lessonAdd)
// router.get('/getAllLesson/:id', courseController.getAllLesson)
// router.get('/getAllCourses', courseController.getAllCourses)
// router.get('/updateLesson/:id', courseController.updateLesson)
// router.post('/addMultipleLessons', courseController.addMultipleLessons)
// router.get('/getCourse/:id', courseController.getCourse)
// router.delete('/deleteCourse/:id', courseController.deleteCourse)
// router.delete('/deleteLesson/:id', courseController.deleteLesson)



// router.post('/billing',validateSignup[4],handleValidationErrors,billingController.billingDetails)
// router.post('/payment',authMiddleware,billingController.payment)
// router.get('/payment/checkStatus/:txnId',billingController.checkStatus)




// module.exports = router;
