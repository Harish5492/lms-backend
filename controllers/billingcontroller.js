// const { Number } = require('twilio/lib/twiml/VoiceResponse');
const billing = require('../models/billingmodel')
const axios = require('axios');
const crypto = require('crypto');
const Helper = require('../helper/index')
const { paymentHelper } = Helper.module

const course =  require('../models/coursemodel')
require("dotenv").config();

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
      console.log("MID",merchantTransactionId)
      const data = {
        merchantId: 'M13OSQIY7Y60',
        merchantUserId: 'MNSDBB1234JVB3',
        merchantTransactionId: merchantTransactionId,
        amount: totalPrice,
        redirectUrl: `http://10.10.2.82:3000/user/payment/checkStatus/${merchantTransactionId}?${que}`,
        // redirectUrl: `http://10.10.2.82:8000/user/payment/checkStatus/${merchantTransactionId}?${ur}`,
        redirectMode: 'REDIRECT',
        paymentInstrument: {
          type: 'PAY_PAGE'
        }
      };
      const payload = JSON.stringify(data);
      const payloadMain = Buffer.from(payload).toString('base64');
      const keyIndex = 1;
      const key = '2b127c0a-0e65-4954-a2c8-8cb39e47c4dd'
      const string = payloadMain + '/pg/v1/pay' + key;
      const sha256 = crypto.createHash('sha256').update(string).digest('hex');
      const checksum = sha256 + '###' + keyIndex;

      // const URL = "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay"
      const URL = "https://api.phonepe.com/apis/hermes/pg/v1/pay"

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
    // console.log("inside checkStatus", req.body)
    console.log("query", req.query)
    const { course, student } = req.query
    const merchantTransactionId = req.params['txnId']
    const merchantId = "M13OSQIY7Y60"


    console.log(merchantId, merchantTransactionId)
    const key = '2b127c0a-0e65-4954-a2c8-8cb39e47c4dd'
    const keyIndex = 1;
    const string = `/pg/v1/status/${merchantId}/${merchantTransactionId}` + key;
    const sha256 = crypto.createHash('sha256').update(string).digest('hex');
    const checksum = sha256 + "###" + keyIndex;
    console.log("in the start")

    const options = {
      method: 'GET',
      // url: `https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status/${merchantId}/${merchantTransactionId}`,
      url: `https://api.phonepe.com/apis/hermes/pg/v1/status/${merchantId}/${merchantTransactionId}`,
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        'X-VERIFY': checksum,
        'X-MERCHANT-ID': `${merchantId}`
      }
    };
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