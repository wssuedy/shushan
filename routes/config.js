var express = require('express');
var router = express.Router();
var PW = require("png-word");
var pw = new PW();
var R = require("random-word");

var models = require("./models");
var Users = models.Users;
const validate = require("../public/javascripts/validateConfig");

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.locals.user = req.session.user || "";
  res.locals.vimg = req.session.vimg;
  console.log("config-vimg"+res.locals.vimg);

  res.render('config');
});

router.get('/updatename', function(req, res, next) {
  res.locals.user = req.session.user || "";
  res.locals.vimg = req.session.vimg;
  console.log("config-vimg"+res.locals.vimg);

  res.render('configName');
});


router.post('/updatepw',async function(req,res,next){
  const {loginname,password,newpassword,confirm,vimg}= req.body;
  console.log("modify name:"+loginname);


  var errors = validate(password,newpassword,confirm,vimg);
  console.log(errors);
  if(errors){
    res.send(errors);
  }

  const query = await Users.find().where("loginname").eq(loginname);

  console.log("update********"+query);

  //console.log("query[0]"+query[0]);
  console.log("查询的密码:"+query[0].password +
  "  输入的原有密码 : "+password +
  "    输入新密码: "+newpassword + +
  "  确认密码:  "+confirm +"  vimg：  " +vimg +"  req  ："+req.session.vimg);
  if(await query && await query[0].password == password && newpassword && newpassword === confirm &&
  vimg && vimg == req.session.vimg){
      // 修改密码增加
      console.log("修改密码");

      try{
        query[0].password = newpassword;
        await query[0].save();
        console.log("修改密码成功");
        console.log(await query[0]);
        res.send("");

      }catch(err){
        let errors = {};
        errors.err = "数据存储失败";
        res.send(errors);
      }

  }else if(query[0].password != password){
    let errors = {};
    errors.password = "原有密码输入不正确";
    console.log("原有密码输入不正确");
    res.send(errors);
  }else if (vimg != req.session.vimg) {
    let errors = {};
    errors.vimg = "验证码不正确";
    res.send(errors);
  }else{
    let errors = {};
    errors.err = "未知错误 修改失败";
    console.log(await query);
    console.log("query[0].password:"+query[0].password);
    res.send(errors);
  }

})



router.post('/updatename',async function(req,res,next){
  const {name,vimg}= req.body;
  console.log("name:"+name +"vimg: "+vimg + "req.session.vimg"+req.session.vimg2 );
  console.log(req.session.vimg2 == vimg);
  console.log("modify name:"+req.session.user.loginname);

  if(name == req.session.user.name){
    let errors = {};
    errors.nameword = "新的昵称和原有的昵称一致，请重新设置";
    res.send(errors);
  }

  const query = await Users.find().where("loginname").eq(req.session.user.loginname);
  console.log("查询结果"+await query[0]);



  if(await query && vimg && vimg == req.session.vimg2){
      console.log("设置昵称");

      try{
        query[0].name = name;
        await query[0].save();
        req.session.user.name = query[0].name;
        console.log(await query[0]);
        res.send("");
        console.log("修改成功");
        console.log("成功后"+"query[0].name:"+query[0].name);

      }catch(err){
        let errors = {};
        errors.err = "数据存储失败";
        res.send(errors);
      }

  }else{
    let errors = {};
    errors.err = "未知错误 修改失败";
    console.log(await query);
    console.log("未知错误"+"query[0].name:"+query[0].name);
    res.send(errors);
  }

})

router.get("/vimg",function(req,res){

  var r = new R("123456789");
  req.session.vimg = r.random(3);
  pw.createReadStream(req.session.vimg).pipe(res);

  // pw.on("parsed",function(){
  //   this.createReadStream("11132221").pipe(res);
  // })
})

router.get("/vimg2",function(req,res){

  var r = new R("123456789");
  req.session.vimg2 = r.random(3);
  pw.createReadStream(req.session.vimg2).pipe(res);

  // pw.on("parsed",function(){
  //   this.createReadStream("11132221").pipe(res);
  // })
})

module.exports = router;
