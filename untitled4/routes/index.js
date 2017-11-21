var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session.userInfo != undefined){
    res.locals.userInfo = req.session.userInfo;
  }
  res.render('index');
});

module.exports = router;
