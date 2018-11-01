import React, { Component } from 'react';
import ReactTable from "react-table";
import "react-table/react-table.css";

class TableComponent extends Component {
  constructor() {
    super();
    this.state = {
    };
    this.importData = this.importData.bind(this);
  }

  importData(e) {
    e.preventDefault();
    console.log("preseed");
  }

  render() {
    const { products } = this.props;
    return (
      <div className="container">
      <h2>The product table</h2>
        <ReactTable
          data={products}
          columns={[
            {
              Header: "First Name",
              accessor: "firstName"
            },
            {
              Header: "Last Name",
              id: "lastName",
              accessor: d => d.lastName
            },
            {
              Header: "Visits",
              accessor: "visits"
            },
            {
              Header: "Status",
              accessor: "status"
            }
          ]}
          filterable={true}
          // resolveData={data => data.filter(item => item.visits > 80)}
          defaultPageSize={10}
          className="-striped -highlight"
        />
        <button type="button" onClick={e => this.importData(e)}>IMPORT</button>
      </div>
    );
  }
}

export default TableComponent;