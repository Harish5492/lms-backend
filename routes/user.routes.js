const router = require('express').Router();
const userController = require('../controllers/user.controller');
const courseController = require('../controllers/courses.controller')
const authMiddleware = require('../middleware/authenticate');
const { validateSignup,validEmail,handleValidationErrors } = require('../middleware/signUp');
    

//TODO seprate user routes , course routes, payment routes to different files

router.get('/status', userController.status);
router.get('/getAllUsers', userController.getAllUsers);
router.post('/getUser', userController.getUser);
router.post('/signup',validateSignup,validEmail,handleValidationErrors, userController.signup);
router.put('/updateUser/:id', userController.updateUser);
// router.delete('/removeUser/:id', userController.removeUser);
router.post('/generateOTP', userController.generateOTP);
router.post('/verifyOTP',userController.verifyOTP);
// router.post('/otpbyemail', userController.otpbyemail); 
router.post('/login', userController.login);
 
// router.get('/profile', authMiddleware, userController.profile);
// router.post('/forgot/:email',validateSignup[5],validateSignup[6],handleValidationErrors,userController.forgotPassword);  

router.post('/changePassword',validateSignup[5],validateSignup[6],handleValidationErrors,userController.updatePassword); 
router.get('/allCourses',courseController.getAllCourses)
router.get('/allCourses/:id',courseController.getAllLessons)
router.get('/getCourse/:id',courseController.getCoursesById)

router.post('/addCourse',courseController.addCourse)
router.post('/addLesson',courseController.addLesson)

router.post('/addMultipleLesson',courseController.addMultipleLesson) 

router.get('/updateLesson/:id', courseController.updateLesson)
router.post('/delete/:title',courseController.deletemul) 
router.delete('/deleteCourse/:id', courseController.deleteCourse)
router.delete('/deleteLesson/:id', courseController.deleteLesson)

router.post ('/billing',courseController.billingDetails)
router.get('/payment/checkStatus',courseController.checkStatus)
router.post('/payment',courseController.payment)

 
module.exports = router; 