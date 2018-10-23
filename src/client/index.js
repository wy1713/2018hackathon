import React from "react";
import { Link, Route, BrowserRouter as Router } from "react-router-dom";
import ReactDOM from "react-dom";
import { Signin, Signup } from "./Login";
import CSR from "./CSR";

ReactDOM.render(
  <Router>
    <div>
      <a href="http://localhost:8080/ssr">Server-side Rendering</a>
      <br />
      <Link to="/csr">Client-side Rendering</Link>
      <br />
      <Link to="/">Sign In</Link>
      <br />
      <Link to="/signup">Sign Up</Link>
      <br />
      <Route component={CSR} path="/csr" />
      <Route component={Signin} path="/" exact />
      <Route component={Signup} path="/signup" />
    </div>
  </Router>,
  document.getElementById("root")
);
