var mongoose = require('mongoose');
var users = require('../module/userSchema');

var dbUri = 'mongodb://root:0000@ds243295.mlab.com:43295/golduser';


// db 내 student 정보
exports.studentInfo = function (id) {
    return new Promise(function (res) {
        mongoose.connect(dbUri);
        var userModel = mongoose.model('students', users.schema);

        userModel.find({'studentID': id},function (err, results) {
            if(err){
                console.log(err);
            }
            if(results.length > 0){
                console.log('export student info 사용자 찾음' );
                // res(results);
                res({stuNum: results[0].studentID, stuGrade: results[0].grade, stuMajor: results[0].major, userName: results[0].name});
            } else {
                console.log('mongoQuery 일치하는 사용자가 없음');
            }
        });
    });
};

exports.subjectLists = function (id) {
    return new Promise(function (res) {
        mongoose.connect(dbUri);
        var userModel = mongoose.model('students', users.schema);

        userModel.find({'studentID': id}, function (err, results) {
            if(err) console.log(err);
            if(results.length>0){
                res({listened: results[0].listened});
            }
        })
    })
};