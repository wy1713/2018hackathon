const express = require('express');
const path = require('path');
const ReactDomServer = require('react-dom/server');
const rp = require('request-promise');
const os = require('os');
//need express for server rendering
const app = express();
const session = require('express-session');
const server = require('http').createServer(app);
const bodyParser = require('body-parser');
const mongoose = require ('mongoose');
const passport = require ('passport');
const User = require('../models/User');
const { Strategy: LocalStrategy } = require('passport-local');
const userController = require ('./userController');

mongoose.connect('mongodb://localhost:27017/2018hackathon', (error) => {
    if (error) {
      console.error('Please make sure Mongodb is installed and running!'); // eslint-disable-line no-console
      throw error;
    }
    console.log("mongodb connected");
});

function getHtml (list) {
  var content = '<div style="text-align: center"> <a href="http://localhost:3000/">CSR (Client Side Rendering)</a> <h1>SSR (Server Side Rendering)</h1><h2>- React, Next, Express, Node.js, FAAS</h2><h2>List (20,000 Items from Serverless Cloud FAAS)</h2><ul>';
  list.list.map(function (i) {
    content += '<li>' + i.name + '</li>';
  });
  content += '</ul></div>';
  return content;
}

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
  User.findOne({ email: email.toLowerCase() }, (err, user) => {
    if (err) { return done(err); }
    if (!user) {
      return done(null, false, { msg: `Email ${email} not found.` });
    }
    user.comparePassword(password, (err, isMatch) => {
      if (err) { return done(err); }
      if (isMatch) {
        return done(null, user);
      }
      return done(null, false, { msg: 'Invalid email or password.' });
    });
  });
}));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require('cookie-parser')());
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

app.use(passport.initialize());
app.use(passport.session());

const url = "https://us-central1-api-project-844570496919.cloudfunctions.net/getList";
app.use(express.static('dist'));
app.get('/ssr', (req, res) => rp(url).then(function(result){
  res.send(getHtml(JSON.parse(result)));
}));
app.get("/api/getList", (req, res) => rp(url).then(function (result) {
    res.send(JSON.parse(result));
  }));
server.listen(8080, () => console.log('Listening on port 8080!'));

app.get('/api/users', userController.getUsers);
app.delete ("/api/:email", userController.deleteUser);
app.post('/signin', userController.postLogin);
app.post('/signup', userController.postSignup);
app.get('/myaccount', userController.isAuthenticated, userController.getAccount);