const { Course, Lesson} = require('../models/courses')

class CourseController {
    /**
   * @function getAllCourses
   * @param  req
   * @param  res
   * @returns users
   **/
    async getAllCourses(req,res){
            console.log("inside getAllCourses")
            try {
                const users = await Course.find();
                res.json(users);
              } catch (error) {
                res.status(500).send(error);
              }
    }

    async getCoursesById(req,res){
      console.log("inside getCoursesById")
      try {
          const users = await Course.find({_id:req.params.id});
          console.log("response : ",users)
          res.json(users);
        } catch (error) {
          res.status(500).send(error);
        }
}

    async getAllLessons(req,res){
        console.log("inside Lessons here")
        try {
            // console.log(req.body)
            // console.log(req.params)
            const users = await Lesson.find({course:req.params.id});
            res.json(users);
          } catch (error) {
            res.status(500).send(error); 
          }
}

    async addCourse(req,res){
        try {console.log("inside addCourse")
        // console.log(req.body)
        const newData =  await Course.create({ ...req.body });
        console.log(newData)
        res.json({_id:newData._id,status:true})
      } 
        catch (error) {
          res.status(500).json({error,status:false}); 
        }
}
async addLesson(req,res){
   try{
     console.log("inside addLesson")
    // console.log("req.body",req.body)
    const newData = new Lesson({ ...req.body });
    // console.log("data",newData)
    newData.save()
    console.log(Date.now())
    const result = await Course.findOneAndUpdate(
        { _id: req.body.course }, // Find the user by ID
        {updatedOn : Date.now()}  ,
        { $push: {lessons : newData._id } } // Add the new lesson to the 'Lessons' array
      );  
    res.json({newData,status:true})
   } 
   catch (error) {  
    res.status(500).json({error,status:false}); 
  } 
} 

async addMultipleLesson(req,res){ 
  console.log("inside add Multiple Lesson")
  // console.log(req.body)
  const {lessons,course} = req.body
  // console.log(lessons,course)
  const newField = course;
  lessons.forEach(obj => { 
    obj.course = newField;
  }); 
  // console.log(lessons)     
  const request  = await Lesson.insertMany(lessons) 
  // console.log("requwst",request)   
  const Lessons = request.map(objwe => objwe._id);
// console.log(Lessons)
  const result = await Course.findByIdAndUpdate(
      { _id: course }, // Find the user by ID
      { $push: {lessons : Lessons  } }, // Add the new email to the 'emails' array
    );
     const Result = await Course.findByIdAndUpdate(
      { _id: course }, // Find the user by ID
       // Add the new email to the 'emails' array
      {updatedOn : Date.now()} 
    );
    // console.log("result",result)
  res.json({message: 'succesful'})
} 

async updateLesson(req,res){
  try {
    // console.log(req.body)
    const obj = req.body;
    console.log("obj",obj)
    // const obj1 = {...obj,title:"qweeeeerttttttttygvvvvvvvvvv",another:"antohr"}
// console.log(obj1)
    // const obj = {}  
    // if (title) obj.title = title
    // if (content) obj.content = content 
    // if (videoUrl) obj.videoUrl = videoUrl
    await Lesson.findByIdAndUpdate( req.params.id, obj,{updatedOn : Date.now()} );
    res.json({ message: "updated successfully" });
  } catch (error) {
    res.status(500).send(error);
  }
}

async deletemul(req,res){
// Use deleteMany to remove documents that match the criteria
const x = await Lesson.deleteMany({title:req.params.title})
console.log("deleted")
res.json({message:"deleted ", x})
} 

async deleteCourse(req,res){
  try{
    console.log("inside delete a course")
    // console.log(req.params.id)
   const a = await Course.findByIdAndDelete({_id:req.params.id})
   console.log(a,"a")
   const del = await Lesson.deleteMany({course:req.params.id}
    )
   console.log(del)
    res.send({status:true})
  }
  catch(error){
    res.status(500).send(error)
  }
}

  async deleteLesson(req,res){
  try{
    console.log("inside delete a lesson")
    await Lesson.findByIdAndDelete(req.params.id) 
    await Course.findByIdAndUpdate(
      { _id: data.course }, // Find the course by ID
      { $pull: {lessons : data._id  } },
      {updatedOn : Date.now()} )
    res.json({status:true,message:"delete successfully"})
  }
  catch(error){
    res.status(500).send(error)
  }
}

}
module.exports = new CourseController();