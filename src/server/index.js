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

function getList () {
  const n = 20000;
  const list = [];
  for (let i = 0; i < n; i += 1) {
    list.push({name: "User " + (i+1)});
  }
  return list;
}

function getHtml (list) {
  var content = '<div style="text-align: center"> <h1>SSR (Server Side Rendering)</h1><h1>List</h1><ul>';
  list.map(function (i) {
    content += '<li>' + i.name + '</li>';
  });
  content += '</ul></div>';
  return content;
}

app.use(express.static('dist'));
app.get('/ssr', (req, res) => res.send(getHtml(getList())));
app.get('/api/getList', (req, res) => res.send({ list: getList() }));
server.listen(8080, () => console.log('Listening on port 8080!'));

io.on("connection", socket => {
  console.log("New client connected"+socket.id);
  //fire event
  setInterval(()=> getLatestData(socket), 1000);
  socket.on("disconnect", () => console.log("Client disconnected"));
});
