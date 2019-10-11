import React, { useState, useEffect } from "react";
import Selected from './components/selected'
import List from './components/list'
import { DataProps, CascaderTransferProps } from './interface'
import './less/base.less'
import { handleGetData, cancelByDelete } from './utils'

/**
 * 
 * @param data 
 * @param level 层级，第一级为0，第二级为1，依次累加
 * @description 对数据源进行改变,增加level字段,以及判断是否有parentId，没有的话增加
 */
const changeData = (data: DataProps[], level: number, parentId?: number | string) => {
  data.forEach((item: DataProps, index: number) => {
    data[index].level = level
    // 从第二层开始检测有没有parentId，没有的话，将上层value作为该层parentId
    if (level > 0 && !data[index].parentId) {
      data[index].parentId = parentId
    }
    item.children && changeData(item.children, level + 1, item.value)
  })
}

const ReactCascaderTransfer = (props: CascaderTransferProps) => {
  const [selected, setSelected] = useState<DataProps[]>([])
  const [value, setValue] = useState<Array<number | string>>(props.value)
  const { dataSource, width, selectedWidth, titles, onChange } = props
  
  // 只在初始化时对数据源进行改变
  useEffect(() => {
    changeData(dataSource, 0)
  }, [dataSource])

  handleGetData(dataSource, value, selected)

  /** 获取最新的selected和value并赋值给原来的，引起组件重新渲染以及将数据抛出 */
  const handleOnChange = (newestSelected: DataProps[], newestValue: Array<number | string>, item?: DataProps) => {
    setSelected([...newestSelected])
    setValue([...newestValue])
    /** 右侧面板删除操作也调该方法，不过需要改变左侧面板相应数据的checkbox状态 */
    if (item) {
      cancelByDelete(dataSource, item)
    }
    onChange(selected, value)
  }

  // console.log(dataSource)
  return (
    <div className="rct-flex">
      <List 
        dataSource={dataSource} 
        width={width} 
        titles={titles} 
        selected={selected} 
        value={value} 
        onChange={handleOnChange}
      />
      <Selected 
        selectedWidth={selectedWidth || 150} 
        selected={selected} 
        value={value} 
        onDelete={handleOnChange} 
      />
    </div>
  )
}

export default ReactCascaderTransfer