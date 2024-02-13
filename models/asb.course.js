const mongoose = require('mongoose')

const validRoles = ['admin','subAdmin', 'user'];

const asbCourse = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    // instructor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    instructor: { type: String, required: true },
    imageUrl: { type: String },
    // lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
    requirements: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: String, required: true },
    language: { type: String, required: true },
    subject: { type: String, required: true },
    level: { type: String, required: true },
    updatedOn: { type: Date },
    // studentsEnrolled: [{ type: mongoose.Schema.Types.ObjectId, unique: true, ref: 'User' }],
  });

module.exports = mongoose.model('asbCourse', asbCourse)  