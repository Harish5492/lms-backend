const rewardRequests = require('../models/rewardRequests')
const model = require('../models/usermodel');
const Helper = require('../helper/index');
const { paymentHelper } = Helper.module

class Reward{

    async SubAdminRequests(req, res) {
        try {
            const { decodedToken } = req.body;
            const check = await model.findById(decodedToken.id, 'rewardRequested')

            if (!check.rewardRequested) throw { message: "already requested", status: false }

            console.log(decodedToken)
            await rewardRequests.create({ subAdmin: decodedToken.id, subAdminEmail: decodedToken.email });

            await model.findByIdAndUpdate(
                decodedToken.id,
                { $set: { rewardRequested: false } }
            )

            res.json({ message: "Request Sent", status: true })

        } catch (error) {
            res.status(500).send(error);
        }
    }
    async pendingRequests(req, res) {
        try {
            const { decodedToken } = req.body;
            console.log(decodedToken);

            const page = parseInt(req.query.page) || 1;
            const itemsPerPage = parseInt(req.query.itemsPerPage) || 10;
            const skip = (page - 1) * itemsPerPage;

            // Extract the search query from the request
            const searchQuery = req.query.search || '';

            // Create a case-insensitive regular expression for searching
            const searchRegex = new RegExp(searchQuery, 'i');

            const allRequests = await rewardModel.find({
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

            const totalRequests = await rewardModel.countDocuments({
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
    
    async sendAmountToSubAdmin(req,res){
        try{
            const {decodedToken,totalPrice} = req.body
            const merchantTransactionId = paymentHelper.generateTransactionId()
            const data = paymentHelper.getData(merchantTransactionId, totalPrice)
      const { checksum, payloadMain } = paymentHelper.hashing(data)
      const options = paymentHelper.getOptions(checksum, payloadMain)

      const paymentDetail = {
        user: student,
        merchantTransactionId: merchantTransactionId,
        amount: totalPrice,
        email: decodedToken.email,
      }
      console.log(paymentDetail)
      await paymentHelper.addPayment(paymentDetail)

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
        catch(error){
            console.error("Error Sending Amount",error)
            res.status(500).send({message: error.message})

        }
    }



}

module.export = new Reward()