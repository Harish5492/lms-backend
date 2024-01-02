const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userModel = require('./model')

const courseMaterialSchema = new Schema({
  video: { type: Boolean, required: true }, // e.g., 'video', 'pdf', etc.
  booklet: { type: Boolean, required: true }, // URL or path to the material
  // Add other properties specific to each material type
});
// Course Schema
const courseSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category :{ type: String, required: true },
  level :{ type: String, required: true },
  language :{ type: String, required: true },
  // instructor: { type: String, required: true },
  subject: { type: String, required: true },
  imageUrl : {type : String}, 
  price : { type: String, required: true },
  duration : { type: String, required: true },
  // instructor: { type: Schema.Types.ObjectId, ref: userModel.userType, required: true },
  lessons: [{ type: Schema.Types.ObjectId, ref: 'Lesson' }],
  studentsEnrolled: [{ type: Schema.Types.ObjectId, ref: userModel }],
  updatedOn :{type : Date},
materials: [courseMaterialSchema], // Array of materials with different types
});


const Course = mongoose.model('Course', courseSchema);

// Lesson Schema
const lessonSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  videoUrl: { type: String },
  course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  updatedOn :{type : Date},
});

const Lesson = mongoose.model('Lesson', lessonSchema);


module.exports = { Course, Lesson };