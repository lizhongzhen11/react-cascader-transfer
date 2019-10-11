import { DataProps } from '../interface'

/**
 * @description 根据已选中的value去数据源中拿到对应的数据。初始化时调用
 */
export const handleGetData = (dataSource: DataProps[], value: Array<number | string>, selected: DataProps[]) => {
  dataSource.forEach((item: DataProps) => {
    /** 先判断selected中是否已经有该条数据 */
    /** PS：用于地区选择时，北京是直辖市，属于省级，但在市级这一层也是它本身，所以会存在省级北京和市级北京共有同一个value */
    const alreadyExist = selected.every((sel: DataProps) => { return sel.value !== item.value })
    /** 查找 */
    const exist = value.includes(item.value)
    /** 找到数据并放入 selected */
    if (exist && alreadyExist) {
      item.checked = true
      /** 检查是否有子层，有的话全部设为选中 */
      item.children && changeChildChecked(item.children, true)
      selected.push(item)
    }
    /** 存在子级，递归调用查找 */
    if (item.children && item.children.length) {
      handleGetData(item.children, value, selected)
    }
  })
}


/**
 * @description checkbox改变引起父级checkbox改变;引起selected数据更新
 */
export const changeAncestorsChecked = (
  items: DataProps[][], 
  dataSource: DataProps[], 
  rowData: DataProps, 
  selected: DataProps[],
  value: Array<number | string>
) => {
  const { level, parentId } = rowData
  const parentItem = level === 0 ? dataSource : items[level - 1]
  const parent = parentItem.find(item => {
    return parentId ? item.value === parentId : item.value === rowData.value
  })
  /** 只要子层有一个没选中，父层肯定要被置为未选中 */
  /** 判断兄弟节点是不是都被选中，是的话将父层选中 */
  parent.checked = parent.children ? parent.children.every(item => {
    return item.checked
  }) : parent.checked
  /** 递归到顶层
   *  1. 且顶层节点也是选中状态，则将该顶层数据放入selected
   *  2. 顶层节点未选中，则从selected中删除
   */
  if (level === 0) {
    rowData.checked && handleSelected(selected, value, rowData)
    !rowData.checked && rowData.children && 
    rowData.children.every(item => !item.checked) && 
    handleSelected(selected, value, rowData, 'rootCancel')
    return
  }
  /** checkbox状态改变，更新selected数据 */
  /** 该节点选中，但是其兄弟节点并未全部选中，父层也就未选中，所以将该节点数据放入selected */
  if (!parent.checked && rowData.checked) {
    handleSelected(selected, value, rowData, undefined, undefined, parent )
  }
  /** 取消选中，在selected中查找是否存在该数据，存在的话删除 */
  /** 若之前父节点选中，取消选中该节点后，会导致该节点的所有祖先节点取消选中，需要从selected中删除这些祖先节点(如果已存在的话) */
  if (!rowData.checked) {
    /** 需要考虑到层级较多时，较上层选中其子孙后代都选中，然后取消靠后某一层的checkbox，需要将其已选中的祖先兄弟节点也要放进去 */
    /** 查找selected是不是已经有该节点数据，有的话需要删除 */
    const rowDataIndex = findIndex(selected, rowData)
    rowDataIndex >= 0 && selected.splice(rowDataIndex, 1) && value.splice(rowDataIndex, 1)
    parent.children.forEach(child => {
      if (child.value !== rowData.value && child.checked && !value.includes(child.value)) {
        selected.push(child)
        value.push(child.value)
      }
    })
  }
  /** 向上递归，一直到最顶层 */
  if (level !== 0) {
    changeAncestorsChecked(items, dataSource, parent, selected, value)
  }
}

/**
 * 
 * @param data 
 * @param checked
 * @description 父级checkbox状态改变，引起子孙共同改变 
 */
export const changeChildChecked = (data: DataProps[], checked: boolean) => {
  data.forEach((item, i) => {
    data[i].checked = checked
    item.children && changeChildChecked(item.children, checked)
  })
}

/**
 * 
 * @param selected 
 * @param data 
 * @description 查找数据在selected中的位置，用于判断是否已存在以及删除等操作
 */
export const findIndex = (selected: DataProps[], data: DataProps) => {
  return selected.findIndex(item => {
    return item.value === data.value
  })
}

/**
 * @description 将树结构扁平化
 */
export const flatTree = (treeData: DataProps[]) => {
  let flatData = [] 
  const flat = (arr: DataProps[]) => {
    arr.forEach(item => {
      flatData.push(item)
      if (item.children && item.children.length) {
        flat(item.children)
      }
    })
  }
  flat(treeData)
  return flatData
}

// if 太多了，使用策略模式优化下
const types = {
  // 非顶层取消选中的话，需要把其所有选中状态的兄弟节点放进去
  'cancel': (
    selected: DataProps[], 
    value: Array<number | string>, 
    data: DataProps, 
    type?: string, 
    curr?: DataProps
  ) => {
    data.children.forEach(item => {
      if (item.value !== curr.value && item.checked) {
        selected.push(item)
        value.push(item.value)
      }
    })
  },
  // 将该节点放入selected中
  'undefined': (
    selected: DataProps[], 
    value: Array<number | string>, 
    data: DataProps, 
    type?: string, 
    curr?: DataProps, 
    parent?: DataProps
  ) => {
    selected.push(data)
    value.push(data.value)
    if (parent && parent.children) {
      types['parent'](selected, value, parent)
    }
    if (data.checked && data.children) {
      types['merge'](selected, value, data)
    }
  },
  // 顶层取消选中，直接退出
  'rootCancel': (
    selected: DataProps[], 
    value: Array<number | string>, 
    data: DataProps, 
    type?: string, 
    curr?: DataProps
  ) => {}, 
  // 兄弟节点也是选中状态的话，放进去
  'parent': (selected: DataProps[], value: Array<number | string>, parent: DataProps) => {
    parent.children.forEach(child => {
      selected.every(sel => 
        sel.value !== child.value && child.checked
      ) && 
      selected.push(child) && value.push(child.value)
    })
  },
  // 该层子节点全都选中了，合并只保留父级节点数据
  'merge': (selected: DataProps[], value: Array<number | string>, data: DataProps) => {
    let selectedData = JSON.parse(JSON.stringify(selected))
    selected.length = 0
    value.length = 0
    for (let i = 0; i < selectedData.length; i++ ) {
      if (selectedData[i].parentId !== data.value) {
        selected.push(selectedData[i])
        value.push(selectedData[i].value)
      }
    }
  } 
}

/**
 * 
 * @param selected 
 * @param data 
 * @description 处理已选中数据的增加、删除
 */
export const handleSelected = (
  selected: DataProps[], 
  value: Array<number | string>,
  data: DataProps, 
  type?: string, 
  curr?: DataProps, 
  parent?: DataProps
) => {
  /** 先将该节点及其子孙后代数据扁平化 */
  let flatData = [data]
  if (data.children && data.children.length) {
    flatData = [data, ...flatTree(data.children)]
  }
  /** 循环查找，如果selected中已存在其子孙节点，则删除 */
  const dataIndex = findIndex(selected, data)
  for (let i = 0; i < flatData.length; i++ ) {
    const index = findIndex(selected, flatData[i])
    if (index >= 0 && dataIndex >= 0) {
      selected.splice(index, 1)
      value.splice(index, 1)
    }
  }
  // 策略模式，直接根据对象属性来调用不同策略
  types[String(type)](selected, value, data, type, curr, parent)
}