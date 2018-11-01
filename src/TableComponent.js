import React, { Component } from 'react';
import ReactTable from "react-table";
import XLSX from 'xlsx';
import "react-table/react-table.css";

class TableComponent extends Component {
  constructor() {
    super();
    this.state = {
			data: [],
			cols: []
    };
    this.importFile = this.importFile.bind(this);
    this.exportFile = this.exportFile.bind(this);
  }

  componentDidMount() {
    const { products } = this.props;
    if (products && products.length > 0) {
      let tableHeaders = [];
      let tableData = [];
      products.map((item) => {
        tableHeaders = Object.keys(item); //Reapiting assignment
        tableData.push(Object.values(item));
      });
      this.setState({ data: [...this.state.data, tableData], cols: [...this.state.cols, tableHeaders] });
    }
  }

  /* import from workbook */
  importFile(file) {
    console.log(this.state);
		/* Boilerplate to set up FileReader */
		const reader = new FileReader();
		const rABS = !!reader.readAsBinaryString;
		reader.onload = (e) => {
			/* Parse data */
			const bstr = e.target.result;
			const wb = XLSX.read(bstr, {type:rABS ? 'binary' : 'array'});
			/* Get first worksheet */
			const wsname = wb.SheetNames[0];
			const ws = wb.Sheets[wsname];
			/* Convert array of arrays */
			const data = XLSX.utils.sheet_to_json(ws, {header:1});
			/* Update state */
      this.setState({ data: data, cols: make_cols(ws['!ref']) });
      console.log(this.state);
		};
		if(rABS) reader.readAsBinaryString(file); else reader.readAsArrayBuffer(file);
  }

  /* export to workbook */
  exportFile() {
		/* convert state to workbook */
		const ws = XLSX.utils.aoa_to_sheet(this.props.data);
		const wb = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, "SheetJS");
		/* generate XLSX file and send to client */
		XLSX.writeFile(wb, "sheetjs.xlsx")
  };

  render() {
    const { products, data } = this.props;
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
        <DragDropFile importFile={this.importFile}>
          <div className="row"><div className="col-xs-12">
            <DataInput importFile={this.importFile} />
          </div></div>
          <div className="row"><div className="col-xs-12">
            <button disabled={!this.props.data.length} className="btn btn-success" onClick={this.exportFile}>Export</button>
          </div></div>
          <div className="row"><div className="col-xs-12">
            {/* <OutTable data={this.state.data} cols={this.state.cols} /> */}
          </div></div>
        </DragDropFile>
      </div>
    );
  }
}

/*
  Simple HTML5 file drag-and-drop wrapper
  usage: <DragDropFile importFile={importFile}>...</DragDropFile>
    importFile(file:File):void;
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
/*
  Simple HTML5 file input wrapper
  usage: <DataInput importFile={callback} />
    importFile(file:File):void;
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
          <label htmlFor="file">Import Spreadsheet</label>
          <input type="file" className="form-control" id="file" accept={SheetJSFT} onChange={this.handleChange} />
        </div>
      </form>
    ); 
  };
}

/* list of supported file types */
const SheetJSFT = [
	"xlsx", "xlsb", "xlsm", "xls", "xml", "csv", "txt", "ods", "fods", "uos", "sylk", "dif", "dbf", "prn", "qpw", "123", "wb*", "wq*", "html", "htm"
].map(function(x) { return "." + x; }).join(",");

/* generate an array of column objects */
const make_cols = refstr => {
	let o = [], C = XLSX.utils.decode_range(refstr).e.c + 1;
	for(var i = 0; i < C; ++i) o[i] = {name:XLSX.utils.encode_col(i), key:i}
	return o;
};

export default TableComponent;