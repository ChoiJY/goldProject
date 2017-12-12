/**
 * Created by kmj on 2016-11-07.
 */
var SparqlClient = require('./client');
var Promise = require('bluebird');
var Calc = require('./calcCost');

var serverURI = 'http://localhost:3030';
var etc = '/ds/query';
var endpoint = serverURI + etc;

var prefix = "PREFIX gold: <http://nise3548.pe.hu/GOLD#>"
    + "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>"
    + "PREFIX owl: <http://www.w3.org/2002/07/owl#>"
    + "PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>"
    + "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>";

//쿼리마다 필요한 함수를 부를 수 있도록 하는 모듈
//routes의 script에 query result list를 return


exports.subjectList = function subjectList() {
    return new Promise(function (resolve, reject) {
        var list = [];
        // var endpoint = 'http://localhost:3030/ds/query';
        var query = prefix +
            "SELECT * " +
            "WHERE " +
            "{ ?i rdfs:subClassOf gold:Major_Subject.?individual rdf:type ?i }";
        var client = new SparqlClient(endpoint);
        client.query(query, function (error, results) {
            list = results.results.bindings;
            for (var i = 0; i < list.length; i++) {
                var a = list[i].individual.value;
                var b = a.replace(/http\:\/\/nise3548.pe.hu\/GOLD\#/g, '');
                list[i] = b;
            }//URL 형식 제거
            resolve(list); //return
        });
    });
};

// 필수이수과목 출력 query
// param이 true이면 전공수업만, Cultural이면 교양만
exports.essentialSubjectList = function (type) {
    return new Promise(function (res, rej) {
        var list = [];
        var query = prefix +
            "SELECT ?Lecture " +
            "WHERE " +
            "{ ?Lecture gold:isEssential ?essential." +
            "?Lecture gold:isMajor ?Major." +
            "FILTER(?Major = " + type + " && ?essential=true) }"
        var client = new SparqlClient(endpoint);
        client.query(query, function (error, results) {
            list = results.results.bindings;
            for (var i = 0; i < list.length; i++) {
                var a = list[i].Lecture.value;
                var b = a.replace(/http\:\/\/nise3548.pe.hu\/GOLD\#/g, '');
                list[i] = b;
            }//URL 형식 제거
            res(list); //return
        });
    })
};

exports.jobList = function jobList() {
    return new Promise(function (resolve, reject) {
        var list = [];
        // var endpoint = 'http://localhost:3030/ds/query';
        var query = prefix +
            "SELECT * " +
            "WHERE " +
            "{ ?i rdfs:subClassOf gold:Information_Technology.?individual rdf:type ?i }";
        var client = new SparqlClient(endpoint);
        client.query(query, function (error, results) {
            list = results.results.bindings;
            for (var i = 0; i < list.length; i++) {
                var a = list[i].individual.value;
                var b = a.replace(/http\:\/\/nise3548.pe.hu\/GOLD\#/g, '');
                list[i] = b;
            }//URL 형식 제거
            resolve(list); //return
        });
    });
};
//jobList

exports.companyList = function jobList() {
    return new Promise(function (resolve, reject) {
        var list = [];
        // var endpoint = 'http://localhost:3030/ds/query';
        var query = prefix +
            "SELECT * " +
            "WHERE " +
            "{ ?i rdfs:subClassOf gold:Company.?individual rdf:type ?i }";
        var client = new SparqlClient(endpoint);
        client.query(query, function (error, results) {
            list = results.results.bindings;
            for (var i = 0; i < list.length; i++) {
                var a = list[i].individual.value;
                var b = a.replace(/http\:\/\/nise3548.pe.hu\/GOLD\#/g, '');
                list[i] = b;
            }//URL 형식 제거
            resolve(list); //return
        });
    });
};

//companyList

exports.skillList = function jobList() {
    return new Promise(function (resolve, reject) {
        var list = [];
        // var endpoint = 'http://localhost:3030/ds/query';
        var query = prefix +
            "SELECT * " +
            "WHERE " +
            "{ ?i rdfs:subClassOf gold:Ability.?individual rdf:type ?i }";
        var client = new SparqlClient(endpoint);
        client.query(query, function (error, results) {
            list = results.results.bindings;
            for (var i = 0; i < list.length; i++) {
                var a = list[i].individual.value;
                var b = a.replace(/http\:\/\/nise3548.pe.hu\/GOLD\#/g, '');
                list[i] = b;
            }//URL 형식 제거
            resolve(list); //return
        });
    });
};

//industryFieldList

exports.postSubjectList = function (subjectClass) {

    return new Promise(function (resolve) {
        var list = [];
        // var endpoint = 'http://localhost:3030/ds/query';
        var query = prefix +
            "SELECT * " +
            "WHERE " +
            "{ gold:" + subjectClass + " gold:isPrerequisiteOf ?Lecture.}";
        var client = new SparqlClient(endpoint);
        client.query(query, function (err, results) {
            list = results.results.bindings;
            for (var i = 0; i < list.length; i++) {
                var a = list[i].Lecture.value;
                var b = a.replace(/http\:\/\/nise3548.pe.hu\/GOLD\#/g, '');
                list[i] = b;
            }
            // list.unshift(subjectClass);
            resolve(list);
        });
    });
};//success

exports.postSubjectList2 = function (entireList) {

    return new Promise(function (resolve) {
        var Results = [];
        for (var i = 0; i < entireList.length; i++) {
            console.log(entireList[i]);
            var list = [];
            var query = prefix +
                "SELECT * " +
                "WHERE " +
                "{ gold:" + entireList[i] + " gold:isPrerequisiteOf ?Lecture.}";
            var client = new SparqlClient(endpoint);
            sendTo(entireList[i]);

            // 기존 query가 async이기때문에 loop 내에서 현재 index data access 불가,
            // 이를 해결하기 위해서 callback 내에 param으로 과목 이름을 보내서 access.
            function sendTo(name) {
                client.query(query, function (err, results) {
                    list = results.results.bindings;
                    for (var i = 0; i < list.length; i++) {
                        var a = list[i].Lecture.value;
                        var b = a.replace(/http\:\/\/nise3548.pe.hu\/GOLD\#/g, '');
                        list[i] = b;
                    }
                    list.unshift(name);
                    Results.push(list);
                    if (Results.length == entireList.length) {
                        resolve(Results);
                    }
                });
            }
        }
    });
};//success

//Q1 특정 {분야}에 어떤 {직무}들이?
exports.area_JobDutyList = function area_JobDutyList(subjectClass) {
    return new Promise(function (resolve) {
        var list = [];
        // var endpoint = 'http://localhost:3030/ds/query';
        var query = prefix +
            "SELECT * " +
            "WHERE " +
            "{}";
        var client = new SparqlClient(endpoint);
        client.query(query, function (err, results) {
            list = results.results.bindings;
            /*for(var i = 0; i < list.length; i++){
             var a = list[i].Lecture.value;
             var b = a.replace(/http\:\/\/nise3548.pe.hu\/GOLD\#/g,'');
             list[i] = b;
             }*/
            resolve(list);
        });
    });
};//none

//Q2 특정 {기업}에 어떤 {직무}들이?
exports.company_JobDutyList = function company_JobDutyList(company) {
    return new Promise(function (resolve) {
        var list = [];
        // var endpoint = 'http://localhost:3030/ds/query';
        company = company.replace(/\&/g, "\\\&");
        company = company.replace(/\+/g, "\\\+");
        var query = prefix +
            "SELECT * " +
            "WHERE " +
            "{ gold:" + company + " gold:isRecruit ?job}";
        var client = new SparqlClient(endpoint);
        client.query(query, function (err, results) {
            // console.log(typeof results);
            // console.log(results);
            list = results.results.bindings;
            console.log(list);
            for (var i = 0; i < list.length; i++) {
                var a = list[i].job.value;
                var b = a.replace(/http\:\/\/nise3548.pe.hu\/GOLD\#/g, '');
                list[i] = b;
            }
            console.log(list);
            resolve(list);
        });
    });
};//success

//Q3 특정 {직무}를 할 수 있는 {기업}은?
exports.jobDuty_CompanyList = function jobDuty_CompanyList(job) {
    return new Promise(function (resolve) {
        var list = [];
        // var endpoint = 'http://localhost:3030/ds/query';
        var query = prefix +
            "SELECT * " +
            "WHERE " +
            "{ gold:" + job + " gold:canApplyTo ?company}";
        var client = new SparqlClient(endpoint);
        client.query(query, function (err, results) {
            list = results.results.bindings;
            for (var i = 0; i < list.length; i++) {
                var a = list[i].company.value;
                var b = a.replace(/http\:\/\/nise3548.pe.hu\/GOLD\#/g, '');
                list[i] = b;
            }
            resolve(list);
        });
    });
};//success

//Q4 특정 {과목}을 듣기 위해 필요한 {과목}은?
exports.preSubjectList = function preSubjectList(subjectClass) {
    return new Promise(function (resolve) {
        var list = [];
        // var endpoint = 'http://localhost:3030/ds/query';
        var query = prefix +
            "SELECT * " +
            "WHERE " +
            "{ gold:" + subjectClass + " gold:needSubject ?Lecture.}";
        var client = new SparqlClient(endpoint);
        client.query(query, function (err, results) {
            list = results.results.bindings;
            for (var i = 0; i < list.length; i++) {
                var a = list[i].Lecture.value;
                var b = a.replace(/http\:\/\/nise3548.pe.hu\/GOLD\#/g, '');
                list[i] = b;
            }
            resolve(list);
        });
    });
};//success

//Q5 특정 {과목}의 {이수학기}는? (그 외 관련정보)
exports.infoSubjectList = function infoSubjectList(subjectClass) {
    return new Promise(function (resolve) {
        var list = [];
        var list2 = [];
        // var endpoint = 'http://localhost:3030/ds/query';
        var query = prefix +
            "SELECT * " +
            "WHERE " +
            "{ gold:" + subjectClass + " gold:hasRecommandGrade ?recommandGrade. gold:" + subjectClass + " gold:hasPractice ?practice.gold:" + subjectClass + " gold:hasteamProject ?teamProject.gold:" + subjectClass + " gold:isEssential ?essential.}";

        var client = new SparqlClient(endpoint);
        client.query(query, function (err, results) {
            list = results.results.bindings;
            for (var i = 0; i < list.length; i++) {
                var a = list[i].recommandGrade.value;
                var b = list[i].practice.value;
                var c = list[i].teamProject.value;
                var d = list[i].essential.value;
                list2['recommandGrade'] = a.replace(/http\:\/\/nise3548.pe.hu\/GOLD\#/g, '');
                list2['practice'] = b.replace(/http\:\/\/nise3548.pe.hu\/GOLD\#/g, '');
                list2['teamProject'] = c.replace(/http\:\/\/nise3548.pe.hu\/GOLD\#/g, '');
                list2['essential'] = d.replace(/http\:\/\/nise3548.pe.hu\/GOLD\#/g, '');
            }
            resolve(list2);
        });
    });
};//query error & 처리 필요

//Q6 특정 {능력 단위}에 필요한 {역량}은?
exports.unit_AbilityList = function unit_AbilityList(abilityUnit) {
    return new Promise(function (resolve) {
        var list = [];
        // var endpoint = 'http://localhost:3030/ds/query';
        var query = prefix +
            "SELECT * " +
            "WHERE " +
            "{ gold:" + abilityUnit + " gold:needAbility ?Ability}";
        var client = new SparqlClient(endpoint);
        client.query(query, function (err, results) {
            list = results.results.bindings;
            for (var i = 0; i < list.length; i++) {
                var a = list[i].Ability.value;
                var b = a.replace(/http\:\/\/nise3548.pe.hu\/GOLD\#/g, '');
                list[i] = b;
            }
            resolve(list);
        });
    });
};//success

//Q7 특정 {역량}을 가지고있는 {능력단위}는?
exports.ability_UnitList = function ability_UnitList(ability) {
    return new Promise(function (resolve) {
        var list = [];
        // var endpoint = 'http://localhost:3030/ds/query';
        var query = prefix +
            "SELECT * " +
            "WHERE " +
            "{ gold:" + ability + " gold:contributeTo ?AbilityU}";
        var client = new SparqlClient(endpoint);
        client.query(query, function (err, results) {
            list = results.results.bindings;
            for (var i = 0; i < list.length; i++) {
                var a = list[i].AbilityU.value;
                var b = a.replace(/http\:\/\/nise3548.pe.hu\/GOLD\#/g, '');
                list[i] = b;
            }
            resolve(list);
        });
    });
};//success

//Q8 특정 {직무}를 수행하기 위해 필요한 {능력 단위}는?
exports.jobDuty_UnitList = function jobDuty_UnitList(job) {
    return new Promise(function (resolve) {
        var list = [];
        // var endpoint = 'http://localhost:3030/ds/query';
        var query = prefix +
            "SELECT * " +
            "WHERE " +
            "{ gold:" + job + " gold:needAbilityUnit ?AbilityU }";
        var client = new SparqlClient(endpoint);
        client.query(query, function (err, results) {
            list = results.results.bindings;
            for (var i = 0; i < list.length; i++) {
                var a = list[i].AbilityU.value;
                var b = a.replace(/http\:\/\/nise3548.pe.hu\/GOLD\#/g, '');
                list[i] = b;
            }
            resolve(list);
        });
    });
};//success

//Q9 특정 {능력 단위}가 필요한 {직무}는?
exports.unit_JobDutyList = function unit_JobDutyList(abilityUnit) {
    return new Promise(function (resolve) {
        var list = [];
        // var endpoint = 'http://localhost:3030/ds/query';
        var query = prefix +
            "SELECT * " +
            "WHERE " +
            "{ gold:" + abilityUnit + " gold:needFor ?job }";
        var client = new SparqlClient(endpoint);
        client.query(query, function (err, results) {
            list = results.results.bindings;
            for (var i = 0; i < list.length; i++) {
                var a = list[i].job.value;
                var b = a.replace(/http\:\/\/nise3548.pe.hu\/GOLD\#/g, '');
                list[i] = b;
            }
            resolve(list);
        });
    });
};//not use

//Q10 특정 {과목}에서 기를 수 있는 {역량}은?
exports.lecture_AbilityList = function lecture_AbilityList(subjectClass) {
    return new Promise(function (resolve) {
        var list = [];
        // var endpoint = 'http://localhost:3030/ds/query';
        var query = prefix +
            "SELECT * " +
            "WHERE " +
            "{ gold:" + subjectClass + " gold:canDevelop ?Ability.}";
        var client = new SparqlClient(endpoint);
        client.query(query, function (err, results) {
            list = results.results.bindings;
            for (var i = 0; i < list.length; i++) {
                var a = list[i].Ability.value;
                var b = a.replace(/http\:\/\/nise3548.pe.hu\/GOLD\#/g, '');
                list[i] = b;
            }
            resolve(list);
        });
    });
};//success

//Q11 특정 {역량}을 기를 수 있는 {과목}은?
exports.ability_LectureList = function ability_LectureList(skill) {
    return new Promise(function (resolve) {
        var list = [];
        // var endpoint = 'http://localhost:3030/ds/query';
        var query = prefix +
            "SELECT * " +
            "WHERE " +
            "{ gold:" + skill + " gold:canBeLearnedThrough ?Lecture.}";
        var client = new SparqlClient(endpoint);
        client.query(query, function (err, results) {
            list = results.results.bindings;
            for (var i = 0; i < list.length; i++) {
                var a = list[i].Lecture.value;
                var b = a.replace(/http\:\/\/nise3548.pe.hu\/GOLD\#/g, '');
                list[i] = b;
            }
            resolve(list);
        });
    });
};//success

//Q12 특정 {직무}와 같은 분야에 있는 {직무}는?
exports.jobDuty_jobDutyList = function jobDuty_jobDutyList(subjectClass) {
    return new Promise(function (resolve) {
        var list = [];
        // var endpoint = 'http://localhost:3030/ds/query';
        var query = prefix +
            "SELECT * " +
            "WHERE " +
            "{}";
        var client = new SparqlClient(endpoint);
        client.query(query, function (err, results) {
            list = results.results.bindings;
            /*for(var i = 0; i < list.length; i++){
             var a = list[i].Lecture.value;
             var b = a.replace(/http\:\/\/nise3548.pe.hu\/GOLD\#/g,'');
             list[i] = b;
             }*/
            resolve(list);
        });
    });
};//not use

//Q13 특정 {분류}에 있는 {과목}는?
exports.field_LectureList = function field_LectureList(subjectClass) {
    return new Promise(function (resolve) {
        var list = [];
        // var endpoint = 'http://localhost:3030/ds/query';
        var query = prefix +
            "SELECT * " +
            "WHERE " +
            "{}";
        var client = new SparqlClient(endpoint);
        client.query(query, function (err, results) {
            list = results.results.bindings;
            /*for(var i = 0; i < list.length; i++){
             var a = list[i].Lecture.value;
             var b = a.replace(/http\:\/\/nise3548.pe.hu\/GOLD\#/g,'');
             list[i] = b;
             }*/
            resolve(list);
        });
    });
};//not use

//Q14 특정 {직무}를 수행하기 위해 필요한 {역량}은?
exports.jobDuty_AbilityList = function jobDuty_AbilityList(job) {
    return new Promise(function (resolve) {
        var list = [];
        var list2 = [];
        var list3 = [];
        // var endpoint = 'http://localhost:3030/ds/query';
        var query = prefix +
            "SELECT * " +
            "WHERE " +
            "{ gold:" + job + " gold:needAbilityUnit ?AbilityU.?AbilityU gold:needAbility ?Ability. ?Ability gold:isMajorAbility ?isMA. }";
        var client = new SparqlClient(endpoint);
        client.query(query, function (err, results) {
            list = results.results.bindings;
            for (var i = 0; i < list.length; i++) {
                var a = list[i].Ability.value;
                var c = list[i].AbilityU.value;
                var b = list[i].isMA.value;
                list[i] = a.replace(/http\:\/\/nise3548.pe.hu\/GOLD\#/g, '');
                list2[i] = c.replace(/http\:\/\/nise3548.pe.hu\/GOLD\#/g, '');
                list3[i] = b.replace(/http\:\/\/nise3548.pe.hu\/GOLD\#/g, '');
            }
            Calc.calcCost_job_skillList(list2, list, list3).then(function (results) {
                resolve({abilityList: results.skillList, costList: results.costList});
            });
        });
    });
};//success

//Q15 특정 {역량}이 필요한 {직무}는?
exports.ability_JobDutyList = function ability_JobDutyList(skill) {
    return new Promise(function (resolve) {
        var list = [];
        var list2 = [];
        // var endpoint = 'http://localhost:3030/ds/query';
        var query = prefix +
            "SELECT * " +
            "WHERE " +
            "{ gold:" + skill + " gold:contributeTo ?AbilityU.?AbilityU gold:needFor ?job. ?job gold:numberOfAbilityUnit ?countAbilityU.}";
        var client = new SparqlClient(endpoint);
        client.query(query, function (err, results) {
            list = results.results.bindings;
            for (var i = 0; i < list.length; i++) {
                var a = list[i].job.value;
                var b = list[i].countAbilityU.value;
                list[i] = a.replace(/http\:\/\/nise3548.pe.hu\/GOLD\#/g, '');
                list2[i] = b.replace(/http\:\/\/nise3548.pe.hu\/GOLD\#/g, '');
            }
            Calc.calcCost_skill_jobList(list, list2).then(function (results) {
                resolve({jobList: results.jobList, costList: results.costList});
            });
        });
    });
};//success-같은 직무가 여러 개 나옴 -> 숫자를 세서 처리 필요

//Q16 특정 {과목}과 같은 역량을 기를수 있는 {과목}은?
exports.lecture_LectureList = function lecture_LectureList(subjectClass) {
    return new Promise(function (resolve) {
        var list = [];
        var list2 = [];
        var list3 = [];
        // var endpoint = 'http://localhost:3030/ds/query';
        var query = prefix +
            "SELECT * " +
            "WHERE " +
            "{ gold:" + subjectClass + " gold:canDevelop ?Ability.?Ability gold:canBeLearnedThrough ?Lecture. ?Lecture gold:isMajor ?isMajor.}";
        var client = new SparqlClient(endpoint);
        client.query(query, function (error, results) {
            list = results.results.bindings;
            for (var i = 0; i < list.length; i++) {
                var a = list[i].Ability.value;
                var c = list[i].Lecture.value;
                var d = list[i].isMajor.value;
                var b = a.replace(/http\:\/\/nise3548.pe.hu\/GOLD\#/g, '');
                list2[i] = c.replace(/http\:\/\/nise3548.pe.hu\/GOLD\#/g, '');
                list[i] = b;
                list3[i] = d.replace(/http\:\/\/nise3548.pe.hu\/GOLD\#/g, '');
            }//URL 형식 제거
            Calc.calcCost_subject_subjectList(list, list2, list3).then(function (results) {
                resolve({ability: results.abilityList, lecture: results.subjectList, cost: results.valNumList}); //return
            });
        });
    });
};


//Q17 특정 {직무}를 수행하기 위한 역량을 얻을 수 있는 {과목}은?
exports.jobDuty_LectureList = function jobDuty_LectureList(job) {
    return new Promise(function (resolve) {
        var list = [];
        var list2 = [];
        var list3 = [];
        var list4 = [];
        var list5 = [];
        // var endpoint = 'http://localhost:3030/ds/query';
        var query = prefix +
            "SELECT * " +
            "WHERE " +
            "{ gold:" + job + " gold:needAbilityUnit ?AbilityU.?AbilityU gold:needAbility ?Ability.?Ability gold:canBeLearnedThrough ?Lecture. ?Lecture rdf:type gold:Major_Subject. ?Lecture gold:isMajor ?isMajor. ?Ability gold:isMajorAbility ?isMA.}";
        var client = new SparqlClient(endpoint);
        client.query(query, function (err, results) {
            list = results.results.bindings;
            for (var i = 0; i < list.length; i++) {
                var a = list[i].Lecture.value;
                var c = list[i].Ability.value;
                var d = list[i].AbilityU.value;
                var b = list[i].isMajor.value;
                var e = list[i].isMA.value;
                list[i] = a.replace(/http\:\/\/nise3548.pe.hu\/GOLD\#/g, '');
                list2[i] = c.replace(/http\:\/\/nise3548.pe.hu\/GOLD\#/g, '');
                list3[i] = d.replace(/http\:\/\/nise3548.pe.hu\/GOLD\#/g, '');
                list4[i] = b.replace(/http\:\/\/nise3548.pe.hu\/GOLD\#/g, '');
                list5[i] = e.replace(/http\:\/\/nise3548.pe.hu\/GOLD\#/g, '');
            }
            Calc.calcCost_job_subjectList(list3, list2, list, list4, list5).then(function (results) {
                resolve({lectureList: results.subjectList, abilityList: results.skillList, costList: results.costList});
            });
        });
    });
};//success-같은 과목이 여러 개 나옴 -> 숫자를 세서 처리 필요

//Q18 특정 {과목}을 들었을 때 수행할 수 있는 {직무}는?
exports.lecture_JobDutyList = function lecture_JobDutyList(subjectClass) {
    return new Promise(function (resolve) {
        var list = [];
        var list2 = [];
        var list3 = [];
        var list4 = [];
        // var endpoint = 'http://localhost:3030/ds/query';
        var query = prefix +
            "SELECT * " +
            "WHERE " +
            "{ gold:" + subjectClass + " gold:canDevelop ?Ability.?Ability gold:contributeTo ?AbilityU.?AbilityU gold:needFor ?job. ?job gold:numberOfAbilityUnit ?countAbilityU. ?Ability gold:isMajorAbility ?isMA. }";
        var client = new SparqlClient(endpoint);
        client.query(query, function (err, results) {
            list = results.results.bindings;
            for (var i = 0; i < list.length; i++) {
                var a = list[i].job.value;
                var c = list[i].Ability.value;
                var b = list[i].countAbilityU.value;
                var d = list[i].isMA.value;
                list[i] = a.replace(/http\:\/\/nise3548.pe.hu\/GOLD\#/g, '');
                list2[i] = c.replace(/http\:\/\/nise3548.pe.hu\/GOLD\#/g, '');
                list3[i] = b.replace(/http\:\/\/nise3548.pe.hu\/GOLD\#/g, '');
                list4[i] = d.replace(/http\:\/\/nise3548.pe.hu\/GOLD\#/g, '');
            }
            console.log(list2);
            Calc.calcCost_subject_jobList(list, list3, list2, list4).then(function (results) {
                resolve({jobList: results.jobList, abilityList: results.skillList, costList: results.costList});
            });
        });
    });
};//success

//학생 정보 쿼리
exports.studentInfo = function studentInfo(stuName) {
    return new Promise(function (resolve) {
        // var endpoint = 'http://localhost:3030/ds/query';
        var query = prefix +
            'SELECT * ' +
            'WHERE ' +
            '{ gold:' + stuName + ' gold:studentNumber ?studentNumber.' +
            'gold:' + stuName + ' gold:studentName ?studentName.' +
            'gold:' + stuName + ' gold:studentGrade ?studentGrade.' +
            'gold:' + stuName + ' gold:studentMajor ?studentMajor.}';
        var client = new SparqlClient(endpoint);
        client.query(query, function (err, results) {
            console.log(results.results.bindings[0])
            resolve({
                stuNum: results.results.bindings[0].studentNumber.value.replace(/http\:\/\/nise3548.pe.hu\/GOLD\#/g, ''),
                stuGrade: results.results.bindings[0].studentGrade.value.replace(/http\:\/\/nise3548.pe.hu\/GOLD\#/g, ''),
                stuMajor: results.results.bindings[0].studentMajor.value.replace(/http\:\/\/nise3548.pe.hu\/GOLD\#/g, '')
            });
        });
    });
};

exports.student_subjectList = function student_subjectList(stuName) {
    return new Promise(function (resolve) {
        var majorList = [];
        var culList = [];
        var list = [];
        var list2 = [];
        // var endpoint = 'http://localhost:3030/ds/query';
        var query = prefix +
            'SELECT * ' +
            'WHERE { gold:' + stuName +
            ' gold:takeCourse ?Lecture.' +
            ' ?Lecture gold:hasteamProject ?teamProject.' +
            ' ?Lecture gold:isEssential ?essential.' +
            ' ?Lecture gold:isMajor ?isMajor.}';
        var client = new SparqlClient(endpoint);
        client.query(query, function (err, results) {
            list = results.results.bindings;
            for (var i = 0; i < list.length; i++) {
                // 과목 이름
                var a = list[i].Lecture.value;
                //var b = list[i].practice.value;
                var c = list[i].teamProject.value;
                var d = list[i].essential.value;
                //var e = list[i].recommandGrade.value;
                var f = list[i].isMajor.value;
                /*if(b == 'true'){
                    b = 'O';
                }else{
                    b = 'X';
                }*/
                if (c == 'true') {
                    c = 'O';
                } else {
                    c = 'X';
                }
                if (d == 'true') {
                    d = 'O';
                } else {
                    d = 'X';
                }
                if (f == 'true') {
                    f = 'O';
                } else {
                    f = 'X';
                }
                list2[i] = {
                    lecture: a.replace(/http\:\/\/nise3548.pe.hu\/GOLD\#/g, ''),
                    teamProject: c.replace(/http\:\/\/nise3548.pe.hu\/GOLD\#/g, ''),
                    essential: d.replace(/http\:\/\/nise3548.pe.hu\/GOLD\#/g, ''),
                    major: f.replace(/http\:\/\/nise3548.pe.hu\/GOLD\#/g, '')
                };
                if (f == 'O') {
                    majorList.push(list2[i]);
                } else {
                    culList.push(list2[i]);
                }
            }
            //list2.sort(function(a, b){
            //return a.recommendGrade - b.recommendGrade;
            //});
            console.log('688' + majorList);
            resolve({list2: list2, majorList: majorList, culList: culList});
        });
    });
};

exports.student_abilityLIst = function (stuName) {
    return new Promise(function (resolve) {
        var list = [];
        var list2 = [];
        // var endpoint = 'http://localhost:3030/ds/query';
        var query = prefix +
            'SELECT * ' +
            'WHERE ' +
            '{ gold:' + stuName +
            ' gold:takeCourse ?Lecture.' +
            '?Lecture gold:canDevelop ?Ability. ?Ability gold:isMajorAbility ?isMA.}';
        var client = new SparqlClient(endpoint);
        client.query(query, function (err, results) {
            list = results.results.bindings;
            for (var i = 0; i < list.length; i++) {
                var a = list[i].Ability.value.replace(/http\:\/\/nise3548.pe.hu\/GOLD\#/g, '');
                if (list2[a] == undefined) {
                    list2[a] = {};
                    list2[a].cost = 1;
                    list2[a].major = list[i].isMA.value.replace(/http\:\/\/nise3548.pe.hu\/GOLD\#/g, '');
                }
                else list2[a].cost++;
            }
            var list3 = [];
            var j = 0;
            for (skill in list2) {
                list3[j] = {};
                list3[j].skill = skill;
                list3[j].cost = list2[skill].cost;
                list3[j].major = list2[skill].major;
                j++;
            }
            list3.sort(function (a, b) {
                return a.cost - b.cost;
            });
            list3.reverse();
            resolve(list3);
        });
    });
};

exports.student_jobList = function (stuName) {
    return new Promise(function (resolve) {
        var list = [];
        var lList = [];
        var aList = [];
        var auList = [];
        var jList = [];
        var auNumList = [];
        var isMAList = [];
        // var endpoint = 'http://localhost:3030/ds/query';
        var query = prefix +
            'SELECT * ' +
            'WHERE ' +
            '{ gold:' + stuName + ' gold:takeCourse ?Lecture. ?Lecture gold:canDevelop ?Ability. ?Ability gold:contributeTo ?AbilityU. ?AbilityU gold:needFor ?job. ?job gold:numberOfAbilityUnit ?countAbilityU. ?Ability gold:isMajorAbility ?isMA.}';
        var client = new SparqlClient(endpoint);
        client.query(query, function (err, results) {
            list = results.results.bindings;
            for (var i = 0; i < list.length; i++) {
                var lecture = list[i].Lecture.value.replace(/http\:\/\/nise3548.pe.hu\/GOLD\#/g, '');
                var ability = list[i].Ability.value.replace(/http\:\/\/nise3548.pe.hu\/GOLD\#/g, '');
                var abilityU = list[i].AbilityU.value.replace(/http\:\/\/nise3548.pe.hu\/GOLD\#/g, '');
                var job = list[i].job.value.replace(/http\:\/\/nise3548.pe.hu\/GOLD\#/g, '');
                var auNum = list[i].countAbilityU.value.replace(/http\:\/\/nise3548.pe.hu\/GOLD\#/g, '');
                var isMA = list[i].isMA.value.replace(/http\:\/\/nise3548.pe.hu\/GOLD\#/g, '');
                lList.push(lecture);
                aList.push(ability);
                auList.push(abilityU);
                jList.push(job);
                auNumList.push(auNum);
                isMAList.push(isMA);
            }
            Calc.calcCost_student_jobList(lList, jList, auNumList, aList, isMAList).then(function (result) {
                resolve(result);
            });
        });
    });
};