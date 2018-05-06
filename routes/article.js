var express = require('express');
var router = express.Router();
var models = require("./models");
var Article = models.Article;
var Messages = models.Messages;
var Loves = models.Loves;
const validate = require("../public/javascripts/validateArticle");

var accessTag = 0;

const pageper = 5;//每页显示数


/* GET home page. */
router.get('/', async function(req, res, next) {
  res.locals.num = 1;
  res.locals.user = req.session.user || "";
  console.log(req.session.user);
  res.locals.list = await Article.find().limit(pageper).sort('-createTime');
  res.locals.count = await Article.find().count();
  res.locals.pageper = pageper;
  res.locals.currpage = 1;
  req.session.author = "";
  accessTag = 0
  res.render('article');
});

router.get('/page/:i', async function(req, res, next) {
  console.log("get page");
  const newcurrpage = req.params.i;
  console.log(newcurrpage);
  const startnum = newcurrpage*pageper-pageper;
  console.log(startnum);
  const author = req.session.author;
  res.locals.num = 1;
  res.locals.user = req.session.user || "";
  console.log(req.session.user);
  if(author!=""){
    res.locals.list = await Article.find().skip(startnum).limit(pageper);
    res.locals.count = await Article.find().count();
  }else{
    res.locals.list = await Article.find({author}).skip(startnum).limit(pageper);
    res.locals.count = await Article.find({author}).count();
  }
  res.locals.pageper = pageper;
  res.locals.currpage = newcurrpage;
  accessTag = 0
  res.render('article');
});

/* 日期排序. */
router.get('/dateold/:i', async function(req, res, next) {
  console.log("排序");
  res.locals.user = req.session.user || "";
  console.log(req.session.user);
  const currpage = req.params.i;
  const startnum = currpage*pageper-pageper;
  const author = req.session.author;
  console.log(author);
  if(author!=""){
    res.locals.list = await Article.find().skip(startnum).limit(pageper).sort('-createTime');
    res.locals.count = await Article.find().count();
  }else{
    res.locals.list = await Article.find({author}).skip(startnum).limit(pageper).sort('-createTime');
    res.locals.count = await Article.find({author}).count();
  }
  res.locals.pageper = pageper;
  res.locals.currpage = currpage;
  accessTag = 0;
  res.render('article');
});

/* 日期排序.*/
router.get('/datenew/:i', async function(req, res, next) {
  console.log("排序new");
  res.locals.user = req.session.user || "";
  console.log(req.session.user);
  const currpage = req.params.i;
  const startnum = currpage*pageper-pageper;
  const author = req.session.author;
  console.log("author:"+author);
  if(author!=""){
    res.locals.list = await Article.find().skip(startnum).limit(pageper).sort('createTime');
    res.locals.count = await Article.find().count();
  }else{
    res.locals.list = await Article.find({author}).skip(startnum).limit(pageper).sort('createTime');
    res.locals.count = await Article.find({author}).count();
  }

  accessTag = 0;
  res.locals.pageper = pageper;
  res.locals.currpage = currpage;

  res.render('article');
});
// 只看我的
router.get('/my', async function(req, res, next) {
  res.locals.user = req.session.user || "";
  console.log("-----------my-----------");
  console.log(req.session.user && req.session.user.loginname || "");
  const author = req.session.user && req.session.user.loginname || "";

  console.log(req.session.user);
  res.locals.list = await Article.find({author}).limit(pageper).sort('-createTime');
  res.locals.count = await Article.find({author}).count();
  req.session.author = author;
  console.log("author:"+req.session.author);
  res.locals.currpage = 1;
  res.locals.pageper = pageper;
  accessTag = 0;
  res.render('article');
});

// 只看作者
router.get("/:author/author",async function(req,res,next){
  res.locals.user = req.session.user || "";
  console.log("-----------author-----------");

  const author = req.params.author;
  console.log(author);

  res.locals.list = await Article.find({author});
  accessTag = 0;
  res.render('article');
});

router.get("/create",function(req,res,next){
  console.log("create article");
  res.locals.user = req.session.user || "";
  res.render('createArticle');
});


