const referalCode = require('../models/referralmodel')
const Helper = require('../helper/index');
const { referalAndAffiliate } = Helper.module
class referal {
    async referalCode(req, res) {
        try {
            console.log("inside referalCode")
            const { decodedToken } = req.body;
            const referrelOwner = decodedToken.id;
            const referrelCode = referalAndAffiliate.generateAlphanumericCode();
            await referalCode.create({ referrelOwner, referrelCode });
            res.json({ message: "Code generated Successfully", status: true, referrelCode });
        } catch (error) {
            console.error(error);
            res.status(500).send(error.message || "Internal Server Error");
        }
    }

    async applyReferalCode(req, res) {
        try {
            console.log("inside applyReferrelCode", req.body)
            const { decodedToken, code } = req.body;
            referalAndAffiliate.errorCheckCode(code)
            const findCode = await referalCode.findOne({ referrelCode: code })
            referalAndAffiliate.errorCheckValidCode(findCode)
            const referrelUser = decodedToken.id;
            const count = findCode.referrelUserCount + 1
            // console.log(count)
            await referalCode.findOneAndUpdate(
                { referrelCode: code },
                {
                    referrelUser: referrelUser,
                    referrelUserCount: count
                }
            );
            res.json({ message: "Code applied Successfully", status: true });
        } catch (error) {
            console.error(error);
            res.status(500).send(error.message || "Internal Server Error");
        }
    }
}

module.exports = new referal();