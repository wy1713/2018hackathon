import React, { Component } from 'react';
import './CSR.css';
import Html from './Html';
export default class CSR extends Component {
  state = { list: null };

  componentDidMount() {
    fetch('/api/getList')
      .then(res => res.json())
      .then(data => this.setState({ list: data.list }));
  }

  render() {
    const { list } = this.state;
    return Html({ list });
  }
}
