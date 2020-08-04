import React from 'react'
import { Checkbox, Icon } from 'antd'
import '../less/listItem.less'
import { DataProps, ListItemProps } from '../interface'


const ListItem = (props: ListItemProps) => {
  const { title, width, disabled, itemDataSource, onChange, onExpand } = props

  // checkbox变化触发
  const handleOnChange = (e: any, rowData: DataProps) => {
    console.log('ListItem handleOnChange...', rowData, e.target.checked)
    onChange && onChange(rowData, e.target.checked)
  }

  // 点击一行触发，如果有子数据，则展开
  const handleExpand = (e: any, rowData: DataProps) => {
    if (rowData.children && rowData.children.length && e.target.type !== 'checkbox' && onExpand) {
      onExpand(e, rowData)
    }
  }

  

  // 每行渲染的内容
  // every row render
  const rowContent = (rowData: DataProps) => {
    return (
      <span className="rct-flex rct-space-between rct-pointer rct-item-row" key={rowData.value} onClick={(e) => handleExpand(e, rowData)}>
        <span className="rct-flex">
          <Checkbox className="rct-checkbox" checked={rowData.checked} onChange={(e) => handleOnChange(e, rowData)} />
          <span className="rct-label">{rowData.label}</span>
        </span>
        {
          rowData.children && rowData.children.length ? <Icon type="right" className="rct-pointer rct-left" /> : null
        }
      </span>
    )
  }

  // 有数据的listItem
  const listItemWithData = (
    <div>
      <div className="rct-title">{title}</div>
      {itemDataSource.map(item => rowContent(item))}
    </div>
  )

  return (
    <div className="rct-flex-1 rct-item" style={{width: `${width}px`}}>
      {
        itemDataSource.length ? listItemWithData : <span className="rct-flex rct-justify-center rct-align-center" style={{height: '100%'}}>暂无数据</span>
      }
    </div>
  )
}

export default ListItem