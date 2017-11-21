// mongodb schema
var mongoose = require('mongoose');

// user account informations
var schema = mongoose.Schema({
    name: {type: String, default: ''},
    studentID: {type: Number, required: true, unique: true},
    password: {type: String, required: true},
    grade: {type: Number, default: '0'},
    major: {type: String, default: '?'},
    semester: {type: Number, default: '0'},
    foriegn: {
        toeic: {type: Number, default: '0'},
        opic: {type: String, default: '0'},
        tsp: {type: Number, default: '0'}
    },
    listened: []
});

var Student = mongoose.model('Student', schema);

// collection name is students
module.exports = Student;