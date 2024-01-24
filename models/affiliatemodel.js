const mongoose = require('mongoose')

const affiliate = new mongoose.Schema({
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    affiliateToken : {type: String},
    rewards : {type: Number,default:0},
    affiliator : { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    created_on: { type: Date, default: Date.now } 
})
 
module.exports = mongoose.model('affiliateMarketing',affiliate)
