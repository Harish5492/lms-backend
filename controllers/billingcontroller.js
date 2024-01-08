// const { Number } = require('twilio/lib/twiml/VoiceResponse');
const billing = require('../models/billingmodel')
const payment = require('../models/payment.model')
const axios = require('axios');
const Helper = require('../helper/index')
const { paymentHelper } = Helper.module
require("dotenv").config();
const paymentMerchantId = process.env.MERCHANTID


class BillingController {

  async billingDetails(req, res) {
    try {
      console.log('inside billingDetails')
      await billing.create({ ...req.body })
      res.json({ message: "details Added" })
    }
    catch (error) {
      res.status(500).send(error)
    }
  }

  async getDetails(req, res) {
    try {
      console.log("inside get payment Details")

      const page = parseInt(req.query.page) || 1;
      const itemsPerPage = parseInt(req.query.itemsPerPage) || 10;
      const skip = (page - 1) * itemsPerPage;
      const details = await payment.find()
        .skip(skip)
        .limit(itemsPerPage)
        .exec();
      const totalRecords = await payment.countDocuments();
      res.json({ status: true, details, totalRecords })
    }
    catch (error) {
      res.status(500).json({
        message: error.message,
        success: false
      })
    }
  }


  async payment(req, res) {
    console.log("inside payment")
    try {

      const { totalPrice, queryString, decodedToken } = req.body
      const  student  = decodedToken.id   
      // const courseId = req.query.courseId;
      // console.log(courseId)

      // // Check if the user is already enrolled in the course
      // const user = await model.findOne({ _id: student, courseEnrolled: courseId });
      // if (user) {
      //   return res.status(400).send({
      //     message: "Course is already enrolled. Payment cannot be initiated.",
      //     success: false,
      //   });
      // }
    
      const que = `${queryString}&student=${student}`
      const merchantTransactionId = paymentHelper.generateTransactionId()
      const data = paymentHelper.getData(merchantTransactionId, totalPrice, que)
      const { checksum, payloadMain } = paymentHelper.hashing(data)
      const options = paymentHelper.getOptions(checksum, payloadMain)
      axios.request(options).then(function (response) {
        console.log(response.data.data.instrumentResponse.redirectInfo.url)

        const paymentDetail = {
          user: student,
          merchantTransactionId: merchantTransactionId,
          amount: totalPrice,
        }
        console.log(paymentDetail)
        paymentHelper.addPayment(paymentDetail)

        return res.send(response.data.data.instrumentResponse.redirectInfo.url)
      })
        .catch(function (error) {
          console.error(error);
          throw error;
        });

    } catch (error) {
      res.status(500).send({
        message: error.message,
        success: false
      })
    }
  }


  async checkStatus(req, res) {
    console.log("query", req.query)
    const { course, student } = req.query
    const merchantTransactionId = req.params['txnId']
    const merchantId = paymentMerchantId
    const { checksum } = paymentHelper.checkHashing(merchantTransactionId)
    console.log(checksum)
    const options = paymentHelper.getCheckOptions(merchantId, merchantTransactionId, checksum)
console.log(options)
    axios.request(options).then(async (response) => {
console.log("inside")
      if (response.data.success === true && response.data.code != "PAYMENT_PENDING" ) {
        console.log(response.data)///
        paymentHelper.updateStatus(merchantTransactionId, "Success")
        paymentHelper.addCourse(student, course)

        return res.status(200).send({ success: true, message: "Payment Success" });
      } else {
        return res.status(400).send({ success: false, message: "Payment Failure" });
      }
    })
      .catch((err) => {
        console.error("rrrrrrrrrrrrrrr", err);
        res.status(500).send({ msg: err.message });
      });

  };


};


module.exports = new BillingController();