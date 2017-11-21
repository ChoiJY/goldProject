var mysql = require('mysql');
var Promise = require('bluebird');
var mongoose = require('mongoose');
var users = require('../module/userSchema');

var dbUri = 'mongodb://root:0000@ds243295.mlab.com:43295/golduser';

var pool = mysql.createPool({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '0000',
    database: 'gold'
});

exports.mongoLogin = function (id, pwd) {
    return new Promise(function (res) {
        mongoose.connect(dbUri);
        var userModel = mongoose.model('students', users.schema);
        userModel.find({'studentID': id, 'password': pwd}, function (err, results) {
            if (err) {
                console.log(err);
            }
            if (results.length > 0) {
                console.log('mongoLogin 사용자 찾음\n');
                console.log('mongoLogin results\n' + results[0]);
                res({userID: results[0].studentID, pwd: results[0].password, userName: results[0].name});
                // res(results[0]);
            } else {
                // console.log(id, pwd)
                // console.log(results);
                console.log('일치하는 사용자가 없음');
            }
        });
    });
};

// demo용
exports.mongoSave = function (id, pwd) {
    mongoose.connect(dbUri);
    var userModel = mongoose.model('students', users.schema);
    var newStudent = new userModel({
        studentID : id,
        password : pwd
    });
    newStudent.save(function (err) {
        if(err) return console.error(err);
    })
};

exports.login = function (id, pwd) {
    return new Promise(function (res) {
        var sql = 'select * from users';
        pool.getConnection(function (err, conn) {
            if (err) {
                console.log(err);
            } else {
                conn.query(sql, function (err, results) {
                    conn.release();
                    if (err) {
                        console.log(err);
                    } else {
                        var list = [];
                        list = results;
                        for (var i = 0; i < list.length; i++) {
                            if (id == list[i].userID && pwd == list[i].password) {
                                res({userID: list[i].userID, userName: list[i].name});
                            }
                        }
                        res({});
                    }
                })
            }
        });
    });
};
