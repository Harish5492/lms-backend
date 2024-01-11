const mongoose = require('mongoose')
const validStatus = ['Success', 'Failure','Pending'];

const affiliateRequest = new mongoose.Schema({
    requestorID : { type: mongoose.Schema.Types.ObjectId,required:true, ref: 'User' },
    requestorEmail : { type: String },
    requested_on: { type: Date, default: Date.now },
    requestStatus: { type: String, enum : validStatus, default: validStatus[2] },
    remarks: { type: String ,default: 'No Remarks'},
})
 
module.exports = mongoose.model('affiliateRequest',affiliateRequest)
