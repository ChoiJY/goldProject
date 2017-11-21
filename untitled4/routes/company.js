/**
 * Created by kmj on 2016-11-11.
 */
var express = require('express');
var router = express.Router();
var query = require('../module/query');

router.get('/:queryType?/:selectedCompany', function (req, res, next) {
    var queryType = req.params.queryType;
    var selectedCompany = req.params.selectedCompany;
    if(req.session.userInfo != undefined){
        res.locals.userInfo = req.session.userInfo;
    }
    if(queryType == 'job') {
        query.companyList().then(function(companyList){
            query.company_JobDutyList(selectedCompany).then(function(jobList){
                res.render('\company/jobInCompany', {'selectedCompany': selectedCompany,'companyList': companyList, 'results': jobList, 'q': 'Job Duty'});
            });
        });
    }else next();
});

/* GET home page. */
router.get('/', function(req, res, next) {
    if(req.session.userInfo != undefined){
        res.locals.userInfo = req.session.userInfo;
    }
    query.companyList().then(function(list){
        res.render('\company/company', {'companyList': list, 'results': list, 'q': 'List'});
    });
});

module.exports = router;