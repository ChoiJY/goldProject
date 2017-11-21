var express = require('express');
var router = express.Router();
var query = require('../module/query');

router.get('/:queryType?/:selectedJob', function (req, res, next) {
    var queryType = req.params.queryType;
    var selectedJob = req.params.selectedJob;
    if(req.session.userInfo != undefined){
        res.locals.userInfo = req.session.userInfo;
    }
    if(queryType == 'company') {
        query.jobList().then(function(jobList){
            query.jobDuty_CompanyList(selectedJob).then(function(companyList){
                res.render('\job/company_job', {"selectedJob": selectedJob, "jobList": jobList, 'results': companyList, 'q': 'Company'});
            });
        });
        //기업
    }else if(queryType == 'abilityU'){
        query.jobList().then(function(jobList){
            query.jobDuty_UnitList(selectedJob).then(function(abilityUList){
                res.render('\job/abilityUnit_job', {"selectedJob": selectedJob, "jobList": jobList, 'results': abilityUList, 'q': 'Ability Unit'});
            });
        });
        //역량 단위
    }/*else if(queryType == 'industry'){
        //같은 산업 분야
    }*/else if(queryType == 'skill'){
        query.jobList().then(function(jobList){
            query.jobDuty_AbilityList(selectedJob).then(function(results){
                var aList = results.abilityList.reduce(function(a, b){
                    if(a.indexOf(b)<0) a.push(b);
                    return a;
                }, []);
                var costList = [];
                //중복 제거
                for(var i = 0; i < aList.length; i++){
                    costList.push(results.costList[aList[i]]);
                }
                res.render('\job/ability_job', {"selectedJob": selectedJob, "jobList": jobList, 'results': aList, 'costList': costList, 'q': 'Ability'});
            });
        });
        //필요 역량
    }else if(queryType == 'subject'){
        query.jobList().then(function(jobList){
            query.jobDuty_LectureList(selectedJob).then(function(results){
                var aList = results.abilityList.reduce(function(a, b){
                    if(a.indexOf(b)<0) a.push(b);
                    return a;
                }, []); //중복 제거
                var lList = results.lectureList.reduce(function(a, b){
                    if(a.indexOf(b)<0) a.push(b);
                    return a;
                }, []); //중복 제거
                var costList = [];
                for(var i = 0; i < lList.length; i++){
                    costList.push(results.costList[lList[i]]);
                }

                if(req.session.userInfo != undefined){
                    query.student_subjectList(req.session.userInfo.userName).then(function(userSubjectList){
                        var usl = [];
                        for(var i = 0; i < userSubjectList.length; i++){
                            usl.push(userSubjectList[i].lecture);
                        }
                        res.render('\job/subject_job', {"selectedJob": selectedJob, "jobList": jobList, 'results': lList, 'aList': aList, 'lectureList': results.lectureList, 'abilityList': results.abilityList, 'costList': costList, 'q': 'Recommend subjects', 'usList': usl});
                    });
                }else{
                    res.render('\job/subject_job', {"selectedJob": selectedJob, "jobList": jobList, 'results': lList, 'aList': aList, 'lectureList': results.lectureList, 'abilityList': results.abilityList, 'costList': costList, 'q': 'Recommend subjects', 'usList': []});
                }

            });
        });
        //권장 과목
    }else next();
});

/* GET home page. */
router.get('/', function(req, res, next) {
    if(req.session.userInfo != undefined){
        res.locals.userInfo = req.session.userInfo;
    }
    query.jobList().then(function(list){
        res.render('\job/job', {"jobList": list, 'results':list, 'q': 'List'});
    });
});

module.exports = router;
