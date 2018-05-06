var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


var index = require('./routes/index');
var users = require('./routes/users');
var product = require('./routes/product');
var message = require('./routes/message');
var article = require('./routes/article');
var config = require('./routes/config');
var chat = require('./routes/chat');
var picture = require('./routes/picture');

var multipart = require('connect-multiparty');

const session = require("express-session");
const FileStore = require('session-file-store')(session);
// const sessionMiddleware = session({
//   store:new FileStore(),
//   secret:'abcdefg',
//   cookie:{maxAge:300000}
// });

var expsession = require("express-session")({
  secret: 'keyboard cat',
  cookie: {
    maxAge: 800000
  }
});

//把 express下的session放到io下 iosession用的
var iosession = require("express-socket.io-session")(expsession);

var app = express();

//app连上了server
var server = require("http").Server(app);

//server 与 socket关联
var io = require("socket.io")(server);
server.listen(3000);
//加上端口号 同时去掉最后的exports

io.use(iosession); //加上 iosession

// let firstSocket;

io.on("connection", function(socket) {

  socket.on("req", function(data, cb) {
    console.log("接受到请求");
    cb(); //表示响应的回调函数
  })

  socket.on("say", data => {
    console.log(socket.handshake.session.num);
    const num = ++socket.handshake.session.num;
    socket.handshake.session.save(); //socket环境下更改数据后对express下的也生效，持久化保存
    // io.emit("newsay",data +"num :"+num);
    // socket.emit("newsay",data+"(创建时间： "+ new Date()+ ")");

    io.emit("newsay", data + "    ( " +
      (new Date().getMonth() + 1) + "月" + new Date().getDate() + "日" + new Date().getHours() + ":" + new Date().getMinutes() +
      ")");

    // io.emit("newsay",data+"    ( "+
    // new Date().getMonth()+1
    // + ")");

  })

  // if(firstSocket){
  //   console.log("firstSocket ===socket : ",firstSocket === socket);
  // }else{
  //   firstSocket = socket;
  // }
  // socket.on("say",data=>console.log(data));
  //
  // socket.emit("welcome","欢迎你");
  // socket.emit("welcome2","hello word");
  // socket.on("question",data=>console.log(data));
});


// app.use(sessionMiddleware);





// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());

app.use(expsession); //为普通的express加上中间件 现在已经不依赖cookie

app.use(express.static(path.join(__dirname, 'public')));

// app.use(multipart({uploadDir:'./temp' }));
// app.use(multipart({uploadDir:'./temp'}));

app.use('/', index);
app.use('/users', users);
app.use('/product', product);
app.use('/message', message);
app.use('/article', article);
app.use('/config', config);
app.use('/chat', chat);
app.use("/lesson19", require("./routes/19"));
app.use('/picture', picture);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;