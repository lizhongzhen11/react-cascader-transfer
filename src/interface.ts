export interface DataProps {
  value?: number | string;
  label?: string;
  parentId?: number | string;
  level?: number;
  checked?: boolean;
  root?: DataProps;
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
  value?: number[] | string[];
}

export interface ListItemProps {
  dataSource: DataProps[];
  /** 列头名 */
  title?: string;
  /** 禁用*/
  disabled?: boolean;
  /** 自定义每列宽度 */
  width?: string | number;
  onChange?: (e, rowData: DataProps) => void;
  onExpand?: (e, rowData: DataProps) => void;
}

export interface CascaderTransferProps extends ListProps {
  /** 指定选中项 */
  value?: number[] | string[];
  /** 列头名 */
  titles?: string[];
  /** 自定义样式 */
  style?: React.CSSProperties;
  /** 自定义类名 */
  className?: string;
  /** 自定义已选框宽度 */
  selectedWidth?: number | string;
}

export interface SelectedProps {
  /** 已选中数据 */
  selected?: DataProps[]
  /** 自定义已选框宽度 */
  selectedWidth?: number | string;
}