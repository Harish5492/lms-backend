const asbStudentEnroll = require('../models/asb.student.forms')
const asbCourse = require('../models/asb.course')

class ASB {
    async asbCourse(req, res) {
        try {
            const newCourse = await asbCourse.create({ ...req.body })
            console.log("newCourse", newCourse)
            res.json({ message: "Course Added Successfully", status: true })


        }
        catch (error) {
            console.error(error);
            res.status(500).send(error || "Internal Server Error");

        }
    }
    async updateCourse(req, res) {
        try {
            console.log("update Course", req.params)
            const obj = req.body;
            console.log("obj", obj)
            await asbCourse.findByIdAndUpdate(req.params.id, obj, { updatedOn: Date.now() });
            res.json({ message: "updated successfully" });
        } catch (error) {
            res.status(500).send(error);
        }
    }

    async getAllCourses(req, res) {
        try {

            console.log("getAllCourses API has been accessed")
            const page = parseInt(req.query.page) || 1;
            const itemsPerPage = parseInt(req.query.itemsPerPage) || 12;
            const skip = (page - 1) * itemsPerPage;
            const courses = await asbCourse.find()
                .skip(skip)
                .limit(itemsPerPage)
                .exec();
            const totalCourses = await asbCourse.countDocuments();
            res.send({ status: true, courses, totalCourses, itemsPerPage })
        }
        catch (error) {
            res.status(500).send(error);
        }

    }

    async getCourseById(req, res) {
        try {
            console.log("inside getcourse API", req.params.id)
            const course = await asbCourse.findById({ _id: req.params.id })
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
            const deleteCourse = await asbCourse.findByIdAndDelete({ _id: req.params.id })
            console.log(deleteCourse)
            if (!deleteCourse) throw { message: "No Course Found", status: false }
            res.send({ message: "deleted Successfully", status: true })
        }
        catch (error) {
            res.status(500).send(error)
        }
    }

    async asbStudentEnroll(req, res) {
        try {
            const newCourse = await asbStudentEnroll.create({ ...req.body })
            console.log("newCourse", newCourse)
            res.json({ message: "Student Enrolled Successfully", status: true })


        }
        catch (error) {
            console.error(error);
            res.status(500).send(error || "Internal Server Error");
        }
    }

}

module.exports = new ASB()