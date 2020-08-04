import React from 'react'
import { Icon } from 'antd'
import '../less/selected.less'
import { SelectedProps, DataProps } from '../interface'

const Selected = (props: SelectedProps) => {
  const { selectedWidth, selected, onDelete } = props

  const handleDelete = (e: any, item: DataProps) => {
    onDelete(item.value)
  }

  return (
    <div className="rct-selected" style={{ width: `${selectedWidth}px` }}>
      <div className="rct-title rct-font-size">已选</div>
      {
        selected.map(item => (
          <span className="rct-selected-span rct-radius rct-flex rct-space-between" key={item.value}>
            <span>{item.label}</span>
            <Icon type="close" className="rct-selected-delete rct-pointer" onClick={(e: any) => handleDelete(e, item)} />
          </span>
        ))
      }
    </div>
  )
}

export default Selected