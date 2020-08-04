# react-cascader-transfer

## 预览
<img src="https://raw.githubusercontent.com/lizhongzhen11/react-cascader-transfer/master/GIF.gif">

## 安装
```js
npm install react-cascader-transfer --save-dev
```

## 用法
```tsx
import ReactCascaderTransfer from 'react-cascader-transfer'
import city from './config/city'

const handleOnchange = (selected, value) => {
  console.log(selected, value)
}

<ReactCascaderTransfer dataSource={city} titles={['省级', '市级']} value={['11', '120103', '513300']} onChange={handleOnchange}/>,
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