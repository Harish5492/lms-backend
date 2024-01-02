const courseRouter = require('express').Router();
const courseController = require('../controllers/coursecontroller');

courseRouter.post('/courseAdd', courseController.courseAdd)
courseRouter.post('/lessonAdd', courseController.lessonAdd)
courseRouter.get('/getAllCourses', courseController.getAllCourses)
courseRouter.get('/getCoursebyId/:id', courseController.getCourseById)
courseRouter.get('/getAllLesson/:id', courseController.getAllLesson)
courseRouter.get('/updateLesson/:id', courseController.updateLesson)
courseRouter.post('/addMultipleLesson', courseController.addMultipleLesson)
courseRouter.delete('/deleteCourse/:id', courseController.deleteCourse)
courseRouter.delete('/deleteLesson/:id', courseController.deleteLesson)

module.exports = courseRouter ;