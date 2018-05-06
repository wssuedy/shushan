var express = require('express');
var router = express.Router();
var models = require("./models");
var Chat = models.Chat;

/* GET home page. */
router.get('/', function(req, res, next) {
  req.session.num = req.session.num || 0;

  res.locals.num = ++req.session.num;
  console.log(req.session.num);

  res.locals.user = req.session.user || "";
  console.log(req.session.user);
  console.log("chat");
  res.render('chat');
});

router.get('/chatbox', function(req, res, next) {
  req.session.num = req.session.num || 0;

  res.locals.num = ++req.session.num;
  console.log(req.session.num);

  res.locals.user = req.session.user || "";
  console.log(req.session.user);
  console.log("chat");
  res.render('chatbox');
});


module.exports = router;