// 创建文章
router.post("/create",async function(req,res,next){
  const {title,body} = req.body;
  console.log(title,body);
  const author = req.session.user && req.session.user.loginname || "";
  const doc = new Article({
    title,body,author,
    createTime:new Date(),
    updateTime:new Date(),
    accessNum:0,
    loveNum:0
  });

  var errors = validate(title,body);
  console.log(errors);
  if(errors){
    res.send(errors);
  }else{
    try{
      await doc.save();

      res.send("");
    }catch(err){
      // res.locals.user = req.session.user || "";
      // res.locals.error = err.errors.title.message;
      let errors = {};
      errors.err = "产品数据存储失败";
      res.send(errors);
    }
  }


});

// 删除文章
router.get("/:id/delete",async function(req,res,next){
  await Article.remove({_id:req.params.id});
  console.log("删除");
  res.redirect("/article");
});


//更改
router.get("/:id/edit",async function(req,res,next){
  const id = req.params.id;
  const doc = await Article.findById(id);
  console.log(await doc);

  const body = doc.body;
  const title = doc.title;
  res.locals.user = req.session.user || "";
  res.locals.id = req.params.id;
  res.locals.title = title;
  res.locals.body = body;
  res.render("updateArticle");

});

//修改文章
router.post("/:id/update",async function(req,res,next){
  const{title,body} = req.body;
  const id = req.params.id;
  const doc = await Article.findById(id);
  console.log(doc);
  if(doc){
    doc.title = title;
    doc.body = body;
    doc.updateTime = new Date();
    await doc.save();
  }
  r
  res.redirect("/article");
});

//查看
router.get("/:id/read",async function(req,res,next){

  console.log("用户登录信息："+req.session.user);
  var name = req.session.user || "";
  if(req.session.user){
    name = req.session.user.loginname;
  }
  // const name = req.session.user;
  const id = req.params.id;
  const doc = await Article.findById(id);
  if(doc && accessTag == 0){
    doc.accessNum++;
    await doc.save();
  }

  console.log(await doc);

  const list = await Messages.find({id});
  console.log(list);
  console.log("read*******");

  res.locals.user = req.session.user || "";

  const loves = await Loves.findOne().where("id").eq(id).where("name").eq(name);
  let loveNum = 0;
  if(!loves){
    console.log("createnew");
    const newlove = new Loves({
      loveNum:0,
      name,
      id
    })
    await newlove.save();
    loveNum = 0;
  }else{
    loveNum = loves.loveNum;
  }
  console.log(loveNum);
  res.render("readArticle",{doc,list,loveNum});
});


//留言
router.post("/:id/message",async function(req,res,next){
  console.log("messages save begin....");
  const {title,message} = req.body;
  const name = req.session.user.name;
  const id = req.params.id;
  console.log("**********message:  "+id);
  const mes = new Messages({
    name,
    title,
    id,
    message,
    createTime:new Date(),
    updateTime:new Date()
  });
  console.log(mes);

  try{
    await mes.save();
    console.log("messages save ok....");
    accessTag = 1;
    res.send("");
    // res.redirect("back");
    // res.redirect("/reg");
  }catch(err){
    console.log("article messages err");
    console.log(err.errors);
    res.render("/",{error:err.errors.message});
  }

})

//点赞
router.get("/:id/love",async function(req,res,next){
  const id = req.params.id;
  var name = req.session.user || "";
  if(req.session.user){
    name = req.session.user.loginname;
  }
  const doc = await Article.findById(id);

  const loves = await Loves.findOne().where("id").eq(id).where("name").eq(name);

  console.log("***loves***********************_______________----------");
  console.log(loves);
  if(doc){
    if(!loves){
      console.log("createnew");
      const newlove = new Loves({
        loveNum:1,
        name,
        id
      })

      await newlove.save();
      doc.loveNum++;
      await doc.save();
    }else{
      console.log("add num");
      if(loves.loveNum == 1){
        loves.loveNum = 0;
        await loves.save();
        doc.loveNum--;
        await doc.save();
      }else if (loves.loveNum == 0) {
        loves.loveNum = 1;
        await loves.save();
        doc.loveNum++;
        await doc.save();
      }
    }
  }

  console.log(loves);


  // const list = await Messages.find({id});
  //
  // res.render("readArticle",{doc,list});
  accessTag = 1;
  res.redirect("back");

})


// 分页
router.get("/page",function(req,res){
  currnum = req.query.num;
  console.log(currnum);
  res.redirect("back");
})

module.exports = router;
