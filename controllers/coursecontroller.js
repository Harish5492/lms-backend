// const coursemodel = require('../models/coursemodel')
const { Course, Lesson } = require('../models/coursemodel')


class courseController {

  /**
  * @function courseAdd
  * @param  req 
  * @param  res 
  * @returns users
  **/
  async courseAdd(req, res) {
    try {
      //   const newData = new coursemodel.Course({...req.body})
      new Course.create({ ...req.body })

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

  async lessonAdd(req, res) {
    try {
      new Lesson.create({ ...req.body })

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

  async addMultipleLessons(req, res) {

    try {
      console.log("inside Multiple Lessons")
      const request = await Lesson.insertMany(req.body)
      const Lessons = request.map(obj => obj.id);
      console.log(Lessons)
      console.log(request)
      const result = await Course.findByIdAndUpdate(
        { _id: request[0].course }, // Find the course by ID
        { $push: { lessons: Lessons } }) // Add the new email to the 'lessons' array
      res.json({ status: true, message: "Inserted", result })

    }
    catch (error) {
      res.status(500).send(error)
    }
  }

  async updateLesson(req, res) {
    try {
      console.log(req.body)
      const { title, content, videoUrl } = req.body;
      const obj = {}
      if (title) obj.title = title
      if (content) obj.content = content
      if (videoUrl) obj.videoUrl = videoUrl
      await Lesson.findByIdAndUpdate(req.params.id, obj);
      res.json({ status: true, message: "updated successfully" });
    } catch (error) {
      res.status(500).send(error);
    }
  }


  async getAllLesson(req, res) {
    try {
      const data = await Lesson.find({ course: req.params.id })
      res.send({ status: true, data })
    }
    catch (error) {
      res.status(500).send(error);
    }

  }
  async getAllCourses(req, res) {
    try {
      console.log("inside getallCourses")
      const data = await Course.find()
      res.send({ status: true, data })
    }
    catch (error) {
      res.status(500).send(error);
    }

  }

  async getCourse(req, res) {
    try {
      console.log("inside a course")
      const data = await Course.findById(req.params.id)
      console.log("check")
      res.json({ status: true, data })
    }
    catch (error) {
      res.status(500).send(error)
    }
  }

  async deleteCourse(req, res) {
    try {
      console.log("inside delete a course")
      console.log(req.params.id)
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
      await Lesson.findByIdAndDelete(req.params.id)
      await Course.findByIdAndUpdate(
        { _id: data.course }, // Find the course by ID
        { $pull: { lessons: data._id } }) // Add the new email to the 'lessons' array
      res.json({ status: true, message: "delete successfully" })
    }
    catch (error) {
      res.status(500).send(error)
    }
  }

}

module.exports = new courseController();