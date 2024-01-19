// const coursemodel = require('../models/coursemodel')
const model = require('../models/usermodel');
const { Course, Lesson } = require('../models/coursemodel');
const courseRouter = require('../routers/course.router');


class courseController {

  /**
  * @function courseAdd
  * @param  req 
  * @param  res 
  * @returns users
  **/
  async addCourse(req, res) {
    try {
      //   const newData = new coursemodel.Course({...req.body})
      
      const newCourse = await Course.create({ ...req.body })
      const CourseId = newCourse._id
      console.log(CourseId)

      // const uniqueLink = `http://localhost:3000/courses/${CourseId}/link`;

      // console.log("uniqueLink : -",uniqueLink)
      res.json({ message: "added" });
    }
    catch (error) {
      res.status(500).send(error);
    }
  }

  /**
* @function lessonAdd
* @param  req 
* @param  res 
* @returns users
**/

  async addLesson(req, res) {
    try {
      await Lesson.create({ ...req.body })

      await Course.findOneAndUpdate(
        { _id: req.body.course }, // Find the course by ID
        { $push: { lessons: newData._id } } // Add the new lesson to the 'lesson' array
      );
      res.json({ status: true, message: "added" });
    }
    catch (error) {
      res.status(500).send(error);
    }
  }

  async addMultipleLesson(req, res) {
    try{
    console.log("inside add Multiple Lesson","\n request body ",req.body)
    const { lessons, course } = req.body
    console.log("course ",course)
    console.log("lessons ",lessons)
    if(!course || !lessons) throw { message : "please check request",status:false}
 
    await lessons.forEach(obj => { 
      obj.course = course;
    });
    const request = await Lesson.insertMany(lessons)
    console.log("request is", request)
    const Lessons =  request.map(obj => obj._id);
    // console.log(Lessons)
    await Course.findByIdAndUpdate(
      { _id: course }, // Find the user by ID
      {
        $push: { lessons: Lessons },
        $set: { updatedOn: Date.now() }
      }, // Add the new email to the 'emails' array

    );
    // console.log("result",result)
    res.json({ message: 'succesful' })
    }
    catch (error) {
      res.status(500).send(error);
    }
  }


  async updateCourse(req, res) {
    try {
      console.log("update Course", req.params)       
      const obj = req.body;
      console.log("obj", obj)
      // const obj1 = {...obj,title:"qweeeeerttttttttygvvvvvvvvvv",another:"antohr"}
      // console.log(obj1)
      // const obj = {}  
      // if (title) obj.title = title
      // if (title) obj.title = title
      // if (content) obj.content = content 
      // if (videoUrl) obj.videoUrl = videoUrl
      await Course.findByIdAndUpdate(req.params.id, obj, { updatedOn: Date.now() });
      res.json({ message: "updated successfully" });
    } catch (error) {
      res.status(500).send(error);
    }
  }

  async updateLesson(req, res) {
    try {
      console.log("inside update Lesson",req.body,req.params)
      const { id } = req.params;
       
      const updatedLesson = { ...req.body, updatedOn: Date.now() }
      const updatedDocument = await Lesson.findByIdAndUpdate(id, updatedLesson, { new: true });
      if (updatedDocument) {
        res.json({ message: "updated successfully" })
      } else {
        res.status(404).json({ message: "Lesson not found" })
      }
    }
    catch (error) {
      res.status(404).send(error)
    }
  }


  async getAllLesson(req, res) {
    try {
      console.log("inside All Lesson", req.params.id)
      const { decodedToken } = req.body
      const { id } = req.params

      const user= await model.findById(decodedToken.id,'courseEnrolled') 
      console.log(user)
      if(decodedToken.role === 'admin'  || user.courseEnrolled.includes(id)) { 
      const lesson = await Lesson.find({ course: id })
      if (!lesson) throw "No Lesson found"
      console.log(lesson)
      return res.send({ status: true, lesson })
      }
      else{
        throw {message : "Please buy course first"}
      }
    }
    catch (error) { 
      console.log(error)
      res.status(500).send(error );
    }

  }
  async getAllCourses(req, res) {
    try {

      console.log("getAllCourses API has been accessed")
      const page = parseInt(req.query.page) || 1;
      const itemsPerPage = parseInt(req.query.itemsPerPage) || 12;
      const skip = (page - 1) * itemsPerPage;
      const courses = await Course.find()
        .skip(skip)
        .limit(itemsPerPage)
        .exec();
      const totalCourses = await Course.countDocuments();
      res.send({ status: true, courses, totalCourses, itemsPerPage })
    }
    catch (error) {
      res.status(500).send(error);
    }

  }

  async getCourseById(req, res) {
    try {
      console.log("inside getcourse API", req.params.id)
      const course = await Course.findById({ _id: req.params.id })
      console.log(course)
      res.json({ status: true, course })
    }
    catch (error) {
      res.status(500).json({ error: "Course Not Found" })
    }
  }

  async deleteCourse(req, res) {
    try {
      console.log("inside delete a course")
      console.log(req.params.id)
      const findCourse = await Course.findById({ _id: req.params.id })

      if(findCourse.studentsEnrolled.length>0) throw {message:`Can Not Delete, ${findCourse.studentsEnrolled.length} Students are Enrolled This Course`,status:false}

      const a = await Course.findByIdAndDelete({ _id: req.params.id })
      console.log(a, "a")
      const del = await Lesson.deleteMany({ course: req.params.id }, (error, result) => {
        if (error) {
          console.error(error);
        } else {
          console.log(`${result.deletedCount} documents deleted`);
        }
      }
      )
      console.log(del)
      res.send({ status: true })
    }
    catch (error) {
      res.status(500).send(error)
    }
  }

  async deleteLesson(req, res) {
    try {
      console.log("inside delete a lesson")
       
      const lesson = await Lesson.findByIdAndDelete(req.params.id)
      console.log("vheck", lesson)
      await Course.findByIdAndUpdate(
        { _id: lesson.course },
        {
          $pull: { lessons: lesson._id },
          $set: { updatedOn: Date.now() }
        },
      )
      res.json({ status: true, message: "Delete successfully" })
    }
    catch (error) {
      res.status(500).send({ error: "Delete operation failed" })
    }
  }

}

module.exports = new courseController();