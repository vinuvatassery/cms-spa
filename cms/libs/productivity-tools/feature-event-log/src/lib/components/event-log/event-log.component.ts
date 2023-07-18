/** Angular **/
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
/** Facades **/
import { EventLogFacade } from '@cms/productivity-tools/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa'; 

@Component({
  selector: 'productivity-tools-event-log',
  templateUrl: './event-log.component.html',
  styleUrls: ['./event-log.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventLogComponent implements OnInit {
  /** Output properties **/
  @Output() closeAction = new EventEmitter();

  /** Public properties **/
  events$ = this.eventLogFacade.events$;
  eventLogs$ = this.eventLogFacade.eventLogs$;
  isShowEventLog = false;
  isOpenEventLogDetails = false;
  isShownSearch = false;
  vendorId:any;
  eventTypeCode:any;
  val:any ='items-body_details text-ellipsis';
  
  public formUiStyle : UIFormStyle = new UIFormStyle();
  // actions: Array<any> = [{ text: 'Action' }];
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  public actions = [
    {
      buttonType:"btn-h-primary",
      text: "Sort Ascending",
      icon: "arrow_upward",
      click: (): void => {
      },
    },
    {
      buttonType:"btn-h-primary",
      text: "Sort Descending",
      icon: "arrow_downward",
      click: (): void => {
      },
    },
    {
      buttonType:"btn-h-primary",
      text: "Filter",
      icon: "filter_list",
      click: (): void => {
      },
    },
  ];

  /** Constructor **/
  constructor(private readonly eventLogFacade: EventLogFacade,private readonly route: ActivatedRoute,) {}

  /** Lifecycle hooks **/
  ngOnInit() {
    
    this.getQuery();
    this.loadEvents();
  }

  /** Private methods **/

  private getQuery(){
    this.vendorId = this.route.snapshot.queryParams['v_id'];
    this.eventTypeCode = this.route.snapshot.queryParams['vendor_type_code'];
  }
  private loadEvents(): void {
    this.eventLogFacade.loadEventLog(this.eventTypeCode);
  }

  /** Internal event methods **/
  onCloseEventDetailsClicked() {
    this.isOpenEventLogDetails = false;
  }
  onOpenEventDetailsClicked() {
    this.isOpenEventLogDetails = true;
  }

  onShowSearchClicked() {
    this.isShownSearch = !this.isShownSearch;
  }

  onCloseEventLogClicked() {
    this.closeAction.emit();
    this.isShowEventLog = !this.isShowEventLog;
  }

  readMore(event : any){
    this.val ='items-body_details';
    let item = 'detailsList'+ event.currentTarget.id
    let control = document.getElementById(item);
    if(control !== null)
    {
      control.classList.add('items-body_details');
    }
  }
}
