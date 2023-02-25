const express = require("express");
const app = express();
const { Server } = require("socket.io");
const port = process.env.PORT || 9800;
const http = require("http").createServer(app)
  ;
const cors = require("cors");
const { json } = require("express");


const io = new Server(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }))


app.get("/", (req, res) => {
  res.status(200).send({
    success: true,
    message: "welcome to the beginning of greatness",
  });
});


//Li

app.use(cors())




let broadcaster;

io.sockets.on("connection", socket => {


  //broadcaster akan create ID ketika memulai siaran

  socket.on("broadcaster", () => {

    broadcaster = socket.id


  })

  //ketika penonton membuka screen untuk menonton maka penonton akan mengirimkan id socket kepada broadcaster

  socket.on("watcher", () => {

    socket.to(broadcaster).emit("watcher", socket.id)

  })

  //ketika mendapatkan id penonton maka broadcaster akan mengirimkan offer kepada penonton

  socket.on("offer", (watcherID, sdp) => {

    socket.to(watcherID).emit("offer", socket.id , sdp)
    console.log(watcherID)


  })

  socket.on("answer", (broadcasterID,answer)=> {

    socket.to(broadcasterID).emit("answer",answer)
    console.log("answer",answer)

  })


  socket.on("candidate",(wactherID,candidate)=>{
    socket.to(wactherID).emit("candidate",candidate)
    console.log("wacther",wactherID)
    console.log("candidate",candidate)
 
  })

});


//Listen the HTTP Server 
http.listen(port, () => {
  console.log("Server Is Running Port: " + port);
});