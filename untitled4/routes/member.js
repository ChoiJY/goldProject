var express = require('express');
var router = express.Router();
var db = require('../module/database');
var session = require('express-session');

router.get('/', function(req, res, next) {
    if(req.session.userInfo == undefined)
    res.redirect('/member/login');
    else
        res.redirect('/mypage');
});

router.get('/login', function(req, res, next){
    if(req.session.userInfo == undefined)
        res.render('\member/login', {'err': ''});
    else res.redirect('/mypage');
});

// login
router.post('/login', function(req, res, next){
    var userID = req.body.inputID;
    var pwd = req.body.inputPwd;

    db.mongoLogin(userID, pwd).then(function (result) {
        console.log('member.js 33 :'+result.userID + '  '+ result.pwd);
        console.log('member.js 33 :'+result.studentID + '  '+ result.password);

        if(result.userID == undefined || result.userID == null) {
            res.render('\member/login', {'err': 'login failed'});
        }
        else{
            console.log('member40 : '+result.userID);
            console.log('member40 : '+result.pwd);
            req.session.userInfo = result; //session에는 userID와 pwd 저장됨
            res.redirect('/mypage'); //로그인 후 메인 화면으로 이동
        }
    });
    // db.login(userID, pwd).then(function(result){
    //     //db에서 id, pwd check
    //     if(result.userID == undefined || result.userID == null) {
    //         res.render('\member/login', {'err': 'login failed'}); //login fail
    //         console.log(result);
    //     }
    //     else{
    //         console.log(result);
    //         req.session.userInfo = result; //session에 user information set
    //         res.redirect('/mypage'); //로그인 후 메인 화면으로 이동
    //     }
    // });
});

// join
router.get('/join', function (req, res) {
    res.render('\member/join');
});

router.post('/join', function (req, res) {
    var userID = req.body.inputID;
    var pwd = req.body.inputPwd;
    console.log(userID, pwd);
    db.mongoSave(userID, pwd);
    res.redirect('../');
});

// logout
router.get('/logout', function(req, res, next){
    if(req.session.userInfo == undefined)
        res.redirect('/member/login');
    else{
        req.session.destroy(function(err){
            res.redirect('/');
        }); //로그 아웃 후 메인 화면으로 이동
    }
});

module.exports = router;