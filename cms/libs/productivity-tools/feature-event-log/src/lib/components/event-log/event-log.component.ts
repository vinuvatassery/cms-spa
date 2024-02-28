/** Angular **/
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnInit,
  Output,
  TemplateRef,
  Input
} from '@angular/core';
/** Facades **/
import { EventLogFacade } from '@cms/productivity-tools/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { DialogService } from '@progress/kendo-angular-dialog';

@Component({
  selector: 'productivity-tools-event-log',
  templateUrl: './event-log.component.html',
  styleUrls: ['./event-log.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventLogComponent implements OnInit {
  /** Output properties **/
  @Output() closeAction = new EventEmitter();
  @Input() eventAttachmentTypeLov$: any;
  @Input() entityType: any;
  @Input() entityId: any;
  @Input() clientCaseEligibilityId: any;

  /** Public properties **/
  parentEventLogId : any;
  eventList : any = [];
  SubEventList : any = [];
  eventResponseList : any = [];
  events$ = this.eventLogFacade.events$;
  eventsdata$ = this.eventLogFacade.eventsdata$;
  isShowEventLog = false;
  isOpenEventLogDetails = false;
  isShownSearch = false;
  isAddEventDialogOpen : any;
  public formUiStyle : UIFormStyle = new UIFormStyle();
  isSubEvent = false;
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

  constructor(private readonly eventLogFacade: EventLogFacade, private dialogService: DialogService,
    ) {}

  /** Lifecycle hooks **/
  ngOnInit() {
    this.loadEventsData();
    this.loadEvents();
    this.getEventList();
  }

  /** Private methods **/
  private loadEvents(): void {
    this.eventLogFacade.loadEvents();
  }

  private loadEventsData()
  {
    this.eventLogFacade.loadEventsData();
  }

  getEventList()
  {
    this.eventsdata$.subscribe((response: any) => {
      if (response !== undefined && response !== null) {
        this.eventResponseList = response;
      }
    });
  }

  onShowSearchClicked() {
    this.isShownSearch = !this.isShownSearch;
  }

  onCloseEventLogClicked() {
    this.closeAction.emit();
    this.isShowEventLog = !this.isShowEventLog;
  }

  onOpenEventDetailsClicked(template: TemplateRef<unknown>, isSubEvent: boolean, parentEventLogId : string|null = null, parentEventId : string|null = null): void {
    this.isSubEvent = isSubEvent;
    this.parentEventLogId = parentEventLogId;
    if(isSubEvent && parentEventId)
    {
      this.SubEventList = this.eventResponseList.filter((item : any) => item.parentEventId ? item.parentEventId.toString().toLowerCase() == parentEventId.toLowerCase() : false);
    }
    else
    {
      this.eventList = this.eventResponseList.filter((item : any) => item.parentEventId.toStrig );
    }
    this.isAddEventDialogOpen = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-lg app-c-modal-np',
    });
  }
  onCloseEventDetailsClicked(data: any) {
    if (data) {
      this.isAddEventDialogOpen.close();
    }
  }
}
