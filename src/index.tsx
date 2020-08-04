import React, { useState, useEffect } from "react";
import Selected from './components/selected'
import List from './components/list'
import { DataProps, CascaderTransferProps } from './interface'
import './less/base.less'
import { flatTree, handleChangeCheck } from './utils'


const ReactCascaderTransfer = (props: CascaderTransferProps) => {
  const [selected, setSelected] = useState<DataProps[]>([])
  const [value, setValue] = useState<Array<number | string>>(props.value)
  const [dataSource, setDataSource] = useState<DataProps[]>([]) // 数据源
  const { width, selectedWidth, titles, onChange } = props

/**
 * 
 * @param data 
 * @param level 层级，第一级为0，第二级为1，依次累加
 * @description 对数据源进行改变,增加level字段,以及判断是否有parentId，没有的话增加
 *              从第二层开始检测有没有parentId，没有的话，将上层value作为该层parentId
 */
  const changeData = (data: DataProps[], level: number, parentId?: number | string, rootValue?: number | string) => {
    return data.map((item: DataProps, index: number) => {
      const parent_id = parentId || null; // 父节点parentId
      const root_value = level === 0 ? item.value : rootValue; // 该节点最顶层根节点的value
      const children = !item.children || item.children.length === 0 ? null : changeData(item.children, level + 1, item.value, root_value);
      return Object.assign(item, {
        level,
        parentId: parent_id,
        children: children,
        checked: false,
        rootValue: root_value
      })
    })
  }

  // 设置当前节点及其子孙节点选中
  const handleSetChecked = (target: DataProps, checked: boolean) => {
    target.checked = checked
    const children = flatTree(target.children || [])
    children.forEach((item: DataProps, index: number) => {
      children[index].checked = checked
      item.children && handleSetChecked(children[index], checked)
    })
    return children
  }

  
  // 只在初始化时将数据源转为需要的格式，只执行一次
  // change data structure when init. only excute once
  useEffect(() => {
    if (Object.prototype.toString.call(props.dataSource) !== '[object Array]') {
      throw '请传入符合要求的数据源数组';
    }
    
    console.log('init...', props.dataSource)
    setDataSource(changeData(props.dataSource, 0))
  }, [props.dataSource])


  // 只在初始化时执行一次
  // 初始化改造完数据结构后，如果存在已选数据，则需要初始化右侧已选面板数据
  // 先平铺数据源，再找到已选的数据，注意过滤不存在的数据；同时设置左侧checkbox选中状态
  // 如果存在子节点，不要忘了设置子节点的选中状态
  // only excute when initial.
  // after init change data structure, if there are some selected data, 
  // flat the dataSource, find all the initial selected data and filter the undefined. (if exist)
  // set the corresponding left checkbox checked
  useEffect(() => {
    if (!dataSource.length || !props.value.length || selected.length) {
      return;
    }
    const flatDataSource = flatTree(dataSource);
    const selectedArr = props.value.map((val: string | number) => {
      let selectedItem = flatDataSource.find((dataItem: DataProps) => dataItem.value === val);
      handleSetChecked(selectedItem, true)
      return selectedItem;
    }).filter((dataItem: DataProps) => !!dataItem)
    setSelected(selectedArr);
    setDataSource(dataSource)
  }, [dataSource, props.value])


  // 左侧改变checkbox，导致右侧已选变化
  // 存在以下可能（假设当前节点为 n，父节点即上一层节点为 p）：
  // 1. 改变其选中状态，不会改变其父节点的选中状态（第一级没有父节点），只需简单的将该行添加到右侧已选
  // 2. 改变其选中状态，会改变其父节点的选中状态：
  //    2.1 选中，设置所有子孙节点为 **选中状态**，向上寻找，
  //        2.1.1 由于选中导致其 **父节点 p** 也被选中，但是父节点的其他兄弟节点存在未被选中的，
  //              把该 **父节点 p** 数据添加到右侧已选数据，从右侧已选数据中删除 **父节点 p** 下的所有子孙节点
  //        2.1.2 由于选中导致其 **父节点 p** 也被选中，同时父节点的其他兄弟节点都被选中的，那么继续向上寻找，
  //              直到出现 2.1.1 情况 或 到达第一级（最顶层）
  //    2.2 取消选中，设置其子节点为 **未选中状态** 向上寻找，
  //        2.2.1 由于取消选中导致其父节点也取消选中，其父节点兄弟节点存在未被选中的，从已选数据中删除该 **父节点 p** 数据，
  //              把 **该节点 n** 同级的兄弟节点添加到已选数据中
  //        2.2.2 由于取消选中导致其父节点也取消选中，同时其父节点兄弟节点都被选中，那么继续向上寻找，
  //              直到出现 2.2.1 情况 或 到达第一级（最顶层）
  // change left checkbox, right selected change together
  const handleOnChange = (rowData: DataProps, checked: boolean, initLevel: number, initParentId?: number | string) => {
    const oldSelected = selected
    let newValues = []
    let newSelected = []
    const level = rowData.level
    const rootValue = rowData.rootValue
    console.log('level...', level)

    // 平铺对应根节点的数据源
    // flat the top level node data which the rootValue equal the target rowData's rootValue
    const flatSameRootData = flatTree(dataSource.filter((data: DataProps) => data.rootValue === rootValue))

    // 切换顶级节点的checkbox
    // change the top level checkbox
    if (level === 0) {
      // 由于 flatTree 内部使用的是 push，从根节点触发时始终保证根节点为第一个元素
      // inside the flatTree, the push was applying to ensure the top level node alaways in the index 0.
      const root = flatSameRootData[0]

      // 说明点击的目标节点就是顶级根节点，不是通过递归上来的
      // the target is not reached by recursion
      if (initLevel === 0) {
        for (let i = 0; i < flatSameRootData.length; i++) {
          flatSameRootData[i].checked = checked
        }
      }
      
      // 先过滤出非该根节点下的数据
      newSelected = oldSelected.filter((data: DataProps) => {
        if (data.rootValue !== rootValue) {
          newValues.push(data.value)
          return true
        }
        return false
      })
      // 选中，不论是递归到顶部还是点击顶部设置选中状态
      if (checked) {
        newSelected.push(root)
        newValues.push(root.value)
      }

      // 递归到顶部，且取消选中
      // if reached by recursion, need add the checked offspring
      if (!checked && initLevel !== 0) {
        flatSameRootData.forEach(item => {
          if (item.checked && (item.level === root.level + 1 || item.parentId === initParentId)) {
            newSelected.push(item)
            newValues.push(item.value)
          }
        })
      }
      setSelected(newSelected)
      setValue(newValues)
      onChange(newSelected, newValues)
      return
    }

    // 值相同的节点其选中状态必须相同，值相同只可能是几个节点间连续继承，且在它们的层级上是唯一存在的节点，没有兄弟节点
    // filter the same value node, the index 0 is the highest level node in these nodes
    const highestLevelNode = flatSameRootData.filter((data: DataProps) => data.value === rowData.value)[0]

    // 拿到 highestLevelNode 的兄弟节点，如果兄弟节点选中状态不一致，则不影响祖先节点
    // 如果所有的兄弟节点都是选中状态，则会影响父节点；否则不会
    // get the highest level node's brother nodes, 
    // if the brothers has different checked state, do not effect parent
    // if the brother nodes are all checked, effect parent
    const isEffectParent = flatSameRootData.filter((data: DataProps) => data.level === highestLevelNode.level && data.parentId === highestLevelNode.parentId && data.value !== highestLevelNode.value).every((data: DataProps) => data.checked === true)
    console.log('isEffectParent...', isEffectParent, highestLevelNode)

    // 影响父节点，注意根节点（顶级）没有父节点
    if (isEffectParent) {
      const parent = flatSameRootData.find((data: DataProps) => data.value === highestLevelNode.parentId && data.level === highestLevelNode.level - 1) || highestLevelNode
      parent.checked = checked
      // 确保只设置第一次点击目标节点及其子孙节点的选中状态
      // ensure to set the clicked(the first one) target node and its offspring checked state
      initLevel === rowData.level && handleSetChecked(highestLevelNode, checked)
      handleOnChange(parent, checked, initLevel, initParentId)
      return
    }


    // 不影响父节点，但会影响子孙节点，如果是选中的话要过滤已选中的子孙节点
    // do not effect parent node, but can effect offspring node, if checked, filter the selected offspring node
    initLevel === rowData.level && handleSetChecked(highestLevelNode, checked)
    const flatHighestLevelNode = flatTree([highestLevelNode])
    if (checked) {
      newSelected = oldSelected.filter((data: DataProps) => flatHighestLevelNode.every((item: DataProps) => data.value !== item.value))
      newValues = value.filter((val: number | string) => flatHighestLevelNode.every((item: DataProps) => val !== item.value))
      newSelected.push(highestLevelNode)
      newValues.push(highestLevelNode.value)
    } else {
      newSelected = oldSelected.filter((data: DataProps) => data.value !== highestLevelNode.value)
      newValues = value.filter((val: number | string) => val !== highestLevelNode.value)
      
      // 递归过来的
      if (initLevel !== rowData.level) {
        flatHighestLevelNode.forEach(item => {
          if (item.checked && (item.level === highestLevelNode.level || item.parentId === initParentId)) {
            newSelected.push(item)
            newValues.push(item.value)
          }
        })
      }
    }
    setSelected(newSelected)
    setValue(newValues)
    onChange(newSelected, newValues)
  }


  // 右侧已选删除，将数据对应的节点及其所有子孙节点全部设为未选中状态
  // remove right selected
  const handleOnDelete = (val: number | string) => {
    let targetIndex = -1
    const newValue = value.filter((v: number | string) => v !== val)
    const newSelected = selected.filter((item: DataProps, index) => {
      if (item.value === val) {
        targetIndex = index
      }
      return item.value !== val
    })
    const target = selected[targetIndex]
    handleSetChecked(target, false)
    setValue(newValue)
    setSelected(newSelected)
    onChange(newSelected, newValue)
  }


  return (
    <div className="rct-flex">
      <List 
        dataSource={dataSource} 
        width={width} 
        titles={titles} 
        selected={selected} 
        onChange={handleOnChange}
      />
      <Selected 
        selectedWidth={selectedWidth || 150} 
        selected={selected} 
        onDelete={handleOnDelete} 
      />
    </div>
  )
}

export default ReactCascaderTransfer