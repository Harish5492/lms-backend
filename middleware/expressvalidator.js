const { body, validationResult } = require('express-validator');

const validateSignup = [
  // validate name
  body('firstName')
  .trim()
  .isLength({ min: 3 })
  .withMessage('firstName must be at least 3 characters long')
  .isAlpha()
  .withMessage('firstName must be only Alphabets')
  ,

  body('lastName')
  .trim()
  .isLength({ min: 3 })  
  .withMessage('lastName must be at least 3 characters long')
  .isAlpha()
  .withMessage('lastName must be only Alphabets')
,

  // Validate username
  body('userName')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters long')
    .isAlphanumeric()
    .withMessage('Username must only contain letters and numbers'),

  // Validate phoneNumber
  body('phoneNumber')
  .trim()
  .isLength({ min: 10, max: 10 })
  .withMessage('phoneNumber must have 10 digits')
  .isNumeric()
  .withMessage('Numbers should be numeric'),


  // Validate email
  body('email')
    .trim()
    .isEmail()
    .withMessage('Invalid email address')
    .matches(/\.com$|\.org$|\.edu$|\.net$|\.gov$|\.in$/i)
    .withMessage('Email must have a .com, .org, .edu, .net, .gov,.in domain'),

  // Validate password
  body('password').isStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  }).withMessage('Must have :-  One Lowercase, One Uppercase, One Number, One Symbol with min-length Eight'),

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

const handleValidationErrors = (req, res, next) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  validateSignup,
  handleValidationErrors,
};
