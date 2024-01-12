const affiliateMarketing = require('../models/affiliatemodel')
const affiliateRequest = require('../models/affiliateRequestmodel')
const { Course } = require('../models/coursemodel');
const CryptoJS = require("crypto-js");
const Helper = require('../helper/index');
const { referalAndAffiliate } = Helper.module


require('dotenv').config();

const key = process.env.AFFILIATETOKENKEY
class affiliate {

    async affiliationRequestStatus(req, res) {
        try {
            console.log(req.body)
            const { id } = req.params;
            const { decodedToken } = req.body;

            const stat = await affiliateRequest.findOne({ requestorID: decodedToken.id })
            .sort({ requested_on: -1 }) // Sort in descending order based on createdAt (replace with your actual timestamp field)
            .exec()
            console.log(stat)

            if (stat) {
                if(stat.requestStatus==='Pending'){
                    res.json({ message: "Affiliation Request is Pending", status: true })
                }
                else if(stat.requestStatus==='Success'){
                    const trmp = {  user: decodedToken.id, key }
                    let token = CryptoJS.AES.encrypt(JSON.stringify(trmp),key, decodedToken.id).toString();
                  
                    res.json({ message: "Affiliation Request is Accepted ", status: true,token })
                } 
                else {
                    res.json({ message: "Affiliation Request is Rejected ",remarks: stat.remarks, status: true })
                }

            }  
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
            console.log(decodedToken)
            const allRequests = await affiliateRequest.find({ requestStatus: "Pending" }, '_id requestorEmail requested_on');
            console.log("allRequests", allRequests)
            res.json({ message: "these are all pending requests", status: true, allRequests })

        } catch (error) {
            res.status(500).send(error);
        }
    }


    async affiliationRequestAction(req, res) {
        try {
            // const { decodedToken } = req.body;
            const { id } = req.params;
            const { status, remarks } = req.body;
            const check = await affiliateRequest.findById(id)

            if(check.requestStatus!=='Pending') throw {message:"Unauthorized task"}
            
            await referalAndAffiliate.reqAction(id, status, remarks)
            res.json({ message: "Updated", status: true })

        } catch (error) {
            res.status(500).send(error);
        }
    }

}




module.exports = new affiliate();