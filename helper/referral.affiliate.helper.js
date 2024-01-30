const affiliateRequest = require('../models/affiliateRequestmodel')
const referalmodel = require('../models/referralmodel')
const model = require('../models/usermodel');
const sgMail = require('@sendgrid/mail');
require('dotenv').config();

class referalAndAffiliate {

    generateAlphanumericCode() {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let code = '';

        for (let i = 0; i < 6; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            code += characters.charAt(randomIndex);
        }

        return code;
    }


    errorCheckCode(code) {
        if (!code) throw { message: "No Code Given", status: false }
    }

    errorCheckValidCode(findCode) {
        console.log("findCode", findCode)
        if (!findCode) throw { message: "Invalid Code", status: false }
        if (findCode.expiresAt < new Date) throw { message: "Code Expired", status: false }
    }
 
    async checkWhoCreatedCode(decodedToken,code) {
        console.log("inside checkWhoCreatedCode")
        console.log("id",decodedToken.id)

        const check = await referalmodel.findOne({ referrelOwner : decodedToken.id})

        if(!check) return
        if(check.referrelCode === code) throw {message:"You Can Not Use Your Own Refferal Code",status :false}

    }  
    async sendEmailToSubAdmin() {
        try {
            sgMail.setApiKey(process.env.SENDGRID_API_KEY);
            console.log("inside email to subadmin");
            const msg = {
                to: 'harishrana5492@gmail.com',
                from: 'rana5492@gmail.com',
                subject: 'Congratulations You are now SubAdmin',
                text: 'Your OTP',
                html: `<strong>Congratulations You are now SubAdmin. Please login on the Dashboard using the same credentials</strong>`,
            };
            await sgMail.send(msg);
            console.log("email sent", msg);
        } catch (error) {
            console.error("Error sending email:", error);
           
        }
    }
    
    async reqAction(id, status, remarks, decodedToken) {
        if (status === 'Success') {
            const updation = await affiliateRequest.findByIdAndUpdate(
                id,
                {
                    $set: { requestStatus: status }
                },
                { new: true, runValidators: true }
            );
    
            if (decodedToken.role === 'admin') {
                const roleChange = await model.findByIdAndUpdate(
                    { _id: updation.requestorID },
                    {
                        $set: { role: 'subAdmin' }
                    },
                    { new: true, runValidators: true }
                );
                console.log("is change", roleChange);
            }
    
            await this.sendEmailToSubAdmin();
        }
    
    
        else if (status === 'Failure') {
            if (!remarks) throw "please enter remarks"
            await affiliateRequest.findByIdAndUpdate(
                id,
                {
                    $set: { requestStatus: status, remarks: remarks }
                },
                { new: true, runValidators: true }
            );
        }
        else throw { message: "Please Enter valid status", status: false }
    }

}

module.exports = new referalAndAffiliate()