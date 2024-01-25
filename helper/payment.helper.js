const user = require('../models/usermodel');
const mongoose = require('mongoose')
const payment = require('../models/payment.model')
const { Course } = require('../models/coursemodel')
const affiliatemodel = require('../models/affiliatemodel')
const crypto = require('crypto');
const CryptoJS = require("crypto-js");
require('dotenv').config();
const paymentKeyIndex = process.env.PAYMENTKEYINDEX;
const paymentKey = process.env.PAYMENTKEY
// const paymentMerchantId = process.env.MERCHANTID
const paymentMerchantId = 'PGTESTPAYUAT'
const paymentMerchantUserId = process.env.MERCHANTUSERID
const affiliationKey = process.env.AFFILIATETOKENKEY




class paymentHelper {

  async addCourse(student, coursesArray) {
    console.log("inside addCourse")
    const result1 = await user.findOneAndUpdate(
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

  hashing(data) {

    const payload = JSON.stringify(data);
    const payloadMain = Buffer.from(payload).toString('base64');
    console.log(payloadMain)
    // const keyIndex = paymentKeyIndex;
    const keyIndex = '1';
    // const key = paymentKey;
    const key = '099eb0cd-02cf-4e2a-8aca-3e6c6aff0399';
    const string = payloadMain + '/pg/v1/pay' + key;
    const sha256 = crypto.createHash('sha256').update(string).digest('hex');
    const checksum = sha256 + '###' + keyIndex;
    return { checksum, payloadMain };

  }
  checkHashing(merchantTransactionId) {
    // const keyIndex = paymentKeyIndex;
    const keyIndex = '1';
    // const key = paymentKey;
    const key = '099eb0cd-02cf-4e2a-8aca-3e6c6aff0399';
    const string = `/pg/v1/status/${paymentMerchantId}/${merchantTransactionId}` + key;
    const sha256 = crypto.createHash('sha256').update(string).digest('hex');
    const checksum = sha256 + '###' + keyIndex;
    return { checksum };

  }

  getData(merchantTransactionId, totalPrice, que) {
    const data = {
      merchantId: paymentMerchantId,
      merchantUserId: paymentMerchantUserId,
      merchantTransactionId: merchantTransactionId,
      amount: totalPrice * 100,
      redirectUrl: `http://10.10.2.82:3000/user/payment/checkStatus/${merchantTransactionId}?${que}`,
      // redirectUrl: `http://10.10.2.82:8000/user/payment/checkStatus/${merchantTransactionId}?${ur}`,
      redirectMode: 'REDIRECT',
      paymentInstrument: {
        type: 'PAY_PAGE'
      }
    };
    return data;
  }
  getOptions(checksum, payloadMain) {
    const options = {
      method: 'POST',
      // url: "https://api.phonepe.com/apis/hermes/pg/v1/pay",
      url: "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay",
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        'X-VERIFY': checksum,
      },
      data: {
        request: payloadMain
      }
    };
    return options;
  }

  getCheckOptions(merchantId, merchantTransactionId, checksum) {
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
    return options

  }

  //   async checkAmount(productIds,totalPrice){
  //     console.log("inside checkamount",productIds,totalPrice)
  //     const totalAmount = await Course.findOne({_id:productIds},'price')

  // console.log(totalAmount)
  //     if(totalPrice!=totalAmount.price) throw {message:"Amount Mismatch", status:false}
  //   } 

  async checkAmount(productIds, totalPrice) {
    console.log("inside checkamount", productIds, 'totalPrice', totalPrice);

    // Fetch courses by their IDs
    const courses = await Course.find({ _id: { $in: productIds } }, 'price');

    // Calculate the total amount by summing the prices
    const totalAmount = courses.reduce((total, course) => {
      const amount = parseFloat(course.price); // Use parseFloat for decimal numbers
      return total + (isNaN(amount) ? 0 : amount);
    }, 0);

    console.log('totalAmount', totalAmount);
    console.log('typeoftotalAmount', typeof totalAmount);
    console.log('typeoftotalPrice', typeof totalPrice);

    // const discountPercentage = 10;
    // const discountedTotalAmount = parseFloat((totalAmount - (totalAmount * (discountPercentage / 100))).toFixed(2));

    // // Function to remove trailing zeros after the decimal point
    // const removeTrailingZeros = (num) => parseFloat(num.toString().replace(/(\.[0-9]*[1-9])0+$|\.0*$/, '$1'));

    // const formattedDiscountedTotalAmount = removeTrailingZeros(discountedTotalAmount);
    // const formattedTotalPrice = removeTrailingZeros(totalPrice);

    // Use Math.abs() to handle potential floating-point precision issues
    if (totalPrice < 0.9 * totalAmount) {
      console.warn("Amount Mismatch or Invalid Discount - Warning sent to admin");
      throw { message: "Amount Mismatch or Invalid Discount", status: false };
    }

  }

  async addPayment(paymentDetail) {
    console.log("inside addPayment")
    console.log(paymentDetail)
    const obj = paymentDetail
    console.log("obj", obj)
    await payment.create(obj)
    console.log("payment Added Successfully")
  }

  async updateStatus(merchantTransactionId, status) {
    console.log("inside updateStatus")
    await payment.findOneAndUpdate(
      { merchantTransactionId: merchantTransactionId },
      { status: status }
    )
    console.log("payment Added Successfully")
  }


  async studentEnrolled(student, coursesArray) {
    console.log("inside studentEnrolled", student, coursesArray);

    for (const courseId of coursesArray) {
      // Check if courseId is a valid ObjectI

      if (!mongoose.Types.ObjectId.isValid(courseId)) {
        console.error(`Invalid courseId: ${courseId}`);
        continue; // Skip to the next iteration
      }

      try {
        const result = await Course.findByIdAndUpdate(
          mongoose.Types.ObjectId(courseId),
          { $push: { studentsEnrolled: student } },
          { new: true }
        );

        console.log(`Student enrolled successfully in course ${courseId}`);
        console.log("Course: ", result);
      } catch (error) {
        console.error(error.message);
      }
    }
  }

  async alreadyHaveCourse(decodedToken, productIds) {
    // const courses = await Course.find({ studentsEnrolled: decodedToken.id }, 'studentsEnrolled');

    const courses = await Course.find({ _id: { $in: productIds } }, 'studentsEnrolled');
    let array = [];
    console.log("yoyohoneysingh", courses);

    if (courses && courses.length > 0) {
      // Iterate over each course and check if decodedToken.id is present in studentsEnrolled
      for (const course of courses) {
        if (course.studentsEnrolled.includes(decodedToken.id)) {
          array.push(course._id)
        }
      }
      console.log("Array", array)
    }

    if (array.length) throw ({ message: "You have already bought one of the course", status: false });

  }

  async decodeToken(affiliateToken) {
    console.log("inside decodeToken")

    let CryDtoken = CryptoJS.AES.decrypt(affiliateToken, affiliationKey);
    let check = CryDtoken.toString(CryptoJS.enc.Utf8);
    let decryptedData = JSON.parse(check);
    console.log("final is here", decryptedData);
    // let CryDtoken = CryptoJS.AES.decrypt(affiliateToken, affiliationKey);
    console.log("inside decodeToken", CryDtoken)

    return decryptedData

  }

  // async addRewards(affiliateToken,productIds) {
  //   console.log("inside token ifffff");
  //   const decryptedData = await this.decodeToken(affiliateToken);
  //   console.log("decryptedData", decryptedData.course_id, productIds[0]);
  //   if (decryptedData.course_id == productIds[0]) {
  //     console.log("inside other iffffffffff");
  //     // await affiliatemodel.findOneAndUpdate(
  //     //   { affiliator: decryptedData.user_id },
  //     //   { $set: { rewards: 0 } }
  //     // );
  //   }
  // }

  async updateReward(affiliateToken, totalPrice) {
    console.log("inside updateReward")
    const decryptedData = await this.decodeToken(affiliateToken);
    await affiliatemodel.findOneAndUpdate(
      { affiliator: decryptedData.user_id },
      { $set: { rewards: 0.1 * totalPrice } }
    )
    console.log("payment Added Successfully")
  }


}



module.exports = new paymentHelper();
