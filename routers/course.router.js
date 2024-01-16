const courseRouter = require('express').Router();
const courseController = require('../controllers/coursecontroller');
const authMiddleware = require('../middleware/authenticate');

courseRouter.post('/addCourse',authMiddleware, courseController.addCourse)
courseRouter.post('/addLesson',authMiddleware, courseController.addLesson)
courseRouter.get('/allCourses', courseController.getAllCourses)
courseRouter.get('/getCourse/:id', courseController.getCourseById)
courseRouter.get('/allCourses/:id', courseController.getAllLesson)
courseRouter.get('/updateLesson/:id',authMiddleware, courseController.updateLesson)
courseRouter.post('/updateCourse/:id',authMiddleware, courseController.updateCourse)

courseRouter.post('/addMultipleLesson',authMiddleware, courseController.addMultipleLesson)
courseRouter.delete('/deleteCourse/:id',authMiddleware, courseController.deleteCourse)
courseRouter.delete('/deleteLesson/:id',authMiddleware, courseController.deleteLesson)

module.exports = courseRouter ;