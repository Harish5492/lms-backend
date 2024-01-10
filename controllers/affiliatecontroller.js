const affiliateMarketing = require('../models/affiliatemodel')
const { Course } = require('../models/coursemodel');

class affiliate {

    async affiliateLink(req, res) {
        try {
            const { id } = req.params;
            const { decodedToken } = req.body;
            const Data = await Course.findOne({ _id: id }, '_id title instructor');
            const uniqueLink = `http://localhost:3000/courses/${Data.id}/user/${decodedToken.id}`;
            await affiliateMarketing.create({ courseId: Data._id, affiliateLink: uniqueLink, affiliator: decodedToken.id, })

            res.json({ Data, status: true, uniqueLink });
        } catch (error) {
            res.status(500).send(error);
        }
    }

}




module.exports = new affiliate();