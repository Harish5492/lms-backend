const mongoose = require('mongoose')
const validStatus = ['Success', 'Failure'];

const Payment = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  merchantTransactionId:{type:String,required: [true]},
  payed_on:{ type: Date, default: Date.now },
  amount : { type: String, required: [true, ] },
  status: {type:String,enum:validStatus,default:'Failure'},
});

module.exports = mongoose.model('PaymentDetails', Payment)