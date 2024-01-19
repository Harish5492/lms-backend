const mongoose = require('mongoose')
// const User = require('./user.model')
// Course Schema
const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  // instructor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  instructor: { type: String, required: true },
  imageUrl: { type: String },
  lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
  requirements: { type: String, required: true },
  price: { type: Number, required: true },
  duration: { type: String, required: true },
  language: { type: String, required: true },
  subject: { type: String, required: true },
  level: { type: String, required: true },
  updatedOn: { type: Date },
  studentsEnrolled: [{ type: mongoose.Schema.Types.ObjectId, unique: true, ref: 'User' }],
});

const Course = mongoose.model('Course', courseSchema);

// Lesson Schema
const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  videoUrl: { type: String },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
});

const Lesson = mongoose.model('Lesson', lessonSchema);

module.exports = { Course, Lesson }; 