const courseRouter = require('express').Router();
const courseController = require('../controllers/coursecontroller');
const authMiddleware = require('../middleware/authenticate');
const role = require('../middleware/role')

courseRouter.post('/addCourse',authMiddleware, role.isAdmin, courseController.addCourse)
courseRouter.post('/addLesson',authMiddleware, role.isAdmin, courseController.addLesson)
courseRouter.get('/allCourses', courseController.getAllCourses)
courseRouter.get('/getCourse/:id', courseController.getCourseById)
courseRouter.get('/allCourses/:id', courseController.getAllLesson)
courseRouter.get('/updateLesson/:id',authMiddleware, role.isAdmin, courseController.updateLesson)
courseRouter.post('/updateCourse/:id',authMiddleware, role.isAdmin, courseController.updateCourse)

courseRouter.post('/addMultipleLesson',authMiddleware,role.isAdmin, courseController.addMultipleLesson)
courseRouter.delete('/deleteCourse/:id',authMiddleware,role.isAdmin, courseController.deleteCourse)
courseRouter.delete('/deleteLesson/:id',authMiddleware,role.isAdmin, courseController.deleteLesson)

module.exports = courseRouter ;