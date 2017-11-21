//calculate cost(weight)

var Promise = require('bluebird');

exports.calcCost_subject_subjectList = function calcCost_subject_subjectList(abilityList, subjectList, isMajorList){
    return new Promise(function(resolve){
        var valNumList = [];
        var newSubjectList = [];
        var newAbilityList = [];
        var cut = [];
        for(var i = 0; i < subjectList.length; i++){
            var key = subjectList[i].toString();
            var cost = 1;
            if(isMajorList[i]=='false')
                cost = 0.5;
            if(!valNumList[key]){
                valNumList[key]=cost;
            }else{
                valNumList[key]+=cost;
            }
        }

        for(key in valNumList){
            if(cut.length < 5){
                cut.push(valNumList[key]);
            }else{
                for(var l = 0; l < cut.length; l++){
                    if(cut[l]<valNumList[key]){
                        cut[l] = valNumList[key];
                        break;
                    }
                }
            }
        }
        cut.sort(function(a, b){
            return a - b;
        });

        for(var k = 0; k < subjectList.length; k++){
            if(valNumList[subjectList[k]]>= cut[0]){
                newSubjectList.push(subjectList[k]);
                newAbilityList.push(abilityList[k]);
            }
        }
        resolve({valNumList: valNumList, abilityList: newAbilityList, subjectList: newSubjectList});
    });
}; //전공 과목 check

exports.calcCost_job_skillList = function calcCost_job_skillList(aUList, skillList, isMAList){
    return new Promise(function(resolve){
        var newSkillList = [];
        var costList = [];
        var cut = [];
        for(var i = 0; i < skillList.length; i++) {
            var key = skillList[i].toString();
            if (!costList[key]) {
                if(isMAList[i]=='true')
                    costList[key] = 1;
                else costList[key] = 0.5;
            } else {
                if(isMAList[i]=='true')
                    costList[key]++;
                else costList[key] += 0.5;
            }
        }
        var reducedAUList = aUList.reduce(function(a, b){
            if(a.indexOf(b)<0) a.push(b);
            return a;
        }, []); //중복 제거

        for(key in costList){
            costList[key] = costList[key] / reducedAUList.length * 100;
            console.log(key + " " + costList[key]);
        }
        for(key in costList){
            if(cut.length < 5){
                cut.push(costList[key]);
            }else{
                for(var l = 0; l < cut.length; l++){
                    if(cut[l]<costList[key]){
                        cut[l] = costList[key];
                        break;
                    }
                }
            }
        }
        cut.sort(function(a, b){
            return a - b;
        });
        for(var j = 0; j < skillList.length; j++){
            if(costList[skillList[j]]>= cut[0]){
                newSkillList.push(skillList[j]);
            }
        }
        resolve({skillList: newSkillList, costList: costList});
    });
}; //

function containsObject(obj, list) {
    var i;
    for (i = 0; i < list.length; i++) {
        if (JSON.stringify(list[i]) == JSON.stringify(obj)) {
            return true;
        }
    }
    return false;
}

exports.calcCost_job_subjectList = function calcCost_job_subjectList(aUList, skillList, lectureList, isMajorList, isMAList){
    return new Promise(function(resolve){
        var newSkillList = [];
        var newSubjectList = [];
        var costList = [];
        var newCostList = [];
        var subjectCostList = [];
        var cut = [];
        var reduced_isMajorList = [];
        var reduced_List = [];

        for(var o = 0; o < skillList.length; o++){
            var temp = {aU: aUList[o], skill: skillList[o], isMA: isMAList[o]};
            if(reduced_List===[])
                reduced_List.push(temp);
            else if(!containsObject(temp, reduced_List))
                reduced_List.push(temp);
        }

        for(var i = 0; i < reduced_List.length; i++){
            var key = reduced_List[i].skill.toString();
            if (!costList[key]) {
                if(reduced_List[i].isMA=='true')
                    costList[key] = 1;
                else costList[key] = 0.5;
            } else {
                if(reduced_List[i].isMA=='true')
                    costList[key]++;
                else costList[key] += 0.5;
            }
        }

        var reducedAUList = aUList.reduce(function(a, b){
            if(a.indexOf(b)<0) a.push(b);
            return a;
        }, []); //중복 제거

        for(key in costList){
            costList[key] = costList[key] / reducedAUList.length;
        }
        for(var j = 0; j < lectureList.length; j++){
            var subject = lectureList[j].toString();
            if(!subjectCostList[subject]){
                subjectCostList[subject] = costList[skillList[j]];
                reduced_isMajorList[subject] = isMajorList[j];
            }else{
                subjectCostList[subject] += costList[skillList[j]];
            }
        }
        for(sc in subjectCostList){
            if(reduced_isMajorList[sc]=='false')
                subjectCostList[sc] *= 0.5;
        }

        for(subjectCost in subjectCostList){
            if(cut.length < 7){
                cut.push(subjectCostList[subjectCost]);
            }else{
                for(var l = 0; l < cut.length; l++){
                    if(cut[l]<subjectCostList[subjectCost]){
                        cut[l] = subjectCostList[subjectCost];
                        break;
                    }
                }
            }
        }
        cut.sort(function(a, b){
            return a - b;
        });

        //rank

        for(var k = 0; k < skillList.length; k++){
            if(subjectCostList[lectureList[k]]>=cut[0]){
                newSkillList.push(skillList[k]);
                newSubjectList.push(lectureList[k]);
                newCostList[lectureList[k]] = subjectCostList[lectureList[k]];
            }
        }

        resolve({skillList: newSkillList, subjectList: newSubjectList, costList: newCostList});
    });
};

exports.calcCost_skill_jobList = function calcCost_skill_jobList(jobList, aUNumList){
  return new Promise(function(resolve){
      var costList = [];
      //var newJobList = [];
      var job_auNumList = [];
      //var newCostList = [];

      for(var i = 0; i < jobList.length; i++){
          if(!job_auNumList[jobList[i]])
              job_auNumList[jobList[i]] = aUNumList[i];
      }

      for(var j = 0; j < jobList.length; j++) {
          var key = jobList[j].toString();
          if (!costList[key]) {
              costList[key] = 1;
          } else {
              costList[key]++;
          }
      }

      var costSum = 0;

      for(key in costList){
          costList[key] /= job_auNumList[key];
          costSum += costList[key];
      }

      for(key in costList){
          costList[key] = costList[key] / costSum;
      }

      //set cost limit and cut jobList, costList to newJobList, newCostList

      resolve({jobList: jobList, costList: costList});
      //resolve({jobList: newJobList, costList: newCostList});
  });
};

exports.calcCost_subject_jobList = function calcCost_subject_jobList(jobList, aUNumList, skillList, isMAList){
    return new Promise(function (resolve) {
        var costList = [];
        //var newJobList = [];
        //var newCostList = [];
        var jobInfoList = [];
        var skillCostSumList = [];

        for(var i = 0; i < jobList.length; i++){
            if(!jobInfoList[jobList[i]]){
                jobInfoList[jobList[i]] = {};
                jobInfoList[jobList[i]].abilityList = [];
                jobInfoList[jobList[i]].abilityList.push(skillList[i]);
                jobInfoList[jobList[i]].isMAList = [];
                jobInfoList[jobList[i]].isMAList.push(isMAList[i]);
                jobInfoList[jobList[i]].auNum = parseInt(aUNumList[i]);
            }else{
                jobInfoList[jobList[i]].abilityList.push(skillList[i]);
                jobInfoList[jobList[i]].isMAList.push(isMAList[i]);
            }
        }

        for(key in jobInfoList){
            var job_aList = jobInfoList[key].abilityList;
            var job_a_maList = jobInfoList[key].isMAList;
            var skillCostList = [];
            for(var j = 0; j < job_aList.length; j++){
                if(!skillCostList[job_aList[j]]){
                    if(job_a_maList[j] == 'true')
                        skillCostList[job_aList[j]] = 1;
                    else skillCostList[job_aList[j]] = 0.5;
                }else{
                    if(job_a_maList[j] == 'true')
                        skillCostList[job_aList[j]] += 1;
                    else skillCostList[job_aList[j]] += 0.5;
                }
            }
            for(skillCost in skillCostList){
                skillCostList[skillCost] += skillCostList[skillCost] / jobInfoList[key].auNum;
            }
            jobInfoList[key].skillCostList = [];
            jobInfoList[key].skillCostList = skillCostList;
        }

        var reducedSkillList = skillList.reduce(function(a, b){
            if(a.indexOf(b)<0) a.push(b);
            return a;
        }, []);

        for(var k = 0; k < reducedSkillList.length; k++){
            var skillCostSum  = 0;
            for(key in jobInfoList){
                var job_aCostList = jobInfoList[key].skillCostList;
                if(job_aCostList[reducedSkillList[k]]!=undefined){
                    skillCostSum += job_aCostList[reducedSkillList[k]];
                }
            }
            skillCostSumList[reducedSkillList[k]] = skillCostSum;
        }

        for(key in jobInfoList){
            var job_scList = jobInfoList[key].skillCostList;
            var cost = 0;
            for(var l = 0; l < reducedSkillList.length; l++){
                if(job_scList[reducedSkillList[l]] != undefined){
                    cost += job_scList[reducedSkillList[l]] / skillCostSumList[reducedSkillList[l]];
                }
            }
            costList[key] = cost;
        }

        //set cost limit and cut jobList, skillList, costList

        resolve({jobList: jobList, skillList: skillList, costList: costList});
        //resolve({jobList: newJobList, skillList: newSkillList, costList: newCostList});
    });
};

exports.calcCost_student_jobList = function(lectureList, jobList, aUNumList, skillList, isMAList){
    return new Promise(function (resolve) {
        var list = [];
        for(var o = 0; o < lectureList.length; o++){
            if(list[lectureList[o]] == undefined){
                list[lectureList[o]] = {};
                list[lectureList[o]].jobList = [];
                list[lectureList[o]].jobList.push(jobList[o]);
                list[lectureList[o]].aUNumList = [];
                list[lectureList[o]].aUNumList.push(aUNumList[o]);
                list[lectureList[o]].skillList = [];
                list[lectureList[o]].skillList.push(skillList[o]);
                list[lectureList[o]].isMAList = [];
                list[lectureList[o]].isMAList.push(isMAList[o]);
            }else{
                list[lectureList[o]].jobList.push(jobList[o]);
                list[lectureList[o]].aUNumList.push(aUNumList[o]);
                list[lectureList[o]].skillList.push(skillList[o]);
                list[lectureList[o]].isMAList.push(isMAList[o]);
            }
        }
        var list2 = [];
        for(subject in list){
            list2[subject] = {};
            list2[subject].jobList = list[subject].jobList;
            list2[subject].costList = [];
            var jobInfoList = [];
            var skillCostSumList = [];

            for(var i = 0; i < list[subject].jobList.length; i++){
                if(!jobInfoList[list[subject].jobList[i]]){
                    jobInfoList[list[subject].jobList[i]] = {};
                    jobInfoList[list[subject].jobList[i]].abilityList = [];
                    jobInfoList[list[subject].jobList[i]].abilityList.push(list[subject].skillList[i]);
                    jobInfoList[list[subject].jobList[i]].isMAList = [];
                    jobInfoList[list[subject].jobList[i]].isMAList.push(list[subject].isMAList[i]);
                    jobInfoList[list[subject].jobList[i]].auNum = parseInt(list[subject].aUNumList[i]);
                }else{
                    jobInfoList[list[subject].jobList[i]].abilityList.push(list[subject].skillList[i]);
                    jobInfoList[list[subject].jobList[i]].isMAList.push(list[subject].isMAList[i]);
                }
            }

            for(key in jobInfoList){
                var job_aList = jobInfoList[key].abilityList;
                var job_a_maList = jobInfoList[key].isMAList;
                var skillCostList = [];
                for(var h = 0; h < job_aList.length; h++){
                    if(!skillCostList[job_aList[h]]){
                        if(job_a_maList[h] == 'true')
                            skillCostList[job_aList[h]] = 1;
                        else skillCostList[job_aList[h]] = 0.5;
                    }else{
                        if(job_a_maList[h] == 'true')
                            skillCostList[job_aList[h]] += 1;
                        else skillCostList[job_aList[h]] += 0.5;
                    }
                }
                for(skillCost in skillCostList){
                    skillCostList[skillCost] += skillCostList[skillCost] / jobInfoList[key].auNum;
                }
                jobInfoList[key].skillCostList = [];
                jobInfoList[key].skillCostList = skillCostList;
            }

            var reducedSkillList = list[subject].skillList.reduce(function(a, b){
                if(a.indexOf(b)<0) a.push(b);
                return a;
            }, []);

            for(var k = 0; k < reducedSkillList.length; k++){
                var skillCostSum  = 0;
                for(key in jobInfoList){
                    var job_aCostList = jobInfoList[key].skillCostList;
                    if(job_aCostList[reducedSkillList[k]]!=undefined){
                        skillCostSum += job_aCostList[reducedSkillList[k]];
                    }
                }
                skillCostSumList[reducedSkillList[k]] = skillCostSum;
            }

            for(key in jobInfoList){
                var job_scList = jobInfoList[key].skillCostList;
                var cost = 0;
                for(var l = 0; l < reducedSkillList.length; l++){
                    if(job_scList[reducedSkillList[l]] != undefined){
                        cost += job_scList[reducedSkillList[l]] / skillCostSumList[reducedSkillList[l]];
                    }
                }
                list2[subject].costList[key] = cost;
            }
        }
        var list3 = [];
        for(subject in list2){
            var jList = list2[subject].jobList;
            var cList = list2[subject].costList;
            for(var j = 0; j < jList.length; j++){
                if(list3[jList[j]]==undefined){
                    list3[jList[j]] = cList[jList[j]];
                }else{
                    list3[jList[j]]+=cList[jList[j]];
                }
            }
        }
        var list4 = [];

        for(job in list3){
            list4.push({job: job, cost: list3[job]});
        }
        list4.sort(function(a, b){
            return a.cost - b.cost;
        });
        list4.reverse();
        console.log(list4);
        resolve(list4);
    });
};

