import React, { Component } from 'react';
import './app.css';

import socketIOClient from "socket.io-client";

export default class App extends Component {
  constructor() {
      super();
      this.state = {
        endpoint: "http://127.0.0.1:8080"
      };
    }

  state = { username: null };

  componentDidMount() {
    const { endpoint } = this.state;
    const socket = socketIOClient(endpoint);
    //listen event
    socket.on("dataArrive", data=>
      this.setState({
        username:data
      })
    )
    fetch('/api/getUsername')
      .then(res => res.json())
      .then(user => this.setState({ username: user.username }));
  }

  render() {
    const { username } = this.state;
    return (
      <div>
        {username ? <h1>{`Hello ${username}`}</h1> : <h1>Loading.. please wait!</h1>}
      </div>
    );
  }
}
