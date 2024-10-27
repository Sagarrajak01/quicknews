import React, { Component } from 'react';
import Navbar from './Component/Navbar';
import News from './Component/News';

export default class App extends Component {
  render() {
    return (
      <div>
        <Navbar />
        <News pagesize={9} country="us" />
      </div>
    );
  }
}