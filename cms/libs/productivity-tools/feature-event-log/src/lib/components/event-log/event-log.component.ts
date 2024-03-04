/** Angular **/
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
  TemplateRef,
  Input
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
/** Facades **/
import { EventLogFacade } from '@cms/productivity-tools/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { DialogService } from '@progress/kendo-angular-dialog';
import { CompositeFilterDescriptor } from '@progress/kendo-data-query';

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
  clientId = 0
  parentEventLogId : any;
  eventList : any = [];
  SubEventList : any = [];
  eventResponseList : any = [];
  events$ = this.eventLogFacade.events$;
  events: any = [];
  isShowEventLog = false;
  isOpenEventLogDetails = false;
  isShownSearch = false;
  isAddEventDialogOpen: any;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  eventsdata$ = this.eventLogFacade.eventsdata$;
  isSubEvent = false;
  // actions: Array<any> = [{ text: 'Action' }];
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  public actions = [
    {
      buttonType: 'btn-h-primary',
      text: 'Sort Ascending',
      icon: 'arrow_upward',
      click: (): void => {},
    },
    {
      buttonType: 'btn-h-primary',
      text: 'Sort Descending',
      icon: 'arrow_downward',
      click: (): void => {},
    },
    {
      buttonType: 'btn-h-primary',
      text: 'Filter',
      icon: 'filter_list',
      click: (): void => {},
    },
  ];
  filterData: any = { logic: 'and', filters: [] };

  /** Constructor **/

  constructor(
    private readonly eventLogFacade: EventLogFacade,
    private dialogService: DialogService,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef
  ) {}

  /** Lifecycle hooks **/
  ngOnInit() {
    this.loadEventsData();
    this.loadEvents();
    debugger
    this.clientId = this.route.snapshot.queryParams['id'];
    this.subscribeEvents();
    this.getEventList();
  }

  /** Private methods **/
  private loadEvents(): void {
    this.createFilterData("");
    const paginationData = {
      skipCount: 0,
      pagesize: 10,
      sortColumn: 'creationTime',
      sortType: "desc",
      filter: JSON.stringify(this.filterData),
    };
    this.eventLogFacade.loadEvents(paginationData);
  }

  createFilterData(data: string){
    this.filterData = [
      {
        filters: [{ field: 'entityId', operator: 'eq', value: data }],
        logic: 'and',
      },
    ];
  }

  private subscribeEvents() {
    this.events$.subscribe((data) => {
      this.events = data;
      this.cd.detectChanges();
    });
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
      this.eventList = this.eventResponseList.filter((item : any) => !item.parentEventId );
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

  isShowReadMore(elementId: any) {
    return true;
      var el = document.getElementById(elementId);
      var divHeight = el?.offsetHeight
      //var lineHeight = parseInt(el?.style?.lineHeight?.toString());
      //var lines = divHeight?? 0 / lineHeight;
      console.log("Lines: " + el?.style?.lineHeight?.toString());
  }

  
}


