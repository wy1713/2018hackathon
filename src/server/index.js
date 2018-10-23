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
const GitHubStrategy = require('passport-github2').Strategy;
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

passport.use(new GitHubStrategy({
    clientID: "fe5cfbe9ef137bf0ac40",
    clientSecret: "de5358a7d4c73c3cdb29e58eedc5d61944b7d899",
    callbackURL: "http://localhost:8080/auth/github/callback"
  },
  function(req, accessToken, refreshToken, profile, done) {
    if (req.user) {
       User.findOne({ github: profile.id }, (err, existingUser) => {
         if (existingUser) {

           done(err);
         } else {
           User.findById(req.user.id, (err, user) => {
             if (err) { return done(err); }
             user.github = profile.id;
             user.tokens.push({ kind: 'github', accessToken });

             user.save((err) => {
               req.flash('info', { msg: 'GitHub account has been linked.' });
               done(err, user);
             });
           });
         }
       });
     } else {
       User.findOne({ github: profile.id }, (err, existingUser) => {
         if (err) { return done(err); }
         if (existingUser) {
           return done(null, existingUser);
         }
         User.findOne({ email: profile._json.email }, (err, existingEmailUser) => {
           if (err) { return done(err); }
           if (existingEmailUser) {
             req.flash('errors', { msg: 'There is already an account using this email address. Sign in to that account and link it with GitHub manually from Account Settings.' });
             done(err);
           } else {
             const user = new User();
             user.email = profile._json.email;
             user.github = profile.id;
             user.tokens.push({ kind: 'github', accessToken });

             user.save((err) => {
               done(err, user);
             });
           }
         });
       });
     }
  }
));


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
app.get('/auth/github',
  passport.authenticate('github', { scope: [ 'user:email' ] }),
  function(req, res){
    // The request will be redirected to GitHub for authentication, so this
    // function will not be called.
  });
app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/myaccount');
});