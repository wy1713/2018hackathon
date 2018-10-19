const express = require('express');
const os = require('os');
//need express for server rendering
const app = express();
const server = require('http').createServer(app);
//set the socket.io
const io = require('socket.io')(server);

const getLatestData = (socket)=>{
  //replace this with server callback
  let data = Math.random();

  socket.emit("dataArrive", data);
}

app.use(express.static('dist'));
app.get('/api/getUsername', (req, res) => res.send({ username: os.userInfo().username }));
server.listen(8080, () => console.log('Listening on port 8080!'));

io.on("connection", socket => {
  console.log("New client connected"+socket.id);
  //fire event
  setInterval(()=> getLatestData(socket), 1000);
  socket.on("disconnect", () => console.log("Client disconnected"));
});
