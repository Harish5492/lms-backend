const mongoose = require('mongoose')
const validStatus = ['Success', 'Failure','Pending'];

const Payment = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  email: { type: String },
  courseBought : [{type:mongoose.Schema.Types.ObjectId, ref: 'Course'}],
  merchantTransactionId: { type: String, required: [true] },
  payed_on: { type: Date, default: Date.now },
  amount: { type: String, required: [true,] },
  status: { type: String, enum: validStatus, default: 'Pending' },
});

module.exports = mongoose.model('PaymentDetails', Payment)