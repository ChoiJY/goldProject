/**
 * Created by kmj on 2016-11-11.
 */
var express = require('express');
var router = express.Router();
var query = require('../module/query');

router.get('/:queryType?/:selectedIndustry', function (req, res, next) {
    var queryType = req.params.queryType;
    if(queryType == 'job') {
        //직무
    }else next();
});

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('\industry_field/ind', {"ifList": [], 'results':[]});
});

module.exports = router;