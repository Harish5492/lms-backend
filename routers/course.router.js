const courseRouter = require('express').Router();
const courseController = require('../controllers/coursecontroller');

courseRouter.post('/courseAdd', courseController.courseAdd)
courseRouter.post('/lessonAdd', courseController.lessonAdd)
courseRouter.get('/getAllLesson/:id', courseController.getAllLesson)
courseRouter.get('/getAllCourses', courseController.getAllCourses)
courseRouter.get('/updateLesson/:id', courseController.updateLesson)
courseRouter.post('/addMultipleLessons', courseController.addMultipleLessons)
courseRouter.get('/getCourse/:id', courseController.getCourse)
courseRouter.delete('/deleteCourse/:id', courseController.deleteCourse)
courseRouter.delete('/deleteLesson/:id', courseController.deleteLesson)

module.exports = courseRouter ;