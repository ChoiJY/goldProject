var express = require('express');
var router = express.Router();
var session = require('express-session');
var query = require('../module/query');
var fs = require('fs');

var mongoQuery = require('../module/mongoQuery');

router.get('/:menu?', function (req, res, next) {
    if (req.session.userInfo == undefined)
        res.redirect('/member/login');
    res.locals.userInfo = req.session.userInfo;
    var menu = req.params.menu;
    if (menu == 'info') {
        mongoQuery.studentInfo(req.session.userInfo.userID).then(function (result) {
            console.log('userINFIFIFIFI mypage.js 17 ' + result.stuNum);
            console.log('userINFIFIFIFI mypage.js 17 ' + result.userName);
            res.render('\member/info', {
                'imageSrc': '../images/' + result.userName,
                'userName': result.userName,
                'studentNum': result.stuNum,
                'major': result.stuMajor,
                'grade': result.stuGrade
            });
        })
        // var result = mongoQuery.studentInfo(req.session.userInfo);
        // console.log('result isisisisis: '+result);
        // res.render('\member/info', {'imageSrc': '../images/', 'userName': result.name, 'studentNum': result.stuNum, 'major': result.stuMajor, 'grade': result.stuGrade});
        // query.studentInfo(req.session.userInfo.userName).then(function(result){
        //     var def = 'new-user-image-default.png';
        //     var curUser = req.session.userInfo.userName + '.png';
        //     var url = '../public/images/';
        //     // console.log(curUser);
        //     // console.log(__dirname+curUser);
        //     // if(fs.readFile(__dirname+curUser,'utf8', function (err, data) {
        //     //     console.log(data);
        //     //         // if(data) url = curUser;
        //     //         // else url = def;
        //     //     }))
        //     res.render('\member/info', {'imageSrc': '../images/'+curUser, 'userName': req.session.userInfo.userName, 'studentNum': result.stuNum, 'major': result.stuMajor, 'grade': result.stuGrade});
        // });
    } else if (menu == 'subject') {

        query.subjectList().then(function (Elist) {
            var majorEssentialList = [];
            var cultureEssentialList = [];

            query.essentialSubjectList(true).then(function (result) {
                majorEssentialList = result.sort();
            });
            query.essentialSubjectList(false).then(function (result) {
                cultureEssentialList = result.sort();
            });

            query.student_subjectList(req.session.userInfo.userName).then(function (result) {
                var subjectList = [];
                var team = [];
                var essential = [];
                //var practice = [];
                var list = [];
                //var recommendGrade = [];
                var majorList = [];
                if (result == undefined || result == null) {
                    console.log('err');
                } else {
                    list = result.list2;
                }
                for (var i = 0; i < list.length; i++) {
                    subjectList.push(list[i].lecture);
                    team.push(list[i].teamProject);
                    essential.push(list[i].essential);
                    //practice.push(list[i].practice);
                    //recommendGrade.push(list[i].recommendGrade);
                    majorList.push(list[i].major);
                }
                res.render('\member/subject', {
                    'entireList': Elist,
                    'subjects': subjectList,
                    'team': team,
                    'essential': essential,
                    'major': majorList,
                    'majorEssential': majorEssentialList,
                    'culturalEssential': cultureEssentialList,
                    'majorList':result.majorList,
                    'culList':result.culList
                });
            });
        });
    } else if (menu == 'ability') {
        query.student_abilityLIst(req.session.userInfo.userName).then(function (result) {
            var majors = [];
            var major_costList = [];
            var basics = [];
            var basic_costList = [];
            var list = [];
            list = result;
            for (var i = 0; i < list.length; i++) {
                if (list[i].major == 'true') {
                    majors.push(list[i].skill);
                    major_costList.push(list[i].cost);
                } else {
                    basics.push(list[i].skill);
                    basic_costList.push(list[i].cost);
                }
            }
            res.render('\member/ability', {
                majors: majors,
                major_costs: major_costList,
                basics: basics,
                basic_costs: basic_costList
            });
        });
    } else if (menu == 'recommend') {
        var jobs = [];
        //모든 과목을 들었을 때 나오는 cost
        var totalCosts = [{job: 'ApplicationSW_Engineering', cost: 7000},
            {job: 'NW_Engineering', cost: 3000},
            {job: 'Security_Engineering', cost: 2000},
            {job: 'SystemSW_Engineering', cost: 1150}];
        var costList = [];
        query.student_jobList(req.session.userInfo.userName).then(function (result) {
            var list = result;
            for (var i = 0; i < result.length; i++) {
                for (var j = 0; j < totalCosts.length; j++) {
                    if (list[i].job == totalCosts[j].job)
                        list[i].cost = list[i].cost / totalCosts[j].cost * 100;
                }
            } //job의 total cost 대비 자신의 cost를 계산 --> job이 많아졌을 때 대비 수정 필요
            list.sort(function (a, b) {
                return a.cost - b.cost;
            });
            list.reverse();
            for (var k = 0; k < list.length; k++) {
                jobs.push(list[k].job);
                costList.push(list[k].cost);
            }
            res.render('\member/recommend', {jobs: jobs, costs: costList});
        });
    } else next();
});

router.get('/', function (req, res, next) {
    res.redirect('/mypage/info');
});

module.exports = router;