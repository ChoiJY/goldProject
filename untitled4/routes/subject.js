/**
 * Created by kmj on 2016-11-10.
 */
/* 강의 관련 페이지 렌더링
오른쪽 화면을 위한 강의 리스트, 결과값이 항상 들어가야 함(subjectList, results)
왼쪽 cytoscape 화면을 위한 리스트를 추가해서 렌더링
질문 종류, 선택 과목을 각각 queryType, subjectClass라는 querystring으로 받게 됨
 */

var express = require('express');
var router = express.Router();
var query = require('../module/query.js');
var mongoQuery = require('../module/mongoQuery');


router.get('/:queryType?/:selectedSubject', function (req, res, next) {
    var queryType = req.params.queryType;
    var subjectClass = req.params.selectedSubject;
    if (req.session.userInfo != undefined) {
        res.locals.userInfo = req.session.userInfo;
    }
    if (queryType == 'preSubject') {
        query.subjectList().then(function (subjectList) {
            query.preSubjectList(subjectClass).then(function (preList) {
                query.postSubjectList(subjectClass).then(function (postList) {
                    query.infoSubjectList(subjectClass).then(function (description) {
                        if (req.session.userInfo != undefined) {
                            query.student_subjectList(req.session.userInfo.userName).then(function (userSubjectList) {
                                var usl = [];
                                for (var i = 0; i < userSubjectList.length; i++) {
                                    usl.push(userSubjectList[i].lecture);
                                }
                                res.render('\subject/preSubject', {
                                    'selectedSubject': subjectClass,
                                    'subjectList': subjectList,
                                    'results': preList,
                                    'postList': postList,
                                    'q': 'Prior Subject',
                                    'd': JSON.stringify(description),
                                    'usList': usl
                                });
                            })
                        } else {
                            res.render('\subject/preSubject', {
                                'selectedSubject': subjectClass,
                                'subjectList': subjectList,
                                'results': preList,
                                'postList': postList,
                                'q': 'Prior Subject',
                                'd': JSON.stringify(description),
                                'usList': []
                            });
                        }
                    });
                });
            });
        });
        //선수 과목
    } else if (queryType == 'postSubject') {
        query.subjectList().then(function (subjectList) {
            query.preSubjectList(subjectClass).then(function (preList) {
                query.postSubjectList(subjectClass).then(function (postList) {
                    query.infoSubjectList(subjectClass).then(function (description) {
                        console.log(postList);
                        if (req.session.userInfo != undefined) {
                            query.student_subjectList(req.session.userInfo.userName).then(function (userSubjectList) {
                                var usl = [];
                                for (var i = 0; i < userSubjectList.length; i++) {
                                    usl.push(userSubjectList[i].lecture);
                                }
                                res.render('\subject/postSubject', {
                                    'selectedSubject': subjectClass,
                                    'subjectList': subjectList,
                                    'results': postList,
                                    'preList': preList,
                                    'q': 'Following Subject',
                                    'd': JSON.stringify(description),
                                    'usList': usl
                                });
                            })
                        } else {
                            res.render('\subject/postSubject', {
                                'selectedSubject': subjectClass,
                                'subjectList': subjectList,
                                'results': postList,
                                'preList': preList,
                                'q': 'Following Subject',
                                'd': JSON.stringify(description),
                                'usList': []
                            });
                        }
                    });
                });
            });
        });
        //후수 과목
    }/*else if(queryType == 'category'){
     //same category
    }*/ else if (queryType == 'skill') {
        query.subjectList().then(function (subjectList) {
            query.lecture_AbilityList(subjectClass).then(function (skillList) {
                res.render('\subject/skillFromSubject', {
                    'selectedSubject': subjectClass,
                    'subjectList': subjectList,
                    'results': skillList,
                    'q': 'Ability'
                });
            });
        });
        //얻을 수 있는 역량
    } else if (queryType == 'sameSkillSubject') {
        query.subjectList().then(function (subjectList) {
            query.lecture_LectureList(subjectClass).then(function (results) {
                var aList = results.ability.reduce(function (a, b) {
                    if (a.indexOf(b) < 0) a.push(b);
                    return a;
                }, []); //중복 제거
                var lList = results.lecture.reduce(function (a, b) {
                    if (a.indexOf(b) < 0) a.push(b);
                    return a;
                }, []); //중복 제거
                var costList = [];
                for (var i = 0; i < lList.length; i++) {
                    costList.push(results.cost[lList[i]]);
                }
                if (req.session.userInfo != undefined) {
                    query.student_subjectList(req.session.userInfo.userName).then(function (userSubjectList) {
                        var usl = [];
                        for (var i = 0; i < userSubjectList.length; i++) {
                            usl.push(userSubjectList[i].lecture);
                        }
                        res.render('\subject/sameSkillSubject', {
                            'selectedSubject': subjectClass,
                            'subjectList': subjectList,
                            'results': lList,
                            'aList': aList,
                            'abilityList': results.ability,
                            'lectureList': results.lecture,
                            'costList': costList,
                            'q': 'Subjects Can Gain Same Ability',
                            'usList': usl
                        });
                    })
                } else {
                    res.render('\subject/sameSkillSubject', {
                        'selectedSubject': subjectClass,
                        'subjectList': subjectList,
                        'results': lList,
                        'aList': aList,
                        'abilityList': results.ability,
                        'lectureList': results.lecture,
                        'costList': costList,
                        'q': 'Subjects Can Gain Same Ability',
                        'usList': []
                    });
                }
            });
        });
        //같은 역량을 얻을 수 있는 과목
    } else if (queryType == 'job') {
        query.subjectList().then(function (subjectList) {
            query.lecture_JobDutyList(subjectClass).then(function (results) {
                var costList = [];
                var jList = results.jobList.reduce(function (a, b) {
                    if (a.indexOf(b) < 0) {
                        a.push(b);
                        costList.push(results.costList[b]);
                    }
                    return a;
                }, []); //중복 제거
                var aList = results.abilityList.reduce(function (a, b) {
                    if (a.indexOf(b) < 0) a.push(b);
                    return a;
                }, []); //중복 제거
                res.render('\subject/jobWithSubject', {
                    'selectedSubject': subjectClass,
                    'subjectList': subjectList,
                    'results': jList,
                    'aList': aList,
                    'abilityList': results.abilityList,
                    'jobList': results.jobList,
                    'q': 'Job Duty',
                    'costList': costList
                });
            });
        });
        //직무
    }
    else next();
});

router.get('/', function (req, res, next) {

    query.subjectList().then(function (list) {
        query.postSubjectList2(list).then(function (postList) {
            console.log(postList);
            if (req.session.userInfo != undefined) {
                mongoQuery.subjectLists(req.session.userInfo.userID).then(function (listenedSubjects) {
                    res.locals.userInfo = req.session.userInfo;
                    res.render('\subject/subject', {
                        "subjectList": list,
                        'results': list,
                        'q': 'List',
                        // 'usList': usl
                        'usList': listenedSubjects.listened,
                        'postLists': JSON.stringify(postList)
                    });
                });
            } else {
                res.render('\subject/subject', {
                    "subjectList": list,
                    'results': list,
                    'q': 'List',
                    'usList': [],
                    'postLists': JSON.stringify(postList)
                });
            }
        });
    });
});

// router.get('/', function (req, res, next) {
//     query.subjectList().then(function (list) {
//         mongoQuery.subjectLists(req.session.userInfo.userID).then(function (listenedSubjects) {
//             if (req.session.userInfo != undefined) {
//                 query.postSubjectList(listenedSubjects).then(function () {
//
//                 })
//                 res.locals.userInfo = req.session.userInfo;
//                 res.render('\subject/subject', {
//                     "subjectList": list,
//                     'results': list,
//                     'q': 'List',
//                     // 'usList': usl
//                     'usList': listenedSubjects,
//                     'postList': postList
//                 });
//             } else {
//                 res.render('\subject/subject', {
//                     "subjectList": list,
//                     'results': list,
//                     'q': 'List',
//                     'usList': [],
//                     'postList': postList
//                 });
//             }
//         });
//     });
// });

module.exports = router;