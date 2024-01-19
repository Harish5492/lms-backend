
require('dotenv').config()

class role{
 async isAdmin (req, res, next) {
    try{
     console.log("inside isAdmin")
     const { decodedToken } = req.body
     if (decodedToken.role !== 'admin') throw { message: "only admin can access", status: false };
    next()
    }
    catch(err) {
        return res.send(err)
    }
}
async isSubAdmin (req, res, next) {
    try{
     console.log("inside isSubAdmin")
     const { decodedToken } = req.body
     if (decodedToken.role !== 'subAdmin' && decodedToken.role!== 'admin') throw { message: "only admin and sub admin can access", status: false };
    next()
    }
    catch(err) {
        return res.send(err)
    }
}
}
module.exports = new role();