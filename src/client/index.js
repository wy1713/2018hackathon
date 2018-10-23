import React from 'react';
import {Link, Route, BrowserRouter as Router} from 'react-router-dom';
import ReactDOM from 'react-dom';
import {Signin, Signup} from './Login';
import App from './App';

ReactDOM.render(
    <Router >
      <div>

        <Link to="/">Sign In</Link><span> </span>
        <Link to="/signup">Sign Up</Link><span> </span>
        <Link to="/ssr">Server Side</Link><span> </span>
        <Link to="/csr">Client Side</Link><span> </span>
        <Route component={Signin} path="/" exact></Route>
        <Route component={Signup} path="/signup"></Route>

      </div>
    </Router>
   ,
document.getElementById('root'));

