import { DataProps } from '../interface'


// 平铺数据结构
// 可以直接用concat链接，代码省事，不过它会创建新数组
export const flatTree = (data: DataProps[]) => {
  return data.reduce((prev: any[], next: DataProps) => {
    prev.push(next);
    if (next.children) {
      const arr = flatTree(next.children);
      arr.forEach(item => prev.push(item));
    }
    return prev;
  }, [])
}


/**
 * 
 * @param data 
 * @param parentId
 * @description 判断是不是后代子孙
 */
export const isOffspring = (data, parentId) => {
  const flatData = flatTree(data)
  return flatData.some(item => item.parentId === parentId)
}


/**
 * 
 */
export const handleChangeCheck = () => {

}