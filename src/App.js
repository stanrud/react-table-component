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
          status: "complicated",
          visits: 74
        },
        {
          firstName: "stan",
          lastName: "yossss",
          progress: 20,
          status: "lol",
          visits: 88
        },
        {
          firstName: "Lor",
          lastName: "Ken",
          progress: 21,
          status: "active",
          visits: 2
        }
      ],
      data: [["stan", "rud", 20, "active", 40], ["lep", "kool", 33, "active", 12], ["ddd", "aaa", 34, "non", 1]]
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
