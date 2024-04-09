/** Angular **/
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  OnDestroy,
  Output,
  TemplateRef,
  Input,
  ViewChild,
  ElementRef,
  HostListener,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
/** Facades **/
import { EventLogFacade } from '@cms/productivity-tools/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { DocumentFacade } from '@cms/shared/util-core';
import { LovFacade } from '@cms/system-config/domain';
import { DialogService } from '@progress/kendo-angular-dialog';
import { State } from '@progress/kendo-data-query';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'productivity-tools-event-log',
  templateUrl: './event-log.component.html',
  styleUrls: ['./event-log.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventLogComponent implements OnInit, OnDestroy {
  @ViewChild('eventtFilterPopover', { read: ElementRef })
  public eventtFilterPopover!: ElementRef;
  @ViewChild('eventFilterCardBtn')
  eventFilterCardBtn!: ElementRef;
  /** Output properties **/
  @Output() closeAction = new EventEmitter();
  @Input() eventAttachmentTypeLov$!: any;
  @Input() entityType: any;
  @Input() entityId: any;
  @Input() clientCaseEligibilityId: any;

  /** Public properties **/
  eventAttachmentTypeList : any;
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
  isFilterApplied = false;
  isEventFilterPopoverOpen = false;
  isSubEvent = false;
  // actions: Array<any> = [{ text: 'Action' }];
  filterData: any = { logic: 'and', filters: [] };
eventListLoader = false;
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
  skeletonCounts = [1, 2, 3, 4, 5];
  eventAttachmentTypeLov$Subscription = new Subscription();
  events$Subscription = new Subscription();
  eventsdata$Subscription = new Subscription();

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
    private readonly lovFacade: LovFacade,
    private documentFacade: DocumentFacade
  ) {}
  
  /** Lifecycle hooks **/
  ngOnInit() {
    this.loadEventsData();
    this.loadEvents();
    this.subscribeEvents();
    this.getEventList();
    this.lovFacade.getEventAttachmentTypeLov();
    this.eventAttachmentTypeLov$Subscription = this.eventAttachmentTypeLov$.subscribe((response: any) => {
      if (response !== undefined && response !== null) {
       this.eventAttachmentTypeList = response;
      }
    });

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
  onShowHideFilterEvent(){
   
    if(this.isShowFilter === true){
      this.isShowFilter = false;
    } else {
      this.isShowFilter = true;
    }
    this.cd.detectChanges();
  }

  onShowFilterEventPopover(){
    this.isEventFilterPopoverOpen = !this.isEventFilterPopoverOpen;
    if(this.isShowFilter === false){
      this.isShowFilter = false;
    } else {
      this.isShowFilter = true;
    }
    this.cd.detectChanges();
  }
  private subscribeEvents() {
    this.eventListLoader = true;
    this.events$Subscription = this.events$.subscribe((data) => {
      this.events = data;
      this.eventListLoader = false;
      this.cd.detectChanges();
    });
  }

  private loadEventsData() {
    this.eventLogFacade.loadEventsData();
  }

  getEventList() {
    this.eventListLoader = true;
    this.eventsdata$Subscription = this.eventsdata$.subscribe((response: any) => {
      if (response !== undefined && response !== null) {
        this.eventResponseList = response;
        this.eventListLoader = false;
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
    this.isEventFilterPopoverOpen = false;
    this.isFilterApplied = false;
    this.cd.detectChanges();
    this.filterData = { logic: 'and', filters: [] };  
    this.loadEventLogs();
 
  }

  onEventLogFilterFilterClicked()
  {
    this.setFilteredText();
    this.loadEventLogs(); 
    this.isEventFilterPopoverOpen = false;
    this.isFilterApplied = true;
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
    this.setFilterOfCaseWorkerAndEventType("eventDesc","eventtypefilterbyoperator","eventtypefilterbyvalue");
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
    this.eventLogFacade.loadEvents(gridDataRefinerValue, this.entityId);
  }

  sortByMethod(event:any)
  {
    this.sortType = event;
    this.loadEventLogs();
    this.isEventFilterPopoverOpen = false;
    this.cd.detectChanges();
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

  downloadAttachment(eventLogAttachmentId: any, filePath: string){
    let pathSplitArray = filePath.split('$');
    let fileNmae = pathSplitArray[pathSplitArray.length-1];
    this.documentFacade.viewOrDownloadEventFile(false, eventLogAttachmentId, fileNmae);
  }

  @HostListener('document:keydown', ['$event'])
  public keydown(event: KeyboardEvent): void {
    if (event) {
      if (event.code === 'Escape') {
        this.toggleFilterPopoverOpen(false);
      }
    }
  }

  @HostListener('document:click', ['$event'])
  public documentClick(event: KeyboardEvent): void {
    if (event) {
      if (!this.contains(event.target)) {
        // this.toggleFilterPopoverOpen(false);
      }
    }
  }

  public toggleFilterPopoverOpen(show?: boolean): void {
    this.isEventFilterPopoverOpen = show ?? !this.isEventFilterPopoverOpen;
  }

  private contains(target: any): boolean {
    return (
      this.eventFilterCardBtn.nativeElement.contains(target) ||
      (this.eventtFilterPopover
        ? this.eventtFilterPopover.nativeElement.contains(target)
        : false)
    );
  }
  showHideSearch()
  {
    this.isShownSearch = this.searchText.length > 0 ? true:false;
  }

  downloadOldAttachment(path : any)
  {
    let pathSplitArray = path.split('$');
    let fileName = pathSplitArray[pathSplitArray.length-1];
    this.documentFacade.viewOrDownloadOldAttachemntFile(false, path, fileName);
  }

  ngOnDestroy(): void {
    this.eventAttachmentTypeLov$Subscription?.unsubscribe();
    this.events$Subscription?.unsubscribe();
    this.eventsdata$Subscription?.unsubscribe();
  }
}
