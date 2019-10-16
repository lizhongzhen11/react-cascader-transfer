import React, { useState, useEffect } from 'react'
import ListItem from './listItem'
import '../less/list.less'
import { DataProps, ListProps } from '../interface'
import { changeAncestorsChecked } from '../utils'

/** 当前被点击层的最后一个子孙的层级 */
let currRowLastChildLevel: number 

/**
 * 
 * @param data 
 * @param property 
 * @param value
 * @description 判断是不是子级 
 */
const isChild = (data: DataProps[], property: string, value: number | string | undefined) => {
  return data.some(item => {
    if (!item.children || !item.children.length) {
      currRowLastChildLevel = item.level || 0
      return item[property] === value
    }
    return item[property] === value || isChild(item.children, property, value)
  })
}

const List = (props: ListProps) => {
  // 渲染列(层)的数据源
  let [listItems, setListItems] = useState([props.dataSource])

  const { dataSource, width, value, onChange } = props

  let selected = props.selected || []
  // 每列宽度
  const itemWidth = width ? ~~width : 150
  // list总宽度
  const listWidth = itemWidth * listItems.length
  // 列头名称数组
  const titles = props.titles || []

  // checkbox改变触发，需要重新渲染进而实时展示checkbox状态
  const handleChange = (e: any, rowData: DataProps) => {
    changeAncestorsChecked(listItems.slice(0, rowData.level), dataSource, rowData, selected, value)
    setListItems([...listItems])
    onChange(selected, value)
  }

  // 点击一行触发，如果有子数据，则展开
  const handleExpand = (e: any, rowData: DataProps) => {
    if (!rowData.children || !rowData.children.length || e.target.type === 'checkbox') {
      return
    }
    /** 当前被点击层的层级 */
    const level = rowData.level || 0
    /** 目前已经展开的最后一层的parentId */
    const lastParentId = listItems.slice(-1)[0][0].parentId
    /** 目前已经展开的最后一层的层级 */
    const lastLevel = listItems.slice(-1)[0][0].level
    /** 判断已经展开的最后一层数据，是不是当前被点击层的后代 */
    const isCurrRowChild = isChild(rowData.children, 'parentId', lastParentId)
    /** 判断已经展开的最后一层数据, 是不是当前点击层的子孙以及是不是当前层的最后一代 */
    /** 如果是，那么代表该层已经全部展开 */
    /** 如果不是，那么需要渲染后面的层级 */
    if (isCurrRowChild && lastLevel === currRowLastChildLevel) {
      return
    }
    // 获取当前层级以及它所有父层的数据
    const curr = listItems.slice(0, level + 1)
    // 根据level确定当前被点击行在数据源中的层级，该层以及父级数据不动
    setListItems([...curr, rowData.children])
  }

  // 渲染树
  const handleRender = (data: Array<DataProps[]>) => {
    return data.map((item, i) => {
      return <ListItem key={i} title={titles[i]} width={itemWidth} dataSource={item} onChange={handleChange} onExpand={handleExpand} />
    })
  }

  return (
    <div className="rct-flex rct-list rct-radius" style={{width: `${listWidth}px`}}>
      {
        dataSource.length ? handleRender(listItems) : <ListItem width={itemWidth} dataSource={[]} />
      }
    </div>
  )
}

export default List