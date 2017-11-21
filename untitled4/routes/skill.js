var express = require('express');
var router = express.Router();
var query = require('../module/query');

router.get('/:queryType?/:selectedSkill', function (req, res, next) {
    var queryType = req.params.queryType;
    var selectedSkill = req.params.selectedSkill;
    if(req.session.userInfo != undefined){
        res.locals.userInfo = req.session.userInfo;
    }
    if(queryType == 'subject') {
        query.skillList().then(function(skillList){
            query.ability_LectureList(selectedSkill).then(function (subjectList) {
                if(req.session.userInfo != undefined){
                    query.student_subjectList(req.session.userInfo.userName).then(function(userSubjectList){
                        var usl = [];
                        for(var i = 0; i < userSubjectList.length; i++){
                            usl.push(userSubjectList[i].lecture);
                        }
                        res.render('\skill/subjectWithSkill', {"selectedSkill": selectedSkill,"skillList": skillList, 'results': subjectList, 'q': 'Subject', 'usList': usl});
                    });
                }else{
                    res.render('\skill/subjectWithSkill', {"selectedSkill": selectedSkill,"skillList": skillList, 'results': subjectList, 'q': 'Subject', 'usList': []});
                }
            });
        });
        //과목
    }else if(queryType == 'job'){
        query.skillList().then(function(skillList){
            query.ability_JobDutyList(selectedSkill).then(function (results) {
                var costList = [];
                var jList = results.jobList.reduce(function(a, b){
                    if(a.indexOf(b)<0) {
                        a.push(b);
                        costList.push(results.costList[b]);
                    }
                    return a;
                }, []); //중복 제거
                res.render('\skill/jobWithSkill', {"selectedSkill": selectedSkill,"skillList": skillList, 'results': jList, 'costList': costList, 'q': 'Job Duty'});
            });
        });
        //직무
    }else next();
});

/* GET home page. */
router.get('/', function(req, res, next) {
    query.skillList().then(function(list){
        if(req.session.userInfo != undefined){
            query.student_abilityLIst(req.session.userInfo.userName).then(function(l){
                var usl = [];
                for(var i = 0; i < l.length; i++){
                    var cost = 0;
                    if(l[i].major == 'false')
                        cost = l[i].cost / 2;
                    else cost = l[i].cost;
                    if(cost > 3)
                        usl.push(l[i].skill);
                }//cost로 나의 역량 cut --> cut 하는 기준에 대한 정의 필요
                res.locals.userInfo = req.session.userInfo;
                res.render('\skill/skill', {"skillList": list, 'results':list, 'q': 'List', 'usl': usl});
            });
        }else{
            res.render('\skill/skill', {"skillList": list, 'results':list, 'q': 'List', 'usl': []});
        }
    });
});

module.exports = router;