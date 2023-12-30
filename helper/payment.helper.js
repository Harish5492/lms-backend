const user = require('../models/model');
require('dotenv').config();

class paymentHelper {
    // async addStudent(student,coursesArray){
    //     console.log("inside addStudent")
    //     coursesArray.forEach(element => {
    //         Course.findByIdAndUpdate(
    //             {_id:element},
    //             {
    //                 $push : {studentsEnrolled : student}
    //             },
    //             {new:true}
    //         )
            
    //     });
      
    //   console.log ("Student Added Successfully")
    //   }

      async addCourse(student,coursesArray){
        console.log("inside addCourse")
        const result1 = await user.findByIdAndUpdate(
            {_id:student},
            {
                $push : {courseEnrolled : coursesArray}
            },
            {new:true}
        )
        console.log ("Course Added Successfully")
        console.log("course :   ",result1)
        }
  }


module.exports = new paymentHelper();
