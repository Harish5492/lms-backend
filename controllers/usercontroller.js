const model = require('../models/usermodel');
const otpmodel = require('../models/otpmodel')
const { Course, Lesson } = require('../models/coursemodel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const key = process.env.JWTKEY;
const Helper = require('../helper/index');
const otpHelper = require('../helper/otp.helper');
const { OTPHelper, UserHelper } = Helper.module


class UserController {

  /**
* @function getAllUsers
* @param  req 
* @param  res 
* @returns users
**/
  async getAllUsers(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const itemsPerPage = parseInt(req.query.itemsPerPage) || 10;
      const skip = (page - 1) * itemsPerPage;

      const users = await model.find()
        .skip(skip)
        .limit(itemsPerPage)
        .exec();
      const totalCourses = await model.countDocuments();
      res.json({ status: true, users, totalCourses });
    } catch (error) {
      res.status(500).send(error);

    }
  }

  /**
 * @function getUser
 * @param  req 
 * @param  res 
 * @returns data,status
 **/
  async getUser(req, res) {
    try {

      const { email } = req.body
      if (!email) throw { message: 'No email address given', status: false }
      const userData = await model.findOne({ email: email }, 'username email').exec();
      if (!userData) throw { message: 'No email Found', status: false }
      res.json({ userData, status: true });
    } catch (error) {
      res.status(500).send(error);
    }
  }

  /**
   * @function signin
   * @param  req 
   * @param  res 
   * @returns data
   **/
  async signUp(req, res) {
    try {
      console.log("inside signUp", req.body)
      await UserHelper.userCheck(req.body.email, req.body.userName, req.body.phoneNumber)
      const password = await UserHelper.encryptPassword(req.body.password);
      const data = await model.create({ ...req.body, password });
      res.json({ data, status: true });
    } catch (error) {
      console.log(error.message)
      res.status(500).send(error);
    }
  }


  /**
 * @function updateUser
 * @param  req 
 * @param  res 
 * @returns data
 **/
  async updateUser(req, res) {
    try {
      console.log("inside update user", req.body)
      const { firstName, lastName, userName, email, phoneNumber } = req.body;
      const obj = {}
      if (firstName) obj.firstName = firstName
      if (lastName) obj.lastName = lastName
      if (userName) obj.userName = userName
      if (email) obj.email = email
      if (phoneNumber) obj.phoneNumber = phoneNumber
      await model.findByIdAndUpdate(req.params.id, obj);
      res.json({ message: "updated successfully", status: true });
    }
    catch (error) {
      if (error.name === 'ValidationError') {
        res.status(400).json({ status: false, error: error.message });
      } else if (error.name === 'MongoError' && error.code === 11000) {
        const key = Object.keys(error.keyValue)[0];

        res.status(409).json({ status: false, message: `${key} already exists` });
      } else {
        console.error(error);
        res.status(500).json({ status: false, message: error.message });
      }
    }
  }

  /**
* @function forgotPassword
* @param  req 
* @param  res 
* @returns data
**/

  async forgotPassword(req, res) {
    try {
      console.log("inside forget");
      if (!req.body.password) throw "only password will change";
      const password = await UserHelper.encryptPassword(req.body.password);
      await UserHelper.updateData(req.params.email, password)
      res.send({ message: "Password Updated Successfully" });
    } catch (error) {
      res.status(500).send(error);
    }
  }


  /**
  * @function forgotPassword
  * @param  req 
  * @param  res 
  * @returns data
  **/

  async updatePassword(req, res) {
    try {
      console.log("in update Password");
      const { token } = req.body
      if (!req.body.password) throw "you need to give token and password"
      OTPHelper.verifydecryptOtpToken(token)
      const password = await UserHelper.encryptPassword(req.body.password);
      await UserHelper.updateData(req.body.email, password)
      res.send({ message: "Password Updated Successfully" });
    }
    catch (error) {
      res.status(500).send(error);
    }
  }

  /**
* @function generateOTP
* @param  req 
* @param  res 
* @returns data
**/
  async generateOTP(req, res) {
    try {
      console.log(" inside generation of OTP")
      const check = await OTPHelper.checkEmail(req.body.email)
      if (!check) throw ({ message: 'Unregistered email given' })
      const otp = OTPHelper.genrateRandamNo()
      const encOtp = await OTPHelper.encryptOTP(otp)
      const isEmail = await otpmodel.findOne({ email: req.body.email })
      let user = isEmail
      if (isEmail) {
        await otpmodel.updateOne({ ...req.body, otp: encOtp })
      } else {
        user = await otpmodel.create({ ...req.body, otp: encOtp })
      }
      OTPHelper.sendOTPOnMobile(otp)
      let currentTime = new Date();
      currentTime.setMinutes(currentTime.getMinutes() + 1);
      const encData = { email: user.email, exp: currentTime }
      let token = OTPHelper.generateOtpToken(encData)
      res.json({ message: "OTP sent successfully...", status: true, token });
    }
    catch (error) {
      console.log(error)
      res.status(500).json({ error, status: false });
    }
  }


  /**
  * @function otpbyemail
  * @param  req 
  * @param  res 
  * @returns message
  **/

  async otpbyemail(req, res) {
    try {
      const otp = OTPHelper.genrateOTP()
      const encOtp = await OTPHelper.encryptOTP(otp)
      const isEmail = await otpmodel.findOne({ email: req.body.email })
      let user = isEmail
      if (isEmail) {
        await otpmodel.updateOne({ ...req.body, otp: encOtp })
      } else {
        user = await otpmodel.create({ ...req.body, otp: encOtp })
      }
      OTPHelper.sendOTPOnEmail(otp)
      let currentTime = new Date();
      currentTime.setMinutes(currentTime.getMinutes() + 1);
      const encData = { email: user.email, exp: currentTime }
      let token = OTPHelper.generateOtpToken(encData)
      res.json({ message: "OTP sent successfully...", status: true, token });
    }
    catch (error) {
      console.error(error);
      res.status(500).send('Error sending email');
    }
  }

  /**
  * @function verifyOtp
  * @param  req 
  * @param  res {
  * @returns message
  **/

  async verifyOTP(req, res) {
    try {
      const { token, otp } = req.body
      if (!token || !otp) throw { message: 'Token or OTP missing', status: false };

      let decryptedData = OTPHelper.decryptOtpToken(token)
      const { email, exp } = decryptedData

      await otpHelper.validateOtpData(otp, email, exp)
      const currentTime = otpHelper.getCurrentTime()
      const encData = { email: email, exp: currentTime }
      const Token = OTPHelper.verifytoken(encData)
      res.json({ message: 'verified', Token })
    }
    catch (error) {
      res.status(500).send(error);
    }
  }



  /**
   * @function removeUser
   * @param  req 
   * @param  res 
   * @returns message
   **/
  async removeUser(req, res) {
    try {
      await model.findByIdAndDelete(req.params.id);
      res.send('user deleted');
    } catch (error) {
      res.status(500).send(error);
    }
  }

  /**
 * @function login
 * @param  req 
 * @param  res  
 * @returns token
 **/
  async login(req, res) {
    try {
      console.log('Login API main has been accesed');
      const { usernameOrEmail, password } = req.body

      if (!usernameOrEmail || !password)
        throw { message: 'Email/UserName & password required' };
      const source = OTPHelper.checkSource(usernameOrEmail);
      const user = await model.findOne({ [source]: usernameOrEmail });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw { message: 'Invalid Login Credentials', status: false };
      }
      const token = jwt.sign({ email: user.email, id: user._id, role: user.role }, key, { expiresIn: '10h' });
      return res.send({ token, status: true });
    } catch (error) {
      res.json({ error, status: false });
    }
  }


  //   /**
  //  * @function profile
  //  * @param  req 
  //  * @param  res 
  //  * @returns userData
  //  **/
  //   async profile(req, res) {
  //     try {
  //       // console.log('req.body : ', req.body);
  //       const userData = await model
  //         .findOne({ email: req.body.email }, 'name email')
  //         .exec();
  //       res.json({ message: 'verification succesful', userData });
  //     } catch (error) {
  //       res.status(500).send(error);
  //     }
  //   }
  // async myCourses(req, res) {
  //   try {
  //     console.log("inside myCourses");
  //     const { decodedToken } = req.body;
  //     // console.log("id", decodedToken.id);
  //     const courses = await model.findOne({ _id: decodedToken.id }, 'courseEnrolled');
  //     // console.log("Courses", courses);
  //     const myCourses = [];
  //     for (const data of courses.courseEnrolled) {
  //       const Allcourse = await Course.findById({ _id: data });
  //       // console.log(Allcourse);
  //       myCourses.push(Allcourse);
  //     }
  //     // console.log("asdfghjkl;kjhgfdrtfgyhuiytryu",myCourses);
  //     res.json({ message: "Your courses are :- ", myCourses, status: true });
  //   } catch (error) {
  //     res.status(404).json(error.message);
  
    // }}
  async myCourses(req, res) {
    try {
      console.log("inside myCourses");
      const { decodedToken } = req.body;
      // console.log("id", decodedToken.id);
      const courses = await model.findOne({ _id: decodedToken.id} ,'courseEnrolled').populate('courseEnrolled')
      const myCourses = courses.courseEnrolled
      res.json({ message: "Your courses are :- ", myCourses, status: true });
    } catch (error) {
      res.status(404).json(error.message);
    }
  }

  async getUserbyID(req, res) {
    try {
      console.log("inside getuserbyID", req.params)
      const { id } = req.params
      if (!id) throw { message: 'No id given', status: false }
      const userData = await model.findOne({ _id: id }, 'userName email firstName lastName').exec();
      if (!userData) throw { message: 'No user Found', status: false }

      res.json({ userData, status: true });
    } catch (error) {
      res.status(500).send(error);
    }
  }

  /**
 * @function profile
 * @param  req 
 * @param  res 
 * @returns userData
//  **/
  async profile(req, res) {
    try {
      console.log("inside profile")
      const { decodedToken } = req.body;
      console.log("id", decodedToken.id);
      if (!decodedToken.id) throw { message: 'No user Found', status: false }
      const userData = await model
        .findOne({ _id: decodedToken.id })
        .select('firstName lastName email userName phoneNumber created_on courseEnrolled affilliationLinkRequested')
        .exec();
      const length = userData.courseEnrolled.length
      if (!userData) throw { message: 'No email Found', status: false }
      res.json({ userData, length, status: true });
    } catch (error) {
      res.status(500).send(error);
    }
  }

  async test(req, res) {
    try {
      console.log("inside test")
      const { name } = req.body
      const data = await model.findOne({ userName: name }, 'courseEnrolled').populate('courseEnrolled');
      if (data) {
        // await data.populate('courseEnrolled').execPopulate();
        console.log("data", data);
        res.json({ data, message: "successful", status: true });
      } else {
        res.json({ message: "User not found", status: false });
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  }


}


module.exports = new UserController();
