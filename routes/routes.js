const router = require('express').Router();
const userController = require('../controllers/usercontroller');
const authMiddleware = require('../middleware/authenticate');
const {validateSignup,handleValidationErrors } = require('../middleware/signUp');
 
router.get('/status', userController.status);
router.get('/getAllUsers', userController.getAllUsers);
router.get('/getUser/:id', userController.getUser);
router.post('/signup',validateSignup,handleValidationErrors, userController.signup);
router.put('/updateUser/:id', userController.updateUser);
router.delete('/removeUser/:id', userController.removeUser);
router.post('/login', userController.login
);
router.get('/profile', authMiddleware, userController.profile);
 
module.exports = router;
