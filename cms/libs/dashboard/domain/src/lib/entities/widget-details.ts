import { WidgetModel } from './widget';

export interface WidgetDetailModel {
  moduleId: string;
  groupName: string;
  widgets: WidgetModel[];
}
