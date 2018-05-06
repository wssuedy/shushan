var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  next(new Error("abc"));
},function(err,req,res,next){
  res.send(err.message);
});


module.exports = router;
