import React, { Component } from "react";


export class Signin extends Component {
    constructor(props) {
      super(props);

      this.handleEmailChange = this.handleEmailChange.bind(this);
      this.handlePasswordChange = this.handlePasswordChange.bind(this);
      this.state = {
        email:'',
        password:''
      };
    }

    handleEmailChange(e){
      this.setState({email:e.target.value})
    }
    handlePasswordChange(e){
      this.setState({password:e.target.value})
    }
    render() {
      return (
        <div>
          <form className="form-signin" method ="post" action = '/signin'>
            <h2 className="form-signin-heading">Please sign in</h2>
            <label htmlFor="email" className="sr-only">Email address</label>
            <input type="email" id="email" name="email" className="form-control" placeholder="Email address" required autocomplete="new-password" />
            <label htmlFor="password" className="sr-only">Password</label>
            <input type="password" autocomplete="new-password" id="password" name="password" className="form-control" placeholder="Password" required />

            <button className="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
          </form>

        </div>

      )
    }
}

export class Signup extends Component{
  render() {
      return (
        <div>
          <form className="form-signin" method ="post" action ='/signup'>
            <h2 className="form-signin-heading">Please sign up</h2>

            <label htmlFor="email" className="sr-only">Email address</label>
            <input type="email" autocomplete="new-password" id="email" name = "email" className="form-control" placeholder="Email address" required  />
            <label htmlFor="password" className="sr-only">Password</label>
            <input type="password" autocomplete="new-password" id="password" name="password" className="form-control" placeholder="Password" required />

            <button className="btn btn-lg btn-primary btn-block"  type="submit">Sign up</button>
          </form>

        </div>

      )
    }
}