const asbRouter = require('express').Router();
const Controller = require('../controllers/index')
const { ASBController } = Controller.module
const authMiddleware = require('../middleware/authenticate');
const role = require('../middleware/role')
asbRouter.post('/asbCourse', authMiddleware, role.isAdmin, ASBController.asbCourse)
asbRouter.post('/updateCourse/:id', authMiddleware, role.isAdmin, ASBController.updateCourse)
asbRouter.get('/getAllCourses', authMiddleware, ASBController.getAllCourses)
asbRouter.get('/getCourseById/:id', authMiddleware, ASBController.getCourseById)
asbRouter.delete('/deleteCourse/:id', authMiddleware,role.isAdmin, ASBController.deleteCourse)
asbRouter.post('/asbStudentEnroll', authMiddleware, ASBController.asbStudentEnroll)


module.exports = asbRouter;