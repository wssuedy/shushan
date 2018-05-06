var express = require('express');
var router = express.Router();
var PW = require("png-word");
var pw = new PW();
var R = require("random-word");
const validate = require("../public/javascripts/validate");


var models = require("./models");
var Users = models.Users;

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.locals.user = req.session.user || "";

  req.session.firstnum = res.locals.firstnum = Math.round(Math.random() * 10);
  req.session.secondnum = res.locals.secondnum = Math.round(Math.random() * 10);

  console.log(req.session.firstnum, req.session.firstnum);

  res.render('users');
});



router.post('/login', async function(req, res, next) {
  const {
    loginname,
    password,
    sum
  } = req.body;

  // console.log("validate:::"+typeof validate);

  var errors = validate(loginname, password) || "";
  console.log("errors:" + errors);
  if (errors) {
    res.send(errors);
  } else {
    const query = await Users.find().where("loginname").eq(loginname);

    console.log("query:*****" + await query);
    console.log("password:*****" + password);
    console.log("sum:*****" + sum + "****" + req.session.firstnum + "*****" + req.session.secondnum);


    if (await query && await query[0].password == password) {
      console.log("****pw and name right***");
      const name = query[0].name;
      req.session.user = {
        loginname,
        name
      };
      if (sum == req.session.firstnum + req.session.secondnum) {
        console.log("****sum right***");
        req.session.user = {
          loginname,
          name
        };
        console.log("登录成功");
        res.send("");
        // res.redirect('back');
      }
    } else if (await !query) {
      console.log("用户名不存在");
      let errors = {};
      errors.name = "用户名不存在";
      res.send(errors);
    } else if (await query[0].password != password) {
      console.log("密码不正确");
      let errors = {};
      errors.pw = "密码不正确";
      res.send(errors);
    }

  }



  // res.redirect('back');
});

router.get('/logout', function(req, res, next) {
  res.locals.user = req.session.user = undefined;

  res.render('index');
});

router.get('/reg', function(req, res, next) {
  res.locals.user = req.session.user = undefined;
  console.log(req.session.vimg);
  res.locals.vimg = req.session.vimg;
  res.render('reg');
});

// router.post('/reg',function(req,res,next){
//   let errors = "";
//   console.log("/reg post");
//   res.send(errors);
// });

router.post('/reg', async function(req, res, next) {
  const {
    loginname,
    password,
    confirm,
    vimg
  } = req.body;
  // HttpSession session = request.getSession(false);
  console.log(loginname, password, confirm, vimg, req.session.vimg);

  const query = await Users.find().where("loginname").eq(loginname);
  console.log(query);
  if (query[0]) {
    console.log("用户名已存在");
    let errors = {};
    errors.name = "用户名已存在"
    res.send(errors);
  } else {
    if (loginname && password === confirm && vimg && vimg == req.session.vimg) {
      console.log("okokok");


      const name = loginname;
      const user = new Users({
        loginname,
        password,
        name,
        createTime: new Date(),
        updateTime: new Date()
      });

      try {
        console.log(user);
        await user.save();
        console.log("reg save");
        let errors = "";
        console.log("/reg post errors");
        res.send(errors);

        // res.redirect("/reg");
      } catch (err) {
        // console.log("reg err");
        // res.render("/",{error:err.errors.message});
        let errors = {};
        errors.name = "注册失败"
        res.send(errors);
      }

    } else if (password != confirm) {
      let errors = {};
      errors.pw = "两次输入密码不一致！"
      res.send(errors);
    }

  }


})



router.get("/vimg", function(req, res) {

  var r = new R("123456789");
  req.session.vimg = r.random(3);
  console.log("users-vimg:" + req.session.vimg);
  pw.createReadStream(req.session.vimg).pipe(res);
})

module.exports = router;