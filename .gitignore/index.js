var express = require("express");
var app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views","./views");
var server = require("http").Server(app);
var io = require("socket.io")(server);
server.listen(process.env.PORT || 3000);

const arrUserInfo = [];

io.on('connection', socket => {
  socket.on("client-send-username", function(data){
    socket.peerId = data.peerId;
    if(arrUserInfo.some(e => e.name === data.name)){
      //dang ky that bai
      socket.emit("server-send-dangky-thatbai");
    }else{
      //dang ky thanh cong
      arrUserInfo.push(data);
      //tao username cho cac user
      socket.emit("server-send-dangky-thanhcong",data);

      //phat tat ca moi nguoi danh sach Online
      io.sockets.emit("server-send-danhsach-users",arrUserInfo);
    }
  });
  socket.on('disconnect',() => {
    const index = arrUserInfo.findIndex(user => user.peerId === socket.peerId);
    arrUserInfo.splice(index,1);
    io.emit("user-disconnect",socket.peerId);
  });
});
app.get("/", (req, res) => res.render("index"));
