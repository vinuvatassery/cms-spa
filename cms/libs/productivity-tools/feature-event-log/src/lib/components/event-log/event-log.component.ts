/** Angular **/
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
  TemplateRef,
  Input,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
/** Facades **/
import { EventLogFacade } from '@cms/productivity-tools/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { Lov, LovFacade } from '@cms/system-config/domain';
import { DialogService } from '@progress/kendo-angular-dialog';
import { State } from '@progress/kendo-data-query';
import { Observable } from 'rxjs';

@Component({
  selector: 'productivity-tools-event-log',
  templateUrl: './event-log.component.html',
  styleUrls: ['./event-log.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventLogComponent implements OnInit {
  /** Output properties **/
  @Output() closeAction = new EventEmitter();
  @Input() eventAttachmentTypeLov$!: Observable<Lov[]>;
  @Input() entityType: any;
  @Input() entityId: any;
  @Input() clientCaseEligibilityId: any;

  /** Public properties **/

  clientId = 0;
  parentEventLogId: any;
  eventList: any = [];
  SubEventList: any = [];
  eventResponseList: any = [];
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
  filterData: any = { logic: 'and', filters: [] };

  isShowFilter = false;
  filterBy = "";
  public state!: State;
  searchText : any= "";
  sortColumnName = 'creationTime';
  sortType = 'desc';
  isEnableFilterBtn = false;
  operators = [
    {value: 'startswith', text: 'Starts with'},
    {value: 'eq', text: 'Is equal to'},
    {value: 'endswith', text: 'Ends with'},
    {value: 'contains', text: 'Contains'}
    ];
  searchValue = '';
  filterDataQueryArray:any[]=[];

  public eventLogFilterForm: FormGroup = new FormGroup({
    caseworkerfilterbyoperator: new FormControl('', []),
    eventtypefilterbyoperator: new FormControl('', []),
    caseworkerfilterbyvalue: new FormControl('', []),    
    eventtypefilterbyvalue: new FormControl('', []),
    afterdatefilter : new FormControl('', []),
    beforedatefilter : new FormControl('', []),
  });
  
  /** Constructor **/

  constructor(
    private readonly eventLogFacade: EventLogFacade,
    private dialogService: DialogService,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef,
    private readonly lovFacade: LovFacade
  ) {}

  /** Lifecycle hooks **/
  ngOnInit() {
    this.loadEventsData();
    if(this.entityType =='CLIENT')
    {
      this.clientId =   this.route.snapshot.queryParams['id'];
      this.clientCaseEligibilityId = this.route.snapshot.queryParams['cid'];
      this.entityId = this.clientId.toString();
    };
    this.eventAttachmentTypeLov$ = this.lovFacade.eventAttachmentTypeLov$
    this.loadEvents();
    this.subscribeEvents();
    this.getEventList();
    this.lovFacade.getEventAttachmentTypeLov();
  }

  /** Private methods **/
  private loadEvents(): void {
    this.filterData = [];
    const paginationData = {
      skipCount: 0,
      pagesize: 10,
      sortColumn: 'creationTime',
      sortType: 'desc',
      filter: JSON.stringify(this.filterData),
    };
    this.eventLogFacade.loadEvents(paginationData,this.entityId);
  }

  private subscribeEvents() {
    this.events$.subscribe((data) => {
      this.events = data;
      this.cd.detectChanges();
    });
  }

  private loadEventsData() {
    this.eventLogFacade.loadEventsData();
  }

  getEventList() {
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

  onOpenEventDetailsClicked(
    template: TemplateRef<unknown>,
    isSubEvent: boolean,
    parentEventLogId: string | null = null,
    parentEventId: string | null = null
  ): void {
    this.isSubEvent = isSubEvent;
    this.parentEventLogId = parentEventLogId;
    if (isSubEvent && parentEventId) {
      this.SubEventList = this.eventResponseList.filter((item: any) =>
        item.parentEventId
          ? item.parentEventId.toString().toLowerCase() ==
            parentEventId.toLowerCase()
          : false
      );
    } else {
      this.eventList = this.eventResponseList.filter(
        (item: any) => !item.parentEventId
      );
    }
    this.isAddEventDialogOpen = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-lg app-c-modal-np',
    });
  }
  onCloseEventDetailsClicked(data: any) {
    if (data) {
      this.loadEvents();
    }
    this.isAddEventDialogOpen.close();
  }

  isShowReadMore(elementId: any) {
    return true;
    var el = document.getElementById(elementId);
    var divHeight = el?.offsetHeight;
    //var lineHeight = parseInt(el?.style?.lineHeight?.toString());
    //var lines = divHeight?? 0 / lineHeight;
    console.log('Lines: ' + el?.style?.lineHeight?.toString());
  }

  onEventLogFilterClearClicked()
  {
    this.eventLogFilterForm.controls["caseworkerfilterbyoperator"].setValue('');
    this.eventLogFilterForm.controls["caseworkerfilterbyvalue"].setValue('');
    this.eventLogFilterForm.controls["eventtypefilterbyoperator"].setValue('');
    this.eventLogFilterForm.controls["eventtypefilterbyvalue"].setValue('');
    this.eventLogFilterForm.controls["afterdatefilter"].setValue('');
    this.eventLogFilterForm.controls["beforedatefilter"].setValue('');
    this.filterBy = "";
    this.isEnableFilterBtn = false;
    this.cd.detectChanges();
    this.filterData = { logic: 'and', filters: [] };
    this.loadEventLogs();
  }

  onEventLogFilterFilterClicked()
  {
    this.setFilteredText();  
    this.loadEventLogs();
    this.isShowFilter = false;
    this.cd.detectChanges();
  }

  private setFilteredText()
  {
    var text="";
    if(this.eventLogFilterForm.controls["caseworkerfilterbyvalue"].value != "" && this.eventLogFilterForm.controls["caseworkerfilterbyvalue"].value != null)
    {
      text += " Case Worker,";
    }
    if(this.eventLogFilterForm.controls["eventtypefilterbyvalue"].value != "" && this.eventLogFilterForm.controls["eventtypefilterbyvalue"].value != null)
    {
      text += " Event Type,";
    }
    if((this.eventLogFilterForm.controls["afterdatefilter"].value != "" && this.eventLogFilterForm.controls["afterdatefilter"].value != null) ||
    (this.eventLogFilterForm.controls["beforedatefilter"].value != "" && this.eventLogFilterForm.controls["beforedatefilter"].value != null))
    {
      text += " Date,";
    }
    if(text.length > 0)
    {
      this.filterBy = text.substring(0,text.length -1);
    }    
  }

  private setFilterOfCaseWorkerAndEventType(field:string, operator:string, value:string,)
  {
    if(this.eventLogFilterForm.controls[operator].value != "" && this.eventLogFilterForm.controls[operator].value != null)
    {
      let object ={
        filters: [
          {
            field: field,
            operator: this.eventLogFilterForm.controls[operator].value.toString(),
            value: this.eventLogFilterForm.controls[value].value.toString(),
          }
        ],
        logic: 'and',
      };
     this.filterDataQueryArray.push(object);
    }
  }

  private setFiltersForDataQuery()
  {
    
    this.filterDataQueryArray = [];

    if (this.searchText.length > 0 && this.isShownSearch) {
      let object = {
        filters: [
          {
            field: "ALL",
            operator: "contains",
            value: this.searchText,
          }
        ],
        logic: 'and',
      };
      this.filterDataQueryArray.push(object);
    }    
    this.setFilterOfCaseWorkerAndEventType("createdBy","caseworkerfilterbyoperator","caseworkerfilterbyvalue");
    this.setFilterOfCaseWorkerAndEventType("eventLogDesc","eventtypefilterbyoperator","eventtypefilterbyvalue");
    this.setDateFilters("creationTime");
    this.filterData = {logic:"and", filters: this.filterDataQueryArray};    
  }

  loadLogEvent() {
    this.loadEventLogs();
    this.subscribeEvents();
  }

  loadEventLogs()
  {
    this.setFiltersForDataQuery();
    const gridDataRefinerValue = {
      skipCount: 0,
      pagesize: 10,
      sort: this.sortColumnName,
      sortType: this.sortType ?? 'asc',
      filter: JSON.stringify(this.filterData.filters ?? [])  
    };
    console.log(gridDataRefinerValue);
    this.eventLogFacade.loadEvents(gridDataRefinerValue, this.entityId);
  }

  sortByMethod(event:any)
  {
    this.sortType = event;
    this.loadEventLogs();
  }

  
  onChange(field:any)
  {
    if(field==='AFTERDATE')
    {
      this.eventLogFilterForm.controls["beforedatefilter"].setValue('');
    }
    this.isEnableFilterBtn = this.enableDisableFilterButton();
  }

  enableDisableFilterButton()
  {
    if(this.eventLogFilterForm.controls["caseworkerfilterbyvalue"].value != "" && this.eventLogFilterForm.controls["caseworkerfilterbyvalue"].value != null)
    {
      return true;
    }
    if(this.eventLogFilterForm.controls["eventtypefilterbyvalue"].value != "" && this.eventLogFilterForm.controls["eventtypefilterbyvalue"].value != null)
    {
      return true;
    }
    if(this.eventLogFilterForm.controls["afterdatefilter"].value != ""  && this.eventLogFilterForm.controls["afterdatefilter"].value != null)
    {
      return true;
    }
    if(this.eventLogFilterForm.controls["beforedatefilter"].value != "" && this.eventLogFilterForm.controls["beforedatefilter"].value != null)
    {
      return true;
    }
    return false;
  }

  
  private setDateFilters(field:string)
  {
    var filterArray=[];
    if(this.eventLogFilterForm.controls["afterdatefilter"].value != "" && this.eventLogFilterForm.controls["afterdatefilter"].value != null)
    {
      filterArray.push(
        {
          field: field,
          operator: "gte",
          value: this.eventLogFilterForm.controls["afterdatefilter"].value
        }
      )
    }
    if(this.eventLogFilterForm.controls["beforedatefilter"].value != "" && this.eventLogFilterForm.controls["beforedatefilter"].value != null)
    {
      filterArray.push(
        {
          field: field,
          operator: "lte",
          value: this.eventLogFilterForm.controls["beforedatefilter"].value
        }
      )
    }
    
    let object ={
      filters: 
        filterArray
      ,
      logic: 'and',
    };
    this.filterDataQueryArray.push(object);
  }


  private setFilterOfAfterAndBeforeDate(field:string, operator:string, value:string,)
  {
    if(this.eventLogFilterForm.controls[value].value != "" && this.eventLogFilterForm.controls[value].value != null)
    {
      let object ={
        filters: [
          {
            field: field,
            operator: operator,
            value: this.eventLogFilterForm.controls[value].value,
          }
        ],
        logic: 'and',
      };
     this.filterDataQueryArray.push(object);
    }
  }
  
}
