const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const upload = multer({
  dest:"upload",
  limits:{
    fileSize:1024*1024*15
  }
});

const single = upload.single("photo");
const arr = upload.array("photos",3);
const field = upload.fields([
  {name:"field1",maxCount:1},
  {name:"field2",maxCount:3}
]);

var models = require("./models");
var Album = models.Album;
var AlbumList = models.AlbumList;
// 相册
var name = "default";
const xclist = [];//相册名称
const xcimglist = {};//相册图片
var imgarr = [];//图片临时

xcimglist["default"] = [];

// var uparr = [];

const reg = /^[\w\d]{1,10}$/;

const pageper = 10;//每页显示数
var currarr = [];
var num = 1;//总页数
var currpage = 1;//默认显示第一页
var startnum = 0;

//主页 全部，相册页
router.get("/",async function(req,res){

        // const newalbum = new AlbumList({
        //   album:"default",
        //   createTime:new Date(),
        //   updateTime:new Date(),
        // });
        //
        // await newalbum.save();

  res.locals.user = req.session.user || "";
  res.locals.list = "";
  res.locals.num = num;
  res.locals.count = 0;
  res.locals.currpage = currpage;

  res.locals.pageper = pageper;

  // await Album.remove();
  // await AlbumList.remove();

  var albumPic = [];
  var albums = [];
  const username = req.session.user || "";
  req.session.album = req.query.album || "";
  if(username){
    name = username.loginname;
    albumPic = await Album.find({name});
    // console.log(await albumPic);

    albums = await AlbumList.find({name});
    // console.log(await albums);

  }

  var albumlist =[];
  await albums.forEach(alb=>{
    // console.log(alb.album);
    albumlist.push(alb.album);
  })

  // console.log("albumlist:"+ await albumlist);

  res.locals.xclist = albumlist;



  // console.log("查询结果albumPic:"+albumPic);
  var uparr = [];
  albumPic.forEach(pic=>{
    uparr = uparr.concat(pic.picture);
  })
  // uparr = albumPic;
  // console.log("uparr:  "+uparr);
  console.log(uparr.length);
  console.log(uparr[0]);


  if(!req.query.album ){
    console.log("全部图片");
    for(var i =currpage*pageper-pageper;i<currpage*pageper;i++){
      if(i < uparr.length ){
        currarr.push(uparr[i]);
      }
    }
    // console.log("currarr"+currarr);
    res.locals.list = currarr;
    res.locals.count = uparr.length;
    currarr = [];
    // res.locals.list = uparr;

    res.locals.num = (uparr.length-1)/pageper+1;
    res.render("picture");
  }else{
    console.log("相册album:");
    const album = req.query.album;
    res.locals.album = album;

    // console.log(album);
    startnum = currpage*pageper-pageper;
    console.log("currpage: "+currpage+"  startnum:  "+startnum);

    var albumpics = await Album.find({name,album}).skip(startnum).limit(pageper);
    var currpic = [];
    console.log("查询相册的图片："+await albumpics);
    albumpics.forEach(pic=>{
      currpic = currpic.concat(pic.picture);
    })

    console.log(currpic);

    // var n = xcimglist[name].length;
    var n = await Album.find({name,album}).count();

    console.log("总图片数为"+n);

    // for(var i =currnum*pageper-pageper;i<currnum*pageper;i++){
    //   if(i < n ){
    //     // currarr.push(xcimglist[name][i]);
    //     currarr.push(curr[i]);
    //   }
    // }


    res.locals.list = currpic;
    res.locals.count = n;
    // currarr = [];

    // res.locals.list = xcimglist[name];
    // res.locals.num = (xcimglist[name].length-1)/pageper+1;
    res.locals.num = (n-1)/pageper+1;
    res.render("picture");
  }

});


// 分页
router.get("/page",function(req,res){
  currpage = req.query.num;
  console.log(currpage);
  console.log("@#$%^&*(********************)page 改变*********");
  res.redirect("back");
})

// 查看照片
router.post("/search/:name",function(req,res){
  const filename = req.params.name;
  for(var i=0;i<uparr.lentgh;i++){
    if(uparr[i].originalname.indexOf(filename)!=-1 ){
      res.send("存在");
    }else{
      res.send({errors:"不存在"})
    }
  }


  res.redirect("back");
})


//新增相册中转
router.post("/create",async function(req,res){
  console.log(req.body);
  if(reg.test(req.body.newname)){
    // if(xclist.indexOf(req.body.newname) === -1){
      xclist.push(req.body.newname);
      console.log("添加成功");
      xcimglist[req.body.newname] = [];

      const newalbum = new AlbumList({
        name:req.session.user.loginname,
        album:req.body.newname,
        createTime:new Date(),
        updateTime:new Date(),
      });

      await newalbum.save();

    // }
  }
  console.log("相册列表为："+await AlbumList.find());
  res.send("");
  // res.redirect("back");

});

// 删除相册
router.get("/del",async function(req,res){
  console.log("del");
  xclist.splice(xclist.indexOf(req.query.album),1);

  const album = req.query.album;
  const name = req.session.user.loginname;
  console.log("delete album:"+album);

  await AlbumList.remove({name,album});
  await Album.remove({name,album});

  res.redirect("back");
})



//自动分类，可根据类型或时间
// router.get("/travel",function(req,res){
//   res.locals.list = travelarr;
//   res.render("picture");
// });
//
// router.get("/people",function(req,res){
//   res.locals.list = peoplearr;
//   res.render("picture");
// });
//
// router.get("/food",function(req,res){
//   res.locals.list = foodarr;
//   res.render("picture");
// });


router.get("/img/:filename",function(req,res){
  //读取
  console.log("读取"+req.params);

  let rs = fs.createReadStream("upload/"+req.params.filename);

  rs.pipe(res);
});



// 上传图片
router.post("/up2",async function(req,res){
  console.log("上传图片" );
  const pics = [];

  console.log(typeof(req.body.pics));
  // var p = JSON.parse(req.body.pics);

  // for(var file of req.body.pics){
  //   file.createTime = new Date();
  //   // uparr.push(file);
  //   // pics.push(file.filename);
  //   pics.push(file);
  //   console.log(file);
  //   console.log(pics);
  // }

  // if( name == 'default'){
    imgarr = xcimglist.default;
    imgarr.push(file);
    xcimglist.default =  imgarr;
    for(var file of req.body.pics){
      var p = {};
      p.filename = file.filename;
      p.originalname = file.originalname;
      p.createTime = new Date();
      const album = new Album({
        name:req.session.user.loginname,
        album:req.session.album,
        picture:p,
        createTime:new Date(),
        updateTime:new Date(),
      });
      await album.save();
    }


    console.log(await Album.find());
    console.log("上传成功");



  // }

  // else{
  //   imgarr = xcimglist[name];
  //   console.log("imgarr" + imgarr);
  //   imgarr.push(file);
  //   xcimglist[name] = imgarr;
  //
  //   // const album = new Album({
  //   //   album:name,
  //   //   picture:pics,
  //   //   createTime:new Date(),
  //   //   updateTime:new Date(),
  //   // });
  //
  //   // await album.save();
  //   // console.log("*******************up to "+name+"arr");
  // }

  res.redirect("back");
  // res.send("");
})


// router.post("/up3",field,function(req,res){
//   res.send(req.files);
// })

router.post("/xhrup",arr,function(req,res){
  console.log(req.files);

  res.send(req.files);

});



module.exports = router;
