const model = require('../models/model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const key = process.env.JWTKEY;

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


  async status(req, res) {
    try {
      res.send("working");
    } catch (error) {
      res.status(500).send(error);
    }
  }

  /**
   * @function getUser
   * @param  req 
   * @param  res 
   * @returns data
   **/
  async getUser(req, res) {
    try {
      const data = await model.findById(req.params.id);
      res.json(data);
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
  async signup(req, res) {
    try {
      console.log(req.body)
      const emailExists  =await model.findOne({email : req.body.email})
      if(emailExists) throw "Email Exists"

      const usernameExists  =await model.findOne({userName : req.body.userName})
      if(usernameExists) throw "Username Exists"

      const salt = await bcrypt.genSalt(10);
      const password = await bcrypt.hash(req.body.password, salt);

      const newData = new model({ ...req.body, password });
      await newData.save();
      const userData = await model.findOne({ email: req.body.email }, ' userName email').exec();
      res.json({userData,status:true});
    }  
    catch (error) {
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

      await model.findByIdAndUpdate(req.params.id, req.body);
      const data = await model.findById(req.params.id);
      res.send(data);
    } catch (error) {
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
      const data = await model.findByIdAndDelete(req.params.id);
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
      console.log(req.body)
      const { email, password } = req.body;
      if(!email  ||  !password) throw "Email & password required"
      const user = await model.findOne({ email});
      console.log(user)
      const pass = await bcrypt.compare(password, user.password);
      if (!pass) throw 'wrong password';
      const token = jwt.sign({ email }, key, { expiresIn: '3h' });
      return res.send({token});
      
    } catch (error) {
      res.status(500).send(error);
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
