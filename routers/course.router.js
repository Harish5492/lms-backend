const courseRouter = require('express').Router();
const courseController = require('../controllers/coursecontroller');

courseRouter.post('/addCourse', courseController.addCourse)
courseRouter.post('/addLesson', courseController.addLesson)
courseRouter.get('/allCourses', courseController.getAllCourses)
courseRouter.get('/getCourse/:id', courseController.getCourseById)
courseRouter.get('/allCourses/:id', courseController.getAllLesson)
courseRouter.get('/updateLesson/:id', courseController.updateLesson)
courseRouter.post('/updateCourse/:id', courseController.updateCourse)

courseRouter.post('/addMultipleLesson', courseController.addMultipleLesson)
courseRouter.delete('/deleteCourse/:id', courseController.deleteCourse)
courseRouter.delete('/deleteLesson/:id', courseController.deleteLesson)

module.exports = courseRouter ;