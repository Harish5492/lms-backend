const { body, validationResult } = require('express-validator');
const Joi = require('joi');
const isValidDomain = require('is-valid-domain')


const validateSignup = [
  // validate name
  body('firstName')
  .isLength({ min: 3 })
  .withMessage('name must be at least 3 characters long'),

  body('lastName')
  .isLength({ min: 3 })
  .withMessage('name must be at least 3 characters long'),

  // Validate username
  body('userName')
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters long')
    .isAlphanumeric()
    .withMessage('Username must only contain letters and numbers'),

  //Validate phoneNumber
  body('phoneNumber')
  .isNumeric()
  .withMessage('Phone Number must be  Number')
  .isLength({min:10,max:10})
  .withMessage('Phone Number must be 10 Digits'),

  // Validate email

  body('email')
  .isEmail({
     require_tld : true   
  })
  .withMessage('Invalid email address')
  .matches(/\.com$|\.org$|\.edu$|\.net$|\.gov$/i)
  .withMessage('Email must have a .com, .org, .edu, .net, .gov domain')
      // const allowedTLDs = ['com', 'net', 'org'];
      //     const [, tld] = email.split('@')[1].split('.');
      //     if (!allowedTLDs.includes(tld)) throw 'Invalid TLD ! Only [ com, net, org ] are allowed' 
  ,

  // Validate password
  body('password').isStrongPassword(
  // For Custom Inputs
    //   {
  //   minLength: 8,
  //   minLowercase: 1,
  //   minUppercase: 1,
  //   minNumbers: 1,
  //   minSymbols: 1,
  // }
  ).withMessage('Must Contain :  Atleast 1 Uppercase, Atleast 1 Speacialcase Character, Minimun length 8, Atleast 1 number'),

  // Validate confirm password
  body('confirmPassword').notEmpty().custom(async (confirmPassword,{req})=>{
    const password = req.body.password
    if(confirmPassword !== password) throw 'Confirm password must match'
  }),
  //Validate terms and conditions
  body('acceptTerms').custom(async (acceptTerms,{req})=>{
    if(!acceptTerms) throw "Please Accept Terms"
  })
];

// const emailSchema = Joi.object({
//   email: Joi.string().email().custom((req, res) => {
//     // Custom TLD validation
//     const allowedTLDs = ['com', 'net', 'org'];

//     const [, tld] = value.split('@')[1].split('.');

//     if (!allowedTLDs.includes(tld)) {
//       return helpers.message({ custom: 'Invalid TLD' });
//     }

//     return value;
//     next()
//   }),
// })


// "john@doe.com"
const validEmail = (req,res,next)=>{ 
  try{
    console.log ("validemail")
  // const schema = Joi.string().email({
  //   tld : true
  // }).trim();
  
  // const temp = Joi.attempt(req.body.email, schema);
  // res.body = temp
  // console.log(temp,"temp")
  const re = /^[-a-zA-Z0-9_.]+@[-a-zA-Z0-9]+.[a-zA-Z]{2,4}$/ ;
  const check = re.test(req.body.email)
  console.log(check,"check")
  if(check) next()
else throw "invalid email"}
catch(error){
  console.log(error,"error")
res.json({error,status:false})
}
}

const handleValidationErrors = (req, res, next) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array()});
  }
  next();
};

module.exports = {
  validateSignup,
  validEmail,
  handleValidationErrors,
};
