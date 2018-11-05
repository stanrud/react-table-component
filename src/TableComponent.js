import React, { Component } from 'react';
import ReactTable from "react-table";
import XLSX from 'xlsx';
import "react-table/react-table.css";
import './styles/styles.scss';

let toastr = require('toastr');

class TableComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
			data: this.props.products,
      cols: [],
      headers: [],
      dataImport: [],
      filters: []
    };
    this.importFile = this.importFile.bind(this);
    this.exportFile = this.exportFile.bind(this);
  }

  componentDidMount() {
    const { products } = this.props;
    if (products && products.length > 0) {
      let tableHeaders = Object.keys(products[0]);
      let tableData = [];
      products.map((item) => {
        tableData.push(Object.values(item));
      });
      this.setState(prevState => ({
        // data: [...prevState.data, ...tableData],
        headers: [...this.state.headers, ...tableHeaders]
      }));
    }
  }

  /**
   * Import from workbook 
   * @param  {} file
   */
  importFile(file) {
    const { headers } = this.state;
		// Boilerplate to set up FileReader
		const reader = new FileReader();
		const rABS = !!reader.readAsBinaryString;
		reader.onload = (e) => {
			// Parse data
			const bstr = e.target.result;
			const wb = XLSX.read(bstr, {type:rABS ? 'binary' : 'array'});
			// Get first worksheet
      const wsname = wb.SheetNames[0];
			const ws = wb.Sheets[wsname];
			// Convert array of arrays
      const importData = XLSX.utils.sheet_to_json(ws);

      if (importData && importData.length > 0) {
        let importDataHeaders = Object.keys(importData[0]);
        if (importDataHeaders.length === headers.length
          && importDataHeaders.every((value, index) => value === headers[index])) {
            // Update state     
            this.setState({ data: [...this.state.data, ...importData], cols: make_cols(ws['!ref']) });
            toastr.success("Data successfully added");
          } else {
            toastr.error("Incorrect file structure");
          }
      } else {
        toastr.error("File is empty");
      }
		};
		if(rABS) reader.readAsBinaryString(file); else reader.readAsArrayBuffer(file);
  }
  
  /**
   * Export to workbook 
   */
  exportFile() {
    const { headers } = this.state;
    const currentRecords = this.selectTable.getResolvedState().sortedData.map(item => item._original);
		// convert state to workbook
		const ws = XLSX.utils.json_to_sheet(currentRecords, {header: headers});
		const wb = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, "SheetJS");
		// generate XLSX file and send to client
		XLSX.writeFile(wb, "sheetjs.xlsx");
  };

  /**
   * Non case sensitive manual Filtering 
   * @param {*} filter 
   * @param {*} row 
   */
  filterCaseInsensitive(filter, row) {
    const id = filter.pivotId || filter.id;
    return (
      row[id] !== undefined ? String(row[id].toLowerCase()).includes(filter.value.toLowerCase()) : true
    );
  }

  render() {
    const { data } = this.state;
    return (
      <div className="container">
        <DragDropFile importFile={this.importFile}>
          <div className="btn-container">
            <DataInput importFile={this.importFile} />
            <h1 className="title">React-table component</h1>
            <button disabled={!data.length} className="btn-export" onClick={this.exportFile}>
              <i className="fa fa-table" style={{ fontSize: 36, marginRight: 10 }}></i> => 
              <i className="fa fa-file-excel-o" style={{ fontSize: 32, marginLeft: 10 }}></i>
            </button>
          </div>
        </DragDropFile>
        <ReactTable
          data={data}
          onFilteredChange={(filters, column) => {console.log(column);}}
          ref={(r) => {this.selectTable = r;}}
          defaultFilterMethod={this.filterCaseInsensitive}
          columns={[
            {
              Header: "Product Name",
              accessor: "product_name"
            },
            {
              Header: "Manufacturer",
              id: "manufacturer",
              accessor: d => d.manufacturer
            },
            {
              Header: "Model",
              accessor: "model"
            },
            {
              Header: "Description",
              accessor: "description"
            },
            {
              Header: "Color",
              accessor: "color"
            },
            {
              Header: "Package Quantity",
              accessor: "package_quantity"
            },
            {
              Header: "Size",
              accessor: "size"
            },
            {
              Header: "Weight",
              accessor: "weight"
            },
            {
              Header: "Width",
              accessor: "width"
            },
            {
              Header: "Height",
              accessor: "height"
            },
            {
              Header: "Length",
              accessor: "length"
            },
            {
              Header: "Category",
              accessor: "category"
            }
          ]}
          filterable
          // resolveData={data => data.filter(item => item.visits > 80)}
          defaultPageSize={15}
          className="-striped -highlight"
        />
      </div>
    );
  }
}

/**
 * Simple HTML5 file drag-and-drop wrapper
 * usage: <DragDropFile importFile={importFile}>...</DragDropFile>
 * importFile(file:File):void;
 */
class DragDropFile extends React.Component {
	constructor(props) {
		super(props);
		this.onDrop = this.onDrop.bind(this);
	};
	suppress(evt) { evt.stopPropagation(); evt.preventDefault(); };
	onDrop(evt) { evt.stopPropagation(); evt.preventDefault();
		const files = evt.dataTransfer.files;
		if(files && files[0]) this.props.importFile(files[0]);
	};
	render() {
    return (
      <div onDrop={this.onDrop} onDragEnter={this.suppress} onDragOver={this.suppress}>
        {this.props.children}
      </div>
    );
  };
};

 /**
  * Simple HTML5 file input wrapper
  * usage: <DataInput importFile={callback} />
  * importFile(file:File):void;
  */
class DataInput extends React.Component {
	constructor(props) {
		super(props);
		this.handleChange = this.handleChange.bind(this);
	};
	handleChange(e) {
		const files = e.target.files;
		if(files && files[0]) this.props.importFile(files[0]);
	};
	render() { 
    return (
      <form className="form-inline">
        <div className="form-group">
          <input type="file" className="btn-import" id="file" accept={SheetJSFT} onChange={this.handleChange} />
          <label htmlFor="file">
            <i className="fa fa-file-excel-o" style={{ fontSize: 32, marginRight: 10 }}></i> =>
            <i className="fa fa-table" style={{ fontSize: 36, marginLeft: 10 }}></i>
          </label>
        </div>
      </form>
    ); 
  };
}

/**
 * list of supported file types
 */
const SheetJSFT = [
	"xlsx", "xlsb", "xlsm", "xls", "xml", "csv", "txt", "ods", "fods", "uos", "sylk", "dif", "dbf", "prn", "qpw", "123", "wb*", "wq*", "html", "htm"
].map(function(x) { return "." + x; }).join(",");

/**
 * generate an array of column objects
 * @param {*} refstr 
 */
const make_cols = refstr => {
	let o = [], C = XLSX.utils.decode_range(refstr).e.c + 1;
	for(var i = 0; i < C; ++i) o[i] = {name:XLSX.utils.encode_col(i), key:i}
	return o;
};

toastr.options = { "positionClass": "toast-bottom-full-width" }

export default TableComponent;