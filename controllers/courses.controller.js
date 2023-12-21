const { Course, Lesson } = require('../models/courses')
const axios = require('axios');
const crypto = require('crypto');
class CourseController {
  /**
 * @function getAllCourses
 * @param  req
 * @param  res
 * @returns users
 **/
  async getAllCourses(req, res) {
    console.log("inside getAllCourses")
    try {
      const users = await Course.find();
      res.json(users);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  async getCoursesById(req, res) {
    console.log("inside getCoursesById")
    try {
      const users = await Course.find({ _id: req.params.id });
      console.log("response : ", users)
      res.json(users);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  async getAllLessons(req, res) {
    console.log("inside Lessons here")
    try {
      // console.log(req.body)
      // console.log(req.params)
      const users = await Lesson.find({ course: req.params.id });
      res.json(users);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  async addCourse(req, res) {
    try {
      console.log("inside addCourse")
      // console.log(req.body)
      const newData = await Course.create({ ...req.body });
      console.log(newData)
      res.json({ _id: newData._id, status: true })
    }
    catch (error) {
      res.status(500).json({ error, status: false });
    }
  }
  async addLesson(req, res) {
    try {
      console.log("inside addLesson")
      // console.log("req.body",req.body)
      const newData = new Lesson({ ...req.body });
      // console.log("data",newData)
      newData.save()
      console.log(Date.now())
      const result = await Course.findOneAndUpdate(
        { _id: req.body.course }, // Find the user by ID
        { updatedOn: Date.now() },
        { $push: { lessons: newData._id } } // Add the new lesson to the 'Lessons' array
      );
      res.json({ newData, status: true })
    }
    catch (error) {
      res.status(500).json({ error, status: false });
    }
  }

  async addMultipleLesson(req, res) {
    console.log("inside add Multiple Lesson")
    // console.log(req.body)
    const { lessons, course } = req.body
    // console.log(lessons,course)
    const newField = course;
    lessons.forEach(obj => {
      obj.course = newField;
    });
    // console.log(lessons)     
    const request = await Lesson.insertMany(lessons)
    // console.log("requwst",request)   
    const Lessons = request.map(objwe => objwe._id);
    // console.log(Lessons)
    const result = await Course.findByIdAndUpdate(
      { _id: course }, // Find the user by ID
      { $push: { lessons: Lessons } }, // Add the new email to the 'emails' array
    );
    const Result = await Course.findByIdAndUpdate(
      { _id: course }, // Find the user by ID
      // Add the new email to the 'emails' array
      { updatedOn: Date.now() }
    );
    // console.log("result",result)
    res.json({ message: 'succesful' })
  }

  async updateLesson(req, res) {
    try {
      // console.log(req.body)
      const obj = req.body;
      console.log("obj", obj)
      // const obj1 = {...obj,title:"qweeeeerttttttttygvvvvvvvvvv",another:"antohr"}
      // console.log(obj1)
      // const obj = {}  
      // if (title) obj.title = title
      // if (content) obj.content = content 
      // if (videoUrl) obj.videoUrl = videoUrl
      await Lesson.findByIdAndUpdate(req.params.id, obj, { updatedOn: Date.now() });
      res.json({ message: "updated successfully" });
    } catch (error) {
      res.status(500).send(error);
    }
  }

  async deletemul(req, res) {
    // Use deleteMany to remove documents that match the criteria
    const x = await Lesson.deleteMany({ title: req.params.title })
    console.log("deleted")
    res.json({ message: "deleted ", x })
  }

  async deleteCourse(req, res) {
    try {
      console.log("inside delete a course")
      // console.log(req.params.id)
      const a = await Course.findByIdAndDelete({ _id: req.params.id })
      console.log(a, "a")
      const del = await Lesson.deleteMany({ course: req.params.id }
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
        { $pull: { lessons: data._id } },
        { updatedOn: Date.now() })
      res.json({ status: true, message: "delete successfully" })
    }
    catch (error) {
      res.status(500).send(error)
    }
  }

  async billingDetails(req, res) {
    try {
      const data = await new billing({ ...req.body })
      await data.save()
      res.json({ status: true, message: "details Added" })
    }
    catch (error) {
      res.status(500).send(error)
    }

  }
  async payment(req, res) {
    console.log("inside payment")
    try {
      const { totalPrice } = req.body
      function generateTransactionId() {
        const timestamp = new Date().getTime();
        const random = Math.floor(Math.random() * 10000);
        return `MT${timestamp}${random}`;
      }
      const data = {
        merchantId: 'PGTESTPAYUAT',
        merchantTransactionId: generateTransactionId(),
        merchantUserId: 'MNSNBB1234JVB3',
        // name: name,
        amount: totalPrice * 100, 
        redirectUrl: `http://10.10.2.82:8000/user/payment/checkStatus`,
        redirectMode: 'REDIRECT',
        // mobileNumber: billing.number,
        paymentInstrument: {
          type: 'PAY_PAGE'
        }
      };
      const payload = JSON.stringify(data);
      // console.log("payload",payload)
      const payloadMain = Buffer.from(payload).toString('base64');
      // console.log("base64 payload",payloadMain)
      const keyIndex = 1;
      const key = '099eb0cd-02cf-4e2a-8aca-3e6c6aff0399'
      const string = payloadMain + '/pg/v1/pay' + key;
      const sha256 = crypto.createHash('sha256').update(string).digest('hex');
      // console.log("sha256",sha256)
      const checksum = sha256 + '###' + keyIndex;
      // console.log("checksum",checksum)

      const URL = "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay"
      // const URL = "https://api.phonepe.com/apis/hermes/pg/v1/pay"

      const options = {
        method: 'POST',
        url: URL,
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
          'X-VERIFY': checksum
        },
        data: {
          request: payloadMain
        }
      };

      axios.request(options).then(function (response) {
        // console.log(response.data)
        console.log(response.data.data.instrumentResponse.redirectInfo.url)
         res.send(response.data.data.instrumentResponse.redirectInfo.url)
      })
        .catch(function (error) {
          console.error(error);
        });

    } catch (error) {
      res.status(500).send({
        message: error.message,
        success: false
      })
    }
  }


  async checkStatus(req, res) {
    console.log("inside checkStatus", req.body)
    const merchantTransactionId = req.body.transactionId
    const merchantId = req.body.merchantId
    console.log(merchantId, merchantTransactionId)
    const key = '099eb0cd-02cf-4e2a-8aca-3e6c6aff0399'
    const keyIndex = 1;
    const string = `/pg/v1/status/${merchantId}/${merchantTransactionId}` + key;
    const sha256 = crypto.createHash('sha256').update(string).digest('hex');
    const checksum = sha256 + "###" + keyIndex;
    console.log("in the start")

    const options = {
      method: 'GET',
      url: `https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status/${merchantId}/${merchantTransactionId}`,
      // url: `https://api.phonepe.com/apis/hermes/pg/v1/status/${merchantId}/${merchantTransactionId}`,
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        'X-VERIFY': checksum,
        'X-MERCHANT-ID': `${merchantId}`
      }
    };

    // axios.request(options).then(async (response) => {
    //     if (response.data.success === true) {
    //         const url = `http://localhost:8000/success`
    //         return res.redirect(url)
    //     } else {
    //         const url = `http://localhost:8000/failure`
    //         return res.redirect(url)
    //     }

    // })
    // axios.request(options)
    //     .then(async (response) => {
    //         console.log(response)
    //     })

    //     .catch((error) => {
    //         console.error(error);
    //     });
    // console.log("end")
    axios.request(options).then(async (response) => {
      if (response.data.success === true) {
        console.log(response.data)
        return res.status(200).send({ success: true, message: "Payment Success" });
      } else {
        return res.status(400).send({ success: false, message: "Payment Failure" });
      }
    })
      .catch((err) => {
        console.error("rrrrrrrrrrrrrrr", err);
        res.status(500).send({ msg: err.message });
      });
  }
}

module.exports = new CourseController();