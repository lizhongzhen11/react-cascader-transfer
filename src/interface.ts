export interface DataProps {
  value: number | string;
  label: string;
  parentId?: number | string;
  level?: number;
  checked?: boolean;
  rootValue?: number | string;
  children?: DataProps[];
}

export interface ListProps {
  /** 列头名 */
  titles?: string[];
  /** 数据源 */
  dataSource: DataProps[];
  /** 禁用*/
  disabled?: boolean;
  /** 自定义每列宽度 */
  width?: string | number;
  /** 已选中数据 */
  selected?: DataProps[];
  /** 指定选中项 */
  // value: Array<number | string>;
  onChange: (rowData: DataProps, checked: boolean, initLevel: number, initParentId?: number | string) => void
}

export interface ListItemProps {
  itemDataSource: DataProps[];
  /** 列头名 */
  title?: string;
  /** 禁用*/
  disabled?: boolean;
  /** 自定义每列宽度 */
  width?: string | number;
  onChange?: (rowData: DataProps, checked: boolean) => void;
  onExpand?: (e: any, rowData: DataProps) => void;
}

export interface CascaderTransferProps {
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

export interface SelectedProps {
  /** 已选中数据 */
  selected: DataProps[];
  /** 自定义已选框宽度 */
  selectedWidth?: number | string;
  /** 删除数据 */
  onDelete: (value: number | string) => void
}