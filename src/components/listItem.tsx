import React from 'react'
import { Checkbox, Icon } from 'antd'
import '../less/listItem.less'
import { DataProps, ListItemProps } from '../interface'

/**
 * 
 * @param data 
 * @param checked
 * @description 父级checkbox状态改变，引起子孙共同改变 
 */
const changeChildChecked = (data: DataProps[], checked: boolean) => {
  data.forEach((item, i) => {
    data[i].checked = checked
    item.children && changeChildChecked(item.children, checked)
  })
}

const ListItem = (props: ListItemProps) => {
  const { title, width, disabled, dataSource, onChange, onExpand } = props

  // checkbox变化触发
  const handleOnChange = (e, rowData: DataProps) => {
    rowData.checked = e.target.checked
    rowData.children && changeChildChecked(rowData.children, e.target.checked)
    onChange && onChange(e, rowData)
  }

  // 点击一行触发，如果有子数据，则展开
  const handleExpand = (e, rowData: DataProps) => {
    onExpand && onExpand(e, rowData)
  }

  // 每行渲染的内容
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

  return (
    <div className="rct-flex-1 rct-item" style={{width: `${width}px`}}>
      {
        dataSource.length ? 
          <div>
            <div className="rct-title">{title}</div>
            {
              dataSource.map(item => rowContent(item))
            }
          </div> : 
          <span className="rct-flex rct-justify-center rct-align-center" style={{height: '100%'}}>暂无数据</span>
      }
    </div>
  )
}

export default ListItem