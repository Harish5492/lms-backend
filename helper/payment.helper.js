const user = require('../models/model');
require('dotenv').config();

class paymentHelper {

  async addCourse(student, coursesArray) {
    console.log("inside addCourse")
    const result1 = await user.findByIdAndUpdate(
      { _id: student },
      {
        $push: { courseEnrolled: coursesArray }
      },
      { new: true }
    )
    console.log("Course Added Successfully")
    console.log("course :   ", result1)
  }

  generateTransactionId() {
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 10000);
    return `MT${timestamp}${random}`;
  }

       

  }

  


module.exports = new paymentHelper();
