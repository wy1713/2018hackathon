const express = require('express');
const rp = require('request-promise');
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
};

function getHtml (list) {
  var content = '<div style="text-align: center"> <a href="http://localhost:3000/">CSR (Client Side Rendering)</a> <h1>SSR (Server Side Rendering)</h1><h1>List</h1><ul>';
  list.list.map(function (i) {
    content += '<li>' + i.name + '</li>';
  });
  content += '</ul></div>';
  return content;
}

const url = "https://us-central1-api-project-844570496919.cloudfunctions.net/getList";
app.use(express.static('dist'));
app.get('/ssr', (req, res) => rp(url).then(function(result){
  res.send(getHtml(JSON.parse(result)));
}));
app.get("/api/getList", (req, res) => rp(url).then(function (result) {
    res.send(JSON.parse(result));
  }));
server.listen(8080, () => console.log('Listening on port 8080!'));

io.on("connection", socket => {
  console.log("New client connected"+socket.id);
  //fire event
  setInterval(()=> getLatestData(socket), 1000);
  socket.on("disconnect", () => console.log("Client disconnected"));
});
