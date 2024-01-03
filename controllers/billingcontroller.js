// const { Number } = require('twilio/lib/twiml/VoiceResponse');
const billing = require('../models/billingmodel')
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


  async payment(req, res) {
    console.log("inside payment")
    try {
      const { totalPrice, queryString, decodedToken } = req.body
      const que = `${queryString}&student=${decodedToken.id}`
      const merchantTransactionId = paymentHelper.generateTransactionId()
      const data = paymentHelper.getData(merchantTransactionId, totalPrice, que)
      const { checksum, payloadMain } = paymentHelper.hashing(data)
      const options = paymentHelper.getOptions(checksum, payloadMain)
      axios.request(options).then(function (response) {
        console.log(response.data.data.instrumentResponse.redirectInfo.url)
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
    const { checksum } = paymentHelper.hashing()
    const options = paymentHelper.getCheckOptions(merchantId,merchantTransactionId,checksum)
    axios.request(options).then(async (response) => {
 
      if (response.data.success === true) {
        console.log(response.data)///
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