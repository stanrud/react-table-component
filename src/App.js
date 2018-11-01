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
          product_name: "Apple iPhone X",
          manufacturer: "Apple",
          model: "iPhone X",
          description: "Some sedcription about this model",
          color: "black",
          package_quantity: 99,
          size: "120x80",
          weight: "200g",
          width: "150",
          height: "100",
          length: "133",
          category: "phones"
        },
        {
          product_name: "Samsung S9",
          manufacturer: "Samsung",
          model: "S9",
          description: "Some sedcription about this model",
          color: "white",
          package_quantity: 129,
          size: "150x90",
          weight: "190g",
          width: "160",
          height: "140",
          length: "154",
          category: "phones"
        },
        {
          product_name: "Nintendo Switch",
          manufacturer: "Nintendo",
          model: "Switch 1000H",
          description: "Some sedcription about this model",
          color: "grey",
          package_quantity: 20,
          size: "290x88",
          weight: "400g",
          width: "1080",
          height: "720",
          length: "300",
          category: "consoles"
        },
      ]
    }
  }

  render() {
    const { products, data } = this.state;
    return (
      <div className="App">
        <TableComponent products={products} />
      </div>
    );
  }
}

export default App;
