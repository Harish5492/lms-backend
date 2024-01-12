
const jwt = require('jsonwebtoken')

require('dotenv').config()

const key = process.env.JWTKEY;

// console.log("test",test)

module.exports = function (req, res, next) {
    try{
     console.log("inside middleware")
    const authHeader = req.headers['x-api-authorization'] 
    if (!authHeader) throw'authorization missing'
    console.log("authHeader", authHeader)
    // const splitHeader = authHeader.split("Bearer ")
    jwt.verify(authHeader, key)
    const decodedToken = jwt.decode(authHeader, key)
    console.log(decodedToken)
    req.body.decodedToken = decodedToken
    if(!decodedToken) throw "not having token please login"
    next()
    }
    catch(err) {
        return res.send("error : " + err)
    }
}
