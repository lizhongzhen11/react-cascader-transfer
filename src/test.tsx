import React from "react";
import ReactDOM from "react-dom";
import ReactCascaderTransfer from './index'
import './test.css'
import city from './config/city'

ReactDOM.render(
  <ReactCascaderTransfer dataSource={city} titles={['省级', '市级']} value={['11', '120103', '513300']} />,
  document.getElementById("root")
);