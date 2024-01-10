const mongoose = require('mongoose')

const affiliate = new mongoose.Schema({
    courseId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    affiliateLink : {type: String},
    affiliator : { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    created_on: { type: Date, default: Date.now } 
})
 
module.exports = mongoose.model('affiliateMarketing',affiliate)
