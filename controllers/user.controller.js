const model = require('../models/user.model');
const bcrypt = require('bcrypt');
const otpmodel = require('../models/otp');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Helper = require('../helper/index');
const { log } = require('console');
const CryptoJS = require('crypto-js');
const otpHelper = require('../helper/otp.helper');

const { OTPHelper } = Helper.module;
// console.log(OTPHelper);

// const otpHelper = require('../helper/otp.helper')
require('dotenv').config();
const key = process.env.JWTKEY;
const otp = process.env.OTP;
class UserController {
  /**
   * @function getAllUsers
   * @param  req
   * @param  res
   * @returns users
   **/
  //TODO create helper for respose send ; and  response error for all functions 
  async getAllUsers(req, res) {
    try {
      const users = await model.find();
      res.json(users);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  async status(req, res) {
    try {
      res.send('working');
    } catch (error) {
      res.status(500).send(error);
    }
  }

  /**
   * @function signup
   * @param  req
   * @param  res
   * @returns data
   **/
  async signup(req, res) {
    try {
      console.log('aap signup API main pravesh kr chuke hain');

      const emailExists = await model.findOne({ email: req.body.email });
      if (emailExists) throw { message: 'email exists', status: false };

      const usernameExists = await model.findOne({
        userName: req.body.userName,
      });
      // TODO create common function for usernameExists & emailExists

      if (usernameExists) throw { message: 'username exists', status: false };

      // TODO create common helper function for hashing and Salt
      const salt = await bcrypt.genSalt(10);
      const password = await bcrypt.hash(req.body.password, salt);

      const newData = new model({ ...req.body, password });
      await newData.save();
      // TODO user create method for save is expert-mode
      const userData = await model
        .findOne({ email: req.body.email }, ' userName email')
        .exec();
      res.json({ userData, status: true });
    } catch (error) {
      res.json(error);
    }
  }

  /**
   * @function updateUser
   * @param  req
   * @param  res
   * @returns message
   **/
  async updateUser(req, res) {
    try {
      const { firstName, lastName, userName, email, phoneNUmber } = req.body;
      const obj = {};
      if (firstName) obj.firstName = firstName;
      if (lastName) obj.lastName = lastName;
      if (userName) obj.userName = userName;
      if (email) obj.email = email;
      await model.findByIdAndUpdate(req.params.id, obj);
      res.send({ message: 'updated successfully' });
    } catch (error) {
      res.status(500).send(error);
    }
  }

  // /**
  //  * @function removeUser
  //  * @param  req
  //  * @param  res
  //  * @returns message
  //  **/
  //   async removeUser(req, res) {
  //   try {
  //     const data = await model.findByIdAndDelete(req.params.id);
  //     res.send('user deleted');
  //   } catch (error) {
  //     res.status(500).send(error);
  //   }
  // }

  /**
   * @function login
   * @param  req
   * @param  res
   * @returns token
   **/
  // TODO reduce code complexity 
  async login(req, res) {
    try {
      console.log('aap login API main pravesh kr chuke hain');
      console.log(req.body)

      // TODO: Consider using a validation library for better validation handling
      // use Joi or express validator
      if (!req.body.usernameOrEmail || !req.body.password)
        throw { message: 'Email/Username & password required' };
      const source = OTPHelper.checkSource(req.body.usernameOrEmail);

      const user = await model.findOne({ [source]: req.body.usernameOrEmail });
      //TODO optimze this like  below 
      // if (!user || !(await bcrypt.compare(password, user.password))) {
      //   throw { message: 'Invalid Login Credentials', status: false };
      // }
  
      if (!user) throw { message: 'Invalid Login Credentials', status: false };
      const pass = await bcrypt.compare(req.body.password, user.password);
      if (!pass) throw { message: 'Invalid Login Credentials', status: false };
      const token = jwt.sign({ email: user.email }, key, { expiresIn: '3h' });
      console.log('check', token);
      res.json({ token, status: true });
    } catch (error) {
      res.json({ error, status: false });
    }
  }

  /**
   * @function profile
   * @param  req
   * @param  res
   * @returns userData
   **/
  // async profile(req, res) {
  //   try {
  //     console.log('req.body : ', req.body);
  //     const userData = await model
  //       .findOne({ email: req.body.email }, 'name email')
  //       .exec();
  //     res.json({ message: 'verification succesful', userData });
  //   } catch (error) {
  //     res.status(500).send(error);
  //   }
  // }

  /**
   * @function getUser
   * @param  req
   * @param  res
   * @returns data,status
   **/
  async getUser(req, res) {
    try {
      console.log('aap getUser API main pravesh kr chuke hain');
      // TODO: Use destructuring to get the email from req.body
      // const { email } = req.body;

      if (!req.body.email) throw { message: 'No email Address given' };

      const userData = await model
        .findOne({ email: req.body.email }, 'userName email')
        .exec();

      if (!userData) throw { message: 'No email Found' };
      res.json({ userData, status: true });
    } catch (error) {
      res.json({ error, status: false });
    }
  }
  /**
   * @function generateOTP
   * @param  req
   * @param  res
   * @returns message
   **/

  //   const expirationTime = Date.now() + (2 * 60000);
  //   const generateRandomToken = () => crypto.randomBytes(20).toString('hex').expiresIn(expirationTime);
  //   const token = generateRandomToken();
  //  // Expires in 2 min

  async generateOTP(req, res) {
    try {
      console.log(' inside generation of OTP');
      const check = await OTPHelper.checkEmail(req.body.email);
      if (!check) throw { message: 'Unregistered email given' };

      const otp = OTPHelper.genrateOTP();

      const encOtp = await OTPHelper.encryptOTP(otp);
      const isEmail = await otpmodel.findOne({ email: req.body.email });
      let user = isEmail;


      if (isEmail) {
        await otpmodel.updateOne({ ...req.body, otp: encOtp });
      } else {
        user = await otpmodel.create({ ...req.body, otp: encOtp });
      }
      OTPHelper.sendOTPOnMobile(otp);
      OTPHelper.sendOTPOnEmail(otp)

      let currentTime = new Date();
      currentTime.setMinutes(currentTime.getMinutes() + 1);
      const encData = { email: user.email, exp: currentTime };
      let token = OTPHelper.generateOTPToken(encData);

      res.json({ message: 'OTP sent successfully...', status: true, token });
    } catch (error) {
      console.log(error);
      res.json({ error, status: false });
    }
  }

  /**
   * @function verifyOtp
   * @param  req
   * @param  res
   * @returns message
   **/
  async verifyOTP(req, res) {
    try {
      console.log('inside otp verify');
      console.log(req.body);
      const { token, otp } = req.body;
      // TODO: Consider validating token and otp presence before proceeding.
      // if (!token || !otp) {
      //   throw { message: 'Token or OTP missing' };
      // }
      
      if (!token) throw { message: 'No token' };

      var decryptedData = OTPHelper.decryptOTPToken(token);
      console.log(decryptedData);
      const { email, exp } = decryptedData;

      const isEmailExist = await otpmodel.findOne({ email });
      if (!isEmailExist) throw 'Invalid';

      // TODO: Create a common function for bcrypt
      const OTP = await bcrypt.compare(otp, isEmailExist.otp);
      // TODO: write invalid Otp message in common file helper

      if (!OTP) throw 'invalid Otp';

      // TODO: Create a common function for check otp expiration

      if (new Date() > new Date(exp)) throw { message: 'OTP expired' };

      // TODO: Create a common function for add exp time

      let currentTime = new Date();
      currentTime.setMinutes(currentTime.getMinutes() + 1);
      const encData = { email: email, exp: currentTime };


      const verifyToken = OTPHelper.generateVerifyToken(encData);
      res.json({ message: 'verified', status: true, verifyToken });
    } catch (error) {
      res.status(500).json({ error, status: false });
    }
  }

  // /**
  //  * @function forgotPassword
  //  * @param  req
  //  * @param  res
  //  * @returns data
  //  **/
  // async forgotPassword(req, res) {
  //   try {

  //     console.log('aap forgotPassword API main pravesh kr chuke hain');
  //     if (!req.body.password) throw 'only password will change';

  //     const salt = await bcrypt.genSalt(10);
  //     const password = await bcrypt.hash(req.body.password, salt);

  //     const data = await model.findOneAndUpdate(
  //       { email: req.params.email },
  //       { password: password },
  //       { new: true }
  //     );

  //     res.json({ message: 'Password Updated Succesfully' });
  //   } catch (error) {
  //     res.status(500).send(error);
  //   }
  // }

  /* @param  res
   * @returns data
   **/
  async updatePassword(req, res) {
    try {
      // TODO: Consider logging level and format
      // console.log('ForgotPassword API has been accessed.'); 
      // TODO: add meaningful console message

      console.log('aap forgotPassword API main pravesh kr chuke hain');

      console.log('req', req.body);
      const { verifyToken } = req.body;
      if (!verifyToken) throw { message: 'No token' };
      var decryptedData = OTPHelper.decryptVerifyToken(verifyToken);
      console.log(decryptedData);
      // TODO Destructure email and exp directly
      // const { email, exp } = decryptedData; 

      const { email } = decryptedData;
      if (!email) throw { message: 'Invalid Email' };

      // TODO crate a common fuction to check token expire as above

      if (new Date() > new Date(exp)) throw { message: 'Token expired' };
      
      // TODO crate a common fuction for hashing password

      const salt = await bcrypt.genSalt(10);
      const password = await bcrypt.hash(req.body.password, salt);

      await model.findOneAndUpdate(
        { email: email },
        { password: password },
        { new: true }
      );
      res.json({ message: 'Password Updated Succesfully', status: true });
    } catch (error) {
      res.json({ error, status: false });
    }
  }
}

module.exports = new UserController();
