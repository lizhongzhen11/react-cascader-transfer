import React from "react";
import ReactDOM from "react-dom";
import ReactCascaderTransfer from './index'
import './test.css'
import city from './config/city'

const handleOnchange = (selected, value) => {
  console.log('handleOnchange...', selected, value)
}

ReactDOM.render(
  <ReactCascaderTransfer dataSource={city} titles={['省级', '市级']} value={['11', '81', '321000', '320100', '120103', '513300']} onChange={handleOnchange}/>,
  document.getElementById("root")
);