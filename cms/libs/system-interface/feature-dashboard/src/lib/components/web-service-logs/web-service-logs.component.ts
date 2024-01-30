import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  OnChanges,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';


@Component({
  selector: 'cms-system-interface-web-service-logs',
  templateUrl: './web-service-logs.component.html',
  styleUrls: ['./web-service-logs.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WebServiceLogsComponent  implements OnChanges, OnInit
{
  public formUiStyle: UIFormStyle = new UIFormStyle();
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() activityEventLogList$: any;
  @Input() lovsList$: any;

  @Output() loadActivityLogListEvent = new EventEmitter<any>();

  public state!: State;
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
    this.loadActivityLogLists();
  }
  ngOnChanges(): void {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };
  }

  private loadActivityLogLists() {
    this.loadActivityLogListEvent.emit();
  }
  pageSelectionchange(data: any) {
    this.loadActivityLogLists();
  }
}
