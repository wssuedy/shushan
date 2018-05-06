var express = require('express');
var router = express.Router();
var models = require("./models");
var PW = require("png-word");
var pw = new PW();
var R = require("random-word");

var Messages = models.Messages;
const validatevmsg = require("../public/javascripts/validatevmsg");


/* GET users listing. */
router.get('/', async function(req, res, next) {
  console.log("get message******");
  res.locals.user = req.session.user || "";
  res.locals.vimg = req.session.vimg;
  const name = req.session.user && req.session.user.loginname || "";

  res.locals.list = await Messages.find().where("name").eq(name).where("id").eq(null);
  console.log(await Messages.find().where("name").eq(name));

  res.render('message');
});

router.post('/create', async function(req, res, next) {
  console.log("creat post message******");
  res.locals.user = req.session.user || "";

  const {message,vimg} = req.body;
  console.log(req.session.vimg +"----"+vimg);
  const name = req.session.user && req.session.user.loginname || "";
  // var errors = validatevmsg(vimg,req.session.vimg,message);
  // if(!errors){
  //   res.send(errors);
  //   console.log("有误"+errors);
  // }else{
    if(vimg && vimg == req.session.vimg){
      console.log("create  messages....");
      const mes = new Messages({
        name,
        message,
        createTime:new Date(),
        updateTime:new Date()
      });
      console.log(mes);
      await mes.save();
      res.send("");
    }else if (req.session.vimg != vimg) {
      let errors = {};
      errors.pw = "验证码输入有误";
      res.send(errors);
    }else if(message.length < 10 || loginname.length >100){
      let errors = {};
      errors.pw = "message length <10 or >100";
      res.send(errors);
    }


  // res.redirect('back');
});


router.get("/vimg",function(req,res){

  var r = new R("123456789");
  req.session.vimg = r.random(3);
  pw.createReadStream(req.session.vimg).pipe(res);

  // pw.on("parsed",function(){
  //   this.createReadStream("11132221").pipe(res);
  // })
})



module.exports = router;
