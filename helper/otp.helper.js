const bcrypt = require('bcrypt');
require('dotenv').config();
const accountSid = process.env.accountSid;
const authToken = process.env.authToken;
const sgMail = require('@sendgrid/mail');
const client = require('twilio')(accountSid, authToken);
const model = require('../models/user.model');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const CryptoJS = require('crypto-js');
const TOKENOTPKEY = process.env.OtpTokenKey;
const TOKENVERIFYKEY = process.env.OtpVerifyKey;
class OtpHelper {
  async checkEmail(email) {
    console.log('inside checkEmail');
    if (!email) return false;
    const userData = await model.findOne({ email: email });
    if (!userData) return false;
    return true;
  }

  genrateOTP() {
    return Math.floor(1000 + Math.random() * 9000);
  }

  async encryptOTP(otp) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(otp.toString(), salt);
  }

  sendOTPOnMobile(otp) {
    client.messages.create({
      body: `Your OTP is ${otp}`,
      from: '+12058283986',
      to: '+917018776373',
    });
  }
  async sendOTPOnEmail(otp) {
    const msg = {
      to: 'testcuproject4@gmail.com',
      from: 'ayushjamwal29072000@gmail.com',
      subject: 'OTP for Re-generate Password',
      text: 'Your OTP',
      html: `<strong>Your OTP is ${otp} Please Use it carefully</strong>`,
    };
    await sgMail.send(msg);
  }

  generateOTPToken(encData) {
    let token = CryptoJS.AES.encrypt(
      JSON.stringify(encData),
      TOKENOTPKEY
    ).toString();
    return token;
  }
  decryptOTPToken(token) {
    var bytes = CryptoJS.AES.decrypt(token, TOKENOTPKEY);
    const check = bytes.toString(CryptoJS.enc.Utf8);
    if (!check) throw 'Invalid token';
    var decryptedData = JSON.parse(check);
    return decryptedData;
  }

  generateVerifyToken(encData) {
    let token = CryptoJS.AES.encrypt(
      JSON.stringify(encData),
      TOKENVERIFYKEY
    ).toString();
    return token;
  }
  decryptVerifyToken(token) {
    var bytes = CryptoJS.AES.decrypt(token, TOKENVERIFYKEY);
    const check = bytes.toString(CryptoJS.enc.Utf8);
    if (!check) throw 'Invalid token';
    var decryptedData = JSON.parse(check);
    console.log('dec', decryptedData);
    return decryptedData;
  }

  checkSource(source) {
    console.log('source', source);
    const emailReg =
      /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

    if (/^\d{10}$/.test(source)) {
      return 'phoneNumber';
    } else if (emailReg.test(source)) {
      return 'email';
    }
    return 'userName';
  }
}

module.exports = new OtpHelper();
