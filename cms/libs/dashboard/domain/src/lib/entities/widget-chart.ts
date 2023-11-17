import { Border } from '@progress/kendo-angular-charts';

export interface WidgetChartModel {
  title?: {
    text?: string;
  };
  legend?: {
    visible?: boolean;
    position?: any;
    orientation?: any;
    align?: string;
    background?: any;
    border?: Border;
    height?: number;
    inactiveItems?: [
      {
        LegendLabels?: {
          color?: string;
          font?: string;
          margin?: number;
          padding?: number;
        };
      }
    ];
    item?: [
      {
        cursor?: string;
      }
    ];
    LegendLabels?: {
      color?: string;
      font?: string;
      margin?: number;
      padding?: number;
    };
    offsetX?: number;
    offsetY?: number;
    reverse?: boolean;
    spacing?: number;
    title?: {
      align?: string;
      background?: any;
      color?: any;
      border?: Border;
      font?: string;
      margin?: number;
      padding?: number;
      position?: any;
      text?: string;
    };
  };
  tooltip?: {
    visible?: boolean;
    shared?: boolean;
    format?: string;
    background?: string;
    border?: Border;
    color?: string;
    font?: string;
    opacity?: number;
    padding?: number;
  };
  categoryAxis?: {
    categories?: string[];
  };
  series: {
    name?: string;
    data?: any[];
    type?: any;
    color?: any;
    aggregate?: any;
    autoFit?: boolean;
    axis?: string;
    border?: Border;
    categoryAxis?: string;
    categoryField?: string;
    closeField?: string;
    colorField?: string;
  }[];
}
