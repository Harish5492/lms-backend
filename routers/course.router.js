const courseRouter = require('express').Router();
const Controller = require('../controllers/index');
const { CourseController } = Controller.module;

const authMiddleware = require('../middleware/authenticate');
const role = require('../middleware/role');

// courseRouter.post('/addCourse',authMiddleware, role.isAdmin, CourseController.addCourse)
// courseRouter.post('/addLesson',authMiddleware, role.isAdmin, CourseController.addLesson)
courseRouter.get('/allCourses', CourseController.getAllCourses);
courseRouter.get('/getCourse/:id', CourseController.getCourseById);
courseRouter.get(
  '/allCourses/:id',
  authMiddleware,
  CourseController.getAllLesson
);
// courseRouter.post('/updateLesson/:id',authMiddleware, role.isAdmin, CourseController.updateLesson)
// courseRouter.post('/updateCourse/:id',authMiddleware, role.isAdmin, CourseController.updateCourse)

// courseRouter.post('/addMultipleLesson',authMiddleware,role.isAdmin, CourseController.addMultipleLesson)
// courseRouter.delete('/deleteCourse/:id',authMiddleware,role.isAdmin, CourseController.deleteCourse)
// courseRouter.delete('/deleteLesson/:id',authMiddleware,role.isAdmin, CourseController.deleteLesson)

module.exports = courseRouter;
