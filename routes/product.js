var express = require('express');
var router = express.Router();
const multer = require("multer");
const fs = require("fs");
var PW = require("png-word");
var pw = new PW();
var R = require("random-word");
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
// app.use(require(‘multer’)({dest:__dirname + ‘/uploads’}));

const validateProduct = require("../public/javascripts/validateProduct");


const upload = multer({
  dest:"productPic",
  limits:{
    fileSize:1024*1024*15
  }
});

const arr = upload.array("myfiles",5);
const single = upload.single("myfile");

var models = require("./models");
var Picture = models.Picture;
var Product = models.Product;

const pageper = 6;//每页显示数

/* GET users listing. */
router.get('/', async function(req, res, next) {
  res.locals.user = req.session.user || "";
  res.locals.list = await Product.find().limit(pageper).sort('-createTime')||[];
  res.locals.count = await Product.find().count();
  res.locals.pageper = pageper;
  res.locals.currpage = 1;
  res.render('product');
});

/* 日期排序. */
router.get('/dateold/:i', async function(req, res, next) {
  console.log("排序");
  res.locals.user = req.session.user || "";
  console.log(req.session.user);
  const currpage = req.params.i;
  const startnum = currpage*pageper-pageper;
  res.locals.list = await Product.find().skip(startnum).limit(pageper).sort('-createTime');
  res.locals.pageper = pageper;
  res.locals.currpage = currpage;
  res.locals.count = await Product.find().count();
  res.render('product');
});

/* 日期排序.*/
router.get('/datenew/:i', async function(req, res, next) {
  console.log("排序new");
  res.locals.user = req.session.user || "";
  console.log(req.session.user);
  const currpage = req.params.i;
  const startnum = currpage*pageper-pageper;
  res.locals.list = await Product.find().skip(startnum).limit(pageper).sort('createTime');
  res.locals.pageper = pageper;
  res.locals.currpage = currpage;
  res.locals.count = await Product.find().count();
  res.render('product');
});

router.get('/page/:i', async function(req, res, next) {
  console.log("page");
  const newcurrpage = req.params.i;
  const startnum = newcurrpage*pageper-pageper;
  res.locals.user = req.session.user || "";
  res.locals.list = await Product.find().skip(startnum).limit(pageper)||[];
  res.locals.count = await Product.find().count();
  res.locals.pageper = pageper;
  res.locals.currpage = newcurrpage;
  res.render('product');
});

router.get('/create',function(req, res, next) {
  res.locals.user = req.session.user || "";
  res.locals.vimg = req.session.vimg;

  res.render('createProduct');
});

router.post("/xhrup",arr,function(req,res){
  console.log(req.files);

  res.send(req.files);

});

router.post('/create',multipartMiddleware,async function(req,res,next){
  console.log("req.body:"+req.body);
  // console.log("req.files:"+req.files);
  // console.log("path:"+req.files);
  // const files = req.files.myfiles;
  // console.log(files);
  // const picture = await Picture.create(files);

  // const picture = await Picture.create(req.body.myfiles);
  // console.log("picture.find():"+await Picture.find());

  // console.log("create product files**************");


  var pic = [];

  //
  // for(var i in req.files){
  //   if(req.files[i].size > 0){
  //     var temp_path = req.files[i].path;
  //     var target_path = './public/images/' + req.files[i].name;
  //     fs.renameSync(temp_path, target_path);
  //   }
  // }




  // var pic = [];
  // console.log(req.body.myfiles);
  // for(var p of req.body.myfiles){
  //   pic.push(p.filename);
  // }
  // console.log("picture ***"+pic+"$$$$$$$$$$$$$$$$$$$$$");

  // console.log("create product picture**************");
  const {title,price,description,vimg,pics} = req.body;
  console.log("body:"+title+price+description+vimg);

  // for(var p of pics){
  //   pic.push(p.filename);
  // }
  console.log(pics);
  // const picture = await Picture.create(pics);

  if(req.session.vimg != vimg){
    let errors = {};
    errors.vimg = "验证码有误";
    res.send(errors);
  }
  var errors = validateProduct(title,price,description,vimg);
  console.log("errors"+errors);
  if(errors){
    res.send(errors);
  }



  const product = new Product({
    title,description,price,
    createTime:new Date(),
    updateTime:new Date(),
    picture:pics
  });

  try{
    await product.save();
    console.log("产品创建保存成功");
    res.send("");

  }catch(err){
    let errors = {};
    errors.err = "产品数据存储失败";
    res.send(errors);
  }
});


router.get('/:id/read',async function(req, res, next) {
  res.locals.user = req.session.user || "";
  const id = req.params.id;
  console.log(id);

  res.locals.product = await Product.findById(id) || "";

  res.render('readProduct');
});

router.get('/:id/update',async function(req, res, next) {
  res.locals.user = req.session.user || "";
  const id = req.params.id;
  console.log(id);

  res.locals.product = await Product.findById(id) || "";

  res.render('updateProduct');
});



router.get("/img/:filename",function(req,res){
  //读取
  console.log("读取"+req.params);

  let rs = fs.createReadStream("productPic/"+req.params.filename);
  // let rs = fs.createReadStream("./temp/"+req.params.filename);


  rs.pipe(res);
});

router.get("/vimg",function(req,res){

  var r = new R("123456789");
  req.session.vimg = r.random(3);
  pw.createReadStream(req.session.vimg).pipe(res);
})



module.exports = router;
