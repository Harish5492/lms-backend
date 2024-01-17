const affiliateMarketing = require('../models/affiliatemodel')
const affiliateRequest = require('../models/affiliateRequestmodel')
const { Course } = require('../models/coursemodel');
const validStatus = ['Success', 'Failure', 'Pending'];
const CryptoJS = require("crypto-js");
const Helper = require('../helper/index');
const { referalAndAffiliate } = Helper.module


require('dotenv').config();

const key = process.env.AFFILIATETOKENKEY
class affiliate {

    async affiliationRequestStatus(req, res) {
        try {
            console.log(req.body)
            const { decodedToken } = req.body
            const stat = await affiliateRequest.findOne({ requestorID: decodedToken.id })
                .sort({ requested_on: -1 }) // Sort in descending order based on createdAt (replace with your actual timestamp field)
                .exec()
            console.log(stat,"fffffff")

            if (stat) {
                if (stat.requestStatus === 'Pending') {
                    res.json({ message: "Affiliation Request is Pending", status: true })
                }
                else if (stat.requestStatus === 'Success') {
                    // const trmp = {  user: decodedToken.id, key }

                    // const Role = decodedToken.role


                    // let token = CryptoJS.AES.encrypt(JSON.stringify(trmp),key, decodedToken.id).toString();

                    res.json({ message: "Affiliation Request is Accepted ", status: true })
                }
                else {
                    res.json({ message: "Affiliation Request is Rejected ", status: true })
                }

            }

            else res.json({ message: "Please send request First ", status: false })
            // const uniqueLink = `http://localhost:3000/courses/${Data.id}/user/${decodedToken.id}`;
            // await affiliateMarketing.create({ courseId: Data._id, affiliateLink: uniqueLink, affiliator: decodedToken.id, })
            // let CryDtoken = CryptoJS.AES.decrypt(Data.id, decodedToken.id);
            // let CryDtoken = CryptoJS.AES.decrypt(token, Data.id);
            // let check = (CryDtoken.toString(CryptoJS.enc.Utf8));
            // let decryptedData = JSON.parse(check)

            // console.log("final is here", decryptedData)
            // res.json({ Data, status: true, token });
        } catch (error) {
            res.status(500).send(error);
        }
    }

    async affiliationRequest(req, res) {
        try {
            const { decodedToken } = req.body;
            console.log(decodedToken)
            await affiliateRequest.create({ requestorID: decodedToken.id, requestorEmail: decodedToken.email });

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
        
            const allRequests = await affiliateRequest.find({
                // Add the case-insensitive search condition
                $or: [
                    { requestorEmail: { $regex: searchRegex } },
                    // { requestorID: { $regex: searchRegex } },  // Replace 'fieldName1' with the actual field name you want to search
                    { requestStatus: { $regex: searchRegex } },  // Replace 'fieldName2' with another field if needed
                    // Add more fields as needed
                ]
            })
            .skip(skip)
            .limit(itemsPerPage)
            .exec();
        
            console.log("allRequests", allRequests);
        
            const totalRequests = await affiliateRequest.countDocuments({
                // Add the same case-insensitive search condition for counting total documents
                $or: [
                    { requestorEmail: { $regex: searchRegex } },
                    // { requestorID: { $regex: searchRegex } },
                    { requestStatus: { $regex: searchRegex } },
                    // Add more fields as needed
                ]
            });
        
            res.json({ message: "these are all requests", status: true, allRequests, totalRequests });
        
        } catch (error) {
            res.status(500).send(error);
        }
    }


    async affiliationRequestAction(req, res) {
        try {
            console.log("inside req action", req.body)
            const { decodedToken } = req.body;
            const { id } = req.params;
            const { status, remarks } = req.body;
            console.log("role is ", decodedToken.role)
            const check = await affiliateRequest.findById(id)
            console.log("Check", check)
            if (check.requestStatus !== 'Pending') throw { message: "Unauthorized task" }

            await referalAndAffiliate.reqAction(id, status, remarks,decodedToken)
            res.json({ message: "Updated", status: true })

        } catch (error) {
            res.status(500).send(error);
        }
    }

}




module.exports = new affiliate();