const model = require('../models/model');
const otpmodel = require('../models/otpmodel')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const key = process.env.JWTKEY;
const Helper = require('../helper/index')
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
      const users = await model.find();
      res.json(users);
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
      if (!req.body.email) throw 'No email Address given'
      const userData = await model.findOne({ email: req.body.email }, 'username email').exec();
      if (!userData) throw 'No email Found'
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
      console.log("inside signUp")
      UserHelper.userCheck(req.body.email, req.body.userName, req.body.phoneNumber)

      const password = await UserHelper.encryptPassword(req.body.password);
      console.log("chchchc")
      const data = new model.create({ ...req.body, password });


      res.json({ data, status: true });
    } catch (error) {
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
      const { firstName, lastName, userName, email } = req.body;
      const obj = {}
      if (firstName) obj.firstName = firstName
      if (lastName) obj.lastName = lastName
      if (userName) obj.userName = userName
      if (email) obj.email = email
      await model.findByIdAndUpdate(req.params.id, obj);
      res.json({ message: "updated successfully" });
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
      console.log(req.body)
      const { token, otp } = req.body
      let decryptedData = OTPHelper.decryptOtpToken(token)
      const { email, exp } = decryptedData
      const isEmailExist = await otpmodel.findOne({ email });
      if (!isEmailExist) throw "Email not exist";
      const OTP = await bcrypt.compare(otp, isEmailExist.otp);
      if (!OTP) throw "invalid Otp";
      if (new Date() > new Date(exp)) throw "OTP expired";
      let currentTime = new Date();
      currentTime.setMinutes(currentTime.getMinutes() + 1);
      const encData = { email: email, exp: currentTime }
      const Token = OTPHelper.verifytoken(encData)
      console.log("afterToken")
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
      console.log('aap login API main pravesh kr chuke hain');
      if (!req.body.usernameOrEmail || !req.body.password)
      throw { message: 'Email/UserName & password required' };
      const source = OTPHelper.checkSource(req.body.usernameOrEmail);
      const user = await model.findOne({ [source]: req.body.usernameOrEmail });
      const pass = await bcrypt.compare(req.body.password, user.password);
      if (!pass) throw { message: 'Invalid Login Credentials', status: false };
      const token = jwt.sign({ email: user.email, id: user._id, role: user.role }, key, { expiresIn: '3h' });
      console.log("token", token)
      return res.send({ token, status: true });
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
  async profile(req, res) {
    try {
      console.log('req.body : ', req.body);
      const userData = await model
        .findOne({ email: req.body.email }, 'name email')
        .exec();
      res.json({ message: 'verification succesful', userData });
    } catch (error) {
      res.status(500).send(error);
    }
  }

}


module.exports = new UserController();
