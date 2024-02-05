const mongoose = require('mongoose');

const affiliateDetailsSchema = new mongoose.Schema({
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    affiliateToken: { type: String },
    rewards: { type: Number, default: 0 },
    created_on: { type: Date, default: Date.now }
});

const AffiliateDetails = mongoose.model('AffiliateDetails', affiliateDetailsSchema);

const affiliateSchema = new mongoose.Schema({
    courseDetails: [{ type: mongoose.Schema.Types.ObjectId, ref: 'AffiliateDetails' }],
    affiliator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    totalRewards: { type: Number, default: 0 },
    created_on: { type: Date, default: Date.now }
    
});

// affiliateSchema.virtual('totalRewards').get(function () {
//     return this.courseDetails.reduce((total, detail) => total + detail.rewards, 0);
// });

const AffiliateMarketings = mongoose.model('AffiliateMarketings', affiliateSchema);

module.exports = { AffiliateMarketings, AffiliateDetails };
