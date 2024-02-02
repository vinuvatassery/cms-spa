import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  OnChanges,
  Output,
} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
@Component({
  selector: 'cms-system-interface-activity-log-lists',
  templateUrl: './system-interface-activity-log-lists.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SystemInterfaceActivityLogListsComponent
  implements OnChanges, OnInit
{
  public formUiStyle: UIFormStyle = new UIFormStyle();
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() activityEventLogList$: any;
  public state!: State;
  @Output() loadActivityLogListEvent = new EventEmitter<any>();
  /** Public properties **/
  isActivityLogLoaderShow = false;
  activityEventLogSubList =[
    {
      id:1,
      errorCode: 12,
      errorDesc: 'errorDesc errorDesc',
      rowNumber: 14
    },
    {
      id:2,
      errorCode: 12,
      errorDesc: 'errorDesc errorDesc',
      rowNumber: 14
    },
    {
      id:3,
      errorCode: 12,
      errorDesc: 'errorDesc errorDesc',
      rowNumber: 14
    },
  ]
  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };
    this.loadActivityLogList();
  }
  ngOnChanges(): void {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };
  }
  private loadActivityLogList() {
    this.loadActivityLogListEvent.emit();
  }
  pageSelectionchange(data: any) {
    this.loadActivityLogList();
  }
}
