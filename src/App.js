import React, { Component } from 'react';
import './App.css';
import TableComponent from './TableComponent';

class App extends Component {
  constructor() {
    super();
    this.state = {
      products:
      [
        {
          firstName: "birthday",
          lastName: "church",
          progress: 58,
          visits: 74,
          status: "complicated"
        },
        {
          firstName: "stan",
          lastName: "yossss",
          progress: 20,
          visits: 88,
          status: "lol"
        },
        {
          firstName: "Lor",
          lastName: "Ken",
          progress: 21,
          visits: 2,
          status: "active"
        }
      ]
    }
  }

  render() {
    const { products, data } = this.state;
    return (
      <div className="App">
        <TableComponent products={products} data={data}/>
      </div>
    );
  }
}

export default App;
