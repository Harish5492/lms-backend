const rewardRequests = require('../models/rewardRequests')
const model = require('../models/usermodel');
const Helper = require('../helper/index');
const axios = require('axios');
const rewardPayment = require('../models/rewardPayment')
const paymentMerchantId = 'PGTESTPAYUAT'

const { paymentHelper } = Helper.module

class RewardToSubAdminController {

    async subAdminRequests(req, res) {
        try {
            const { decodedToken, amount } = req.body;
            const check = await model.findById(decodedToken.id, 'rewardRequested')

            if (!check.rewardRequested) throw { message: "already requested", status: false }

            console.log(decodedToken)
            await rewardRequests.create({ subAdminID: decodedToken.id, subAdminEmail: decodedToken.email, amount: amount });

            await model.findByIdAndUpdate(
                decodedToken.id,
                { $set: { rewardRequested: false } }
            )

            res.json({ message: "Request Sent", status: true })

        } catch (error) {
            res.status(500).send(error);
        }
    }
    async pendingRewardRequests(req, res) {
        try {
            console.log("inside Pending Reward")
            const { decodedToken } = req.body;
            console.log(decodedToken);

            const page = parseInt(req.query.page) || 1;
            const itemsPerPage = parseInt(req.query.itemsPerPage) || 10;
            const skip = (page - 1) * itemsPerPage;

            // Extract the search query from the request
            const searchQuery = req.query.search || '';

            // Create a case-insensitive regular expression for searching
            const searchRegex = new RegExp(searchQuery, 'i');

            const allRequests = await rewardRequests.find({
                // Add the case-insensitive search condition
                $or: [
                    { subAdminEmail: { $regex: searchRegex } },
                    // { requestorID: { $regex: searchRegex } },  // Replace 'fieldName1' with the actual field name you want to search
                    // { amount: { $regex: searchRegex } },  // Replace 'fieldName2' with another field if needed
                    // Add more fields as needed
                ]
            })
                .skip(skip)
                .limit(itemsPerPage)
                .exec();

            console.log("allRequests", allRequests);

            const totalRequests = await rewardRequests.countDocuments({
                // Add the same case-insensitive search condition for counting total documents
                $or: [
                    { subAdminEmail: { $regex: searchRegex } },
                    // { requestorID: { $regex: searchRegex } },
                    // { amount: { $regex: searchRegex } },
                    // Add more fields as needed
                ]
            });

            res.json({ message: "these are all requests", status: true, allRequests, totalRequests });

        } catch (error) {
            res.status(500).send(error);
        }
    }

    async sendAmountToSubAdmin(req, res) {
        try {
            console.log("inside SendRewardToSubAdmin")
            const { totalPrice, _id } = req.body
            const subAdmin = await model.findById({ _id: _id }, 'email')
            console.log("subAdmin",subAdmin.email)
            const que = `totalPrice=${totalPrice}&SubAdminId=${_id}`;

            const merchantTransactionId = paymentHelper.generateTransactionId()
            const data = paymentHelper.getDataReward(merchantTransactionId, totalPrice,que)
            const { checksum, payloadMain } = paymentHelper.hashing(data)
            const options = paymentHelper.getOptions(checksum, payloadMain)

            const paymentDetail = {
                subAdmin: subAdmin.id,
                merchantTransactionId: merchantTransactionId,
                amount: totalPrice,
                subAdminEmail: subAdmin.email,
            }
            console.log(paymentDetail)
            await paymentHelper.rewardPayment(paymentDetail)

            axios.request(options).then(function (response) {
                console.log("inside axios request")
                console.log(response.data.data.instrumentResponse.redirectInfo.url)

                res.send(response.data.data.instrumentResponse.redirectInfo.url)
                // res.send({message:'successful'})
            })
                .catch(function (error) {
                    console.error(error);
                    throw error;
                });
        }
        catch (error) {
            console.error("Error Sending Amount", error)
            res.status(500).send({ message: error.message })

        }
    }
    
  async checkRewardStatus(req, res) {
    const {totalPrice,_id} = req.query
    console.log("query", req.query)
    const merchantTransactionId = req.params['txnId']
    const merchantId = paymentMerchantId
    const { checksum } = paymentHelper.checkHashing(merchantTransactionId)
    console.log(checksum)
    const options = paymentHelper.getCheckOptions(merchantId, merchantTransactionId, checksum)
    console.log(options)
    axios.request(options).then(async (response) => {
      console.log("inside")
      if (response.data.success === true && response.data.code != "PAYMENT_PENDING") {
        console.log(response.data)///
        await paymentHelper.updateRewardStatus(merchantTransactionId, "Success")
        await paymentHelper.updateRequestAmount(totalPrice,_id)
        return res.status(400).send({ success: true, message: "Payment Successfull" });

      } else if (response.data.success === false && response.data.code != "PAYMENT_PENDING") {
        paymentHelper.updateStatus(merchantTransactionId, "Failure")
        return res.status(400).send({ success: false, message: "Payment Failure" });
      }
      else {
        return res.status(400).send({ success: false, message: "Payment Pending" });
      }
    })
      .catch((err) => {
        console.error("rrrrrrrrrrrrrrr", err);
        res.status(500).send({ msg: err.message });
      });

  };

   
}

module.exports = new RewardToSubAdminController()