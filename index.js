var express = require('express')
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
let port = process.env.PORT || 5000

var roomno = 1;

server.listen(port, function(){
  console.log('listening on localhost:'+port);
});
app.use(express.static('public'));

  io.on('connection', function (socket) {
    socket.join("room-"+roomno);
    //Send this event to everyone in the room.
    io.sockets.in("room-"+roomno).emit('connectToRoom', "You are in room no. "+roomno);
    console.log("connect", socket.id)
    //  console.log("socket.rooms.length", socket.rooms.length, socket.rooms);
    // console.log("io rooms", Object.keys(io.sockets.adapter.rooms))
    let rooms = findRooms()
    console.log(rooms)
    io.emit('rooms', rooms)
    socket.emit('message', {
      msg: "You're connected!"
    });
    // socket.on('message', function (data) {
    //   console.log(data);
    //   socket.broadcast.emit('message', data);
    // });
    //
    socket.on('create', function (data) {
      console.log("creation", data);
      socket.join(data.name);
      let rooms = findRooms()
      console.log(rooms)
      io.emit('rooms', rooms)
      //  console.log(io)
      //  socket.broadcast.emit('message', data);
    });
    socket.on('joinRoom', function(data){
      socket.join(data);
      let rooms = findRooms()
      console.log(rooms)
      io.emit('rooms', rooms)
    })
    // socket.on('getRooms', function() {
    //   //let rooms io.sockets.adapter.rooms
    //     let rooms_ids = Object.keys(io.sockets.adapter.rooms)
    //     console.log("ids", rooms_ids)
    //     socket.emit('rooms', io.sockets.adapter.rooms);
    // });

    socket.on("disconnecting", () => {
      console.log(socket.rooms);
      socket.leave("room-"+roomno);
      // the Set contains at least the socket ID
    });
    socket.on("disconnect", () => {
      console.log("disconnect", socket.id)
      console.log(socket.rooms);
      // socket.rooms.size === 0
    });
  });

  io.of("/").adapter.on("create-room", (room) => {
    console.log(`room ${room} was created`);
  });
  io.of("/").adapter.on("join-room", (room, id) => {
    console.log(`socket ${id} has joined room ${room}`);
    //io.emit('rooms', `socket ${id} has joined room ${room}`)

  });


  io.of("room-1").adapter.on("join-room", (room, id) => {
    console.log(`socket ${id} has joined room ${room}`);
    io.emit('rooms', `socket ${id} has joined room ${room}`)
  });

  function findRooms() {
    var availableRooms = [];
    var rooms = io.sockets.adapter.rooms;
    // console.log("rrrr", rooms)
    for (let [key, value] of rooms) {
      // console.log(key + " = " + value);
      let users = []
      const clients = io.sockets.adapter.rooms.get(key);
      // console.log(clients)
      // let socks = []
      for (let c of clients) {
        // console.log('----------'+c);
        users.push(c)
      }

      availableRooms.push({key: key, users: users});
    }
    // if (rooms) {
    //     for (var room in rooms) {
    //         if (!rooms[room].hasOwnProperty(room)) {
    //             availableRooms.push(room);
    //         }
    //     }
    // }
    console.log("rooms",availableRooms)
    return availableRooms;
  }
