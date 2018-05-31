var express = require("express");
var app = express();
var fs = require("fs");
var http = require("http").Server(app);
var io = require("socket.io")(http);

var session = require("express-session");
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}))

app.use(express.static("./public"));
//设置模板引擎
app.set("view engine","ejs");
//首页，登录
app.get("/",function (req,res,next) {
    res.render("index");
})
//必须登录，进入聊天室
var allUser=[];
app.get("/check",function (req,res,next) {
    var username = req.query.username;
    if(allUser.indexOf(username) != -1) {
       res.send("用户名已存在");
    }
    req.session.username = username;
    res.redirect("/chat");
})
app.get("/chat",function (req,res,next) {
    if(! req.session.username) {
         res.redirect("/");
    }
    res.render("chat",{
        "username": req.session.username
    });
})
//websocket 业务
io.on("connection",function (socket) {
    // console.log("一个连接已经建立");
    socket.on("fasong",function (msg) {
        io.emit("yingda",msg);
    })
})




http.listen(3000);