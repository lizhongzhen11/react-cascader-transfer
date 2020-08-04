# react-cascader-transfer

## 预览
<img src="https://raw.githubusercontent.com/lizhongzhen11/react-cascader-transfer/master/GIF.gif">

## 运行
```js
npm install
npm start
```


## API
见 **interface.ts**
```ts
interface CascaderTransferProps {
  /** 数据源 */
  dataSource: DataProps[];
  /** 禁用*/
  disabled?: boolean;
  /** 自定义每列宽度 */
  width?: string | number;
  /** 已选中数据 */
  selected?: DataProps[];
  /** 指定选中项 */
  value: Array<number | string>;
  /** 列头名 */
  titles?: string[];
  /** 自定义样式 */
  style?: React.CSSProperties;
  /** 自定义类名 */
  className?: string;
  /** 自定义已选框宽度 */
  selectedWidth?: number | string;
  /** 已选数据改变 */
  onChange: (selected: DataProps[], value: Array<number | string>) => void
}
```

## 核心 | core

该组件最难的地方在于改变左侧 checkbox 选中状态，联动的改变其父辈和子孙的选中状态，且设置最新的选中值。大致流程见下图：

<img src="https://s1.ax1x.com/2020/08/04/awhSN8.png">