
const React = require('react');
const ReactDomServer = require('react-dom/server');

const Account = require('../client/Account');

const User = require('../models/User');
const passport = require('passport');

exports.getUsers = (req, res) => {
  User.find().exec((err, users) => {
     if (err) {
       res.status(500).send(err);
     }
     res.json({ users });
   });
};

exports.deleteUser = (req, res)=>{
  User.findOne({ email: req.params.email }).exec((err, user) => {
    if (err) {
      res.status(500).send(err);
    }

    user.remove(() => {
      res.status(200).end();
    });
  });
}

exports.getLogin = (req, res) => {
  if (req.user) {
    return res.redirect('/signin');
  }
  res.render('account/login', {
    title: 'Login'
  });
};

/**
 * POST /login
 * Sign in using email and password.
 */
exports.postLogin = (req, res, next) => {

  passport.authenticate('local', (err, user, info) => {
    if (err) { return next(err); }
    if (!user) {

      return res.redirect('/');
    }
    console.log("successfully sign in");
    req.logIn(user, (err) => {
      if (err) { return next(err); }
      //req.flash('success', { msg: 'Success! You are logged in.' });
      console.log("redirect");
      res.redirect('/myaccount');
    });
  })(req, res, next);
};

/**
 * GET /logout
 * Log out.
 */
exports.logout = (req, res) => {
  req.logout();
  req.session.destroy((err) => {
    if (err) console.log('Error : Failed to destroy the session during logout.', err);
    req.user = null;
    res.redirect('/');
  });
};

/**
 * GET /signup
 * Signup page.
 */
exports.getSignup = (req, res) => {
  if (req.user) {
    return res.redirect('/');
  }
  res.render('/signup', {
    title: 'Create Account'
  });
};

/**
 * POST /signup
 * Create a new local account.
 */
exports.postSignup = (req, res, next) => {
  console.log(req.body);
  console.log(req.body.password);

  const user = new User({
    email: req.body.email,
    password: req.body.password
  });

  User.findOne({ email: req.body.email }, (err, existingUser) => {
    if (err) { return next(err); }
    if (existingUser) {
      //req.flash('errors', { msg: 'Account with that email address already exists.' });
      return res.redirect('/signup');
    }
    user.save((err) => {
      if (err) { return next(err); }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        res.redirect('/');
      });
    });
  });
};

const template =({ body, title }) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
     
      </head>
      
      <body>
        <div id="root">${body}</div>
      </body>
      
      <script src="/dist/bundle.js"></script>
    </html>
  `;
};

exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  console.log("password wrong");
  res.redirect("/");
}

exports.getAccount = (req, res) => {
  const myaccount = "<div>your account information</div>";

    res.send(template({
      body: myaccount,
      title: 'Hello World from the server'
    }));
};
