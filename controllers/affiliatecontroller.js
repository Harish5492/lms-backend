const affiliateMarketing = require('../models/affiliatemodel')
const { Course } = require('../models/coursemodel');

class affiliate { 

        async affiliateLink(req, res) {
            try {
              const { id } = req.params;
              const {decodedToken} = req.body;
              const Work = await Course.findOne({_id: id }, '_id title instructor');
            //   console.log("decodedToken",decodedToken);
              const CourseId = Work._id
              console.log("cid",CourseId)
              const UserId = decodedToken.id
              console.log("uId",UserId)
              const uniqueLink = `http://localhost:3000/courses/${CourseId}/user/${UserId}`;
              console.log("uinque",uniqueLink)
              await affiliateMarketing.create({courseId: Work._id, affiliator: decodedToken.id, })
            //   console.log(Work);
              res.json({ Work, status: true,uniqueLink });
            } catch (error) {
              res.status(500).send(error);
            }
          }
          
    } 
  



module.exports = new affiliate();