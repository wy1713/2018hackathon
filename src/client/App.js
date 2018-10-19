import React, { Component } from 'react';
import './app.css';

import socketIOClient from "socket.io-client";

export default class App extends Component {
  /*
  constructor() {
      super();
      this.state = {
        endpoint: "http://127.0.0.1:8080"
      };
    }
    */

  state = { list: null };

  componentDidMount() {
    /*
    const { endpoint } = this.state;
    const socket = socketIOClient(endpoint);
    //listen event
    socket.on("dataArrive", data=>
      this.setState({
        username:data
      })
    )
    */
    fetch('/api/getList')
      .then(res => res.json())
      .then(data => this.setState({ list: data.list }));
  }

  render() {
    const { list } = this.state;
    return (
      <div>
        <h1>CSR</h1>
        {list ? <h1>List</h1> : <h1>Loading.. please wait!</h1>}
        {list ? (
                  <ul>
                    {list.map(i => <li>{i.name}</li>)}
                  </ul>
                ) : null
        }

      </div>
    );
  }
}
