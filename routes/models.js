const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:/test",{userMongoClient:true});
mongoose.Promise = Promise;

const Users = mongoose.model("Users",{
  loginname:String,
  password:String,
  name:String,
  createTime:Date,
  updateTime:Date
});

const Article = mongoose.model("Article",{
  author:String,
  title:{type:String, maxlength:[20,"文章标题不能超过20位"]},
  body:String,
  createTime:Date,
  updateTime:Date,
  accessNum:Number,
  loveNum:Number
});

const Messages = mongoose.model("Messages",{
  name:String,
  title:String,
  id:String,
  message:String,
  createTime:Date,
  updateTime:Date
});

const Loves = mongoose.model("Loves",{
  name:String,
  id:String,
  loveNum:Number
});

const Picture = mongoose.model("Picture",{
    fieldname: String,
    originalname: String,
    encoding: String,
    mimetype: String,
    destination: String,
    filename: String,
    path: String,
    size: Number
});

const Product = mongoose.model("Product",{
    title: String,
    description: String,
    price: String,
    picture:[],
    createTime:Date,
    updateTime:Date
});

const Chat = mongoose.model("Chat",{
  name:String,
  chat:String,
  createTime:Date
});

const Album = mongoose.model("Album",{
    name:String,
    album: String,
    picture:[],
    createTime:Date,
    updateTime:Date
});

const AlbumList = mongoose.model("AlbumList",{
  name:String,
  album:String,
  createTime:Date,
  updateTime:Date
});

module.exports.Users = Users;
module.exports.Article = Article;
module.exports.Messages = Messages;
module.exports.Loves = Loves;
module.exports.Picture = Picture;
module.exports.Product = Product;
module.exports.Chat = Chat;
module.exports.Album = Album;
module.exports.AlbumList = AlbumList;
// module.exports = Users;
