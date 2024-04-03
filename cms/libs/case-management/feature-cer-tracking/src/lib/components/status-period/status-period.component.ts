/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter, ChangeDetectorRef, TemplateRef, ViewChild } from '@angular/core';
/** Facades **/
import { CaseFacade, StatusPeriodFacade, ClientEligibilityFacade, ClientFacade } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { CompositeFilterDescriptor, State } from '@progress/kendo-data-query';
import { DialogService } from '@progress/kendo-angular-dialog';
import { FilterService, GridComponent } from '@progress/kendo-angular-grid';
@Component({
  selector: 'case-management-status-period',
  templateUrl: './status-period.component.html',
  styleUrls: ['./status-period.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatusPeriodComponent implements OnInit {

  @Input() clientCaseId!: any;
  @Input() clientId!: any;
  @Input() clientCaseEligibilityId!: any;
  @Input() eligibilityStatus$:any;
  @Input() ddlGroups$:any;
  @Output() loadStatusPeriodEvent  = new EventEmitter<any>();
  /** Public properties **/
  @ViewChild(GridComponent) statusGrid!: GridComponent;
  StatusPeriod$ = this.statusPeriodFacade.statusPeriod$;
  public expandedDetailKeys: number[] = [1];
  public sortValue = this.statusPeriodFacade.sortValue;
  public sortType = this.statusPeriodFacade.sortType;
  public pageSizes = this.statusPeriodFacade.gridPageSizes;
  public gridSkipCount = this.statusPeriodFacade.skipCount;
  public sort = this.statusPeriodFacade.sort;
  public state!: State;
  selectedEligibilityId!: any;
  selectedCaseId!: any;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  isStatusPeriodDetailOpened = false;
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  isReadOnly$=this.caseFacade.isCaseReadOnly$;
  isStatusPeriodEdit = false;
  isCopyPeriod = false;
  sortColumn = 'eligibilityStartDate';
  sortDir = 'Ascending';
  columnsReordered = false;
  filteredBy = '';
  searchValue = '';
  isFiltered = false;
  filter!: any;
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  columns: any = {
    eligibilityStartDate: 'Status Start',
    eligibilityEndDate: 'Status End',
    eligibilityStatusDesc: 'Status',
    groupCodeDesc: 'Current Group',
    daysInGroup: 'Days in Group',
    familySize: 'Family Size',
    grossMonthlyIncome: 'Gross Monthly Income',
    fplspStart: 'FPL@SP Start',
    currentFPL:'Current FPL',
    reviewCompletedDate:'Review Completed'
  };
  eligibilityStatus:any;
  ddlGroups:any;
  eligibilityStatusDesc = null;
  groupCodeDesc = null
  private statusPeriodDialog: any;
  public actions = [
    {
      buttonType: "btn-h-primary",
      text: "Copy Status Period",
      icon: "content_copy",
      click: (dataItem: any, template: TemplateRef<unknown>): void => {
        if(dataItem.clientCaseEligibilityId){
          this.isCopyPeriod = true;
          this.onEditEligibilityPeriodClicked(dataItem.clientCaseId,dataItem.clientCaseEligibilityId, template);
        }
      },
    },
    {
      buttonType: "btn-h-primary",
      text: "Edit Status Period",
      icon: "edit",
      click: (dataItem: any, template: TemplateRef<unknown>): void => {
        if(dataItem.clientCaseEligibilityId){
          this.isStatusPeriodEdit = true;
          this.onEditEligibilityPeriodClicked(dataItem.clientCaseId,dataItem.clientCaseEligibilityId, template);
        }
      },
    }
  ];
  statusPeriodProfilePhoto$ =this.statusPeriodFacade.statusPeriodProfilePhotoSubject;

  /** Constructor **/
  constructor(
    private readonly statusPeriodFacade: StatusPeriodFacade,
    private caseFacade: CaseFacade,
    private cdr: ChangeDetectorRef,
    private clientEligibilityFacade: ClientEligibilityFacade,
    private dialogService: DialogService,
    private readonly clientFacade: ClientFacade,) { }
  

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.state = {
      skip: this.gridSkipCount,
      take: this.pageSizes[0]?.value
    };
    this.clientEligibilityFacade.eligibilityPeriodPopupOpen$.subscribe(response=>{
      this.isStatusPeriodDetailOpened = response;
      if(!this.isStatusPeriodDetailOpened)
      {
        this.isStatusPeriodEdit = false;
        this.isCopyPeriod = false;
      }
      this.cdr.detectChanges();
    });
    this.fetchStatusPeriodDetails();
    this.eligibilityStatus$.subscribe((eligibilityStatus:any)=>{
      this.eligibilityStatus = eligibilityStatus;
    });
    this.ddlGroups$.subscribe((ddlGroups:any) => {
      this.ddlGroups = ddlGroups;
    });
  }

  pageSelectionChange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadStatusPeriodData();
  }

  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
  }

  dropdownFilterChange(field: string, value: any, filterService: FilterService): void {
    if (field == "groupCodeDesc") {
      filterService.filter({
        filters: [{
          field: field,
          operator: "eq",
          value: value.groupCodeDesc
        }],
        logic: "or"
      });
      this.groupCodeDesc = value;
    }
    else {
      filterService.filter({
        filters: [{
          field: field,
          operator: "eq",
          value: value.lovCode
        }],
        logic: "or"
      });
      if (field == "eligibilityStatusDesc") {
        this.eligibilityStatusDesc = value;
      }
    }
  }

  public dataStateChange(stateData: any): void {
    this.sort = stateData.sort;
    this.sortValue = stateData.sort[0]?.field ?? this.sortValue;
    this.sortType = stateData.sort[0]?.dir ?? 'asc';
    this.state = stateData;
    this.sortDir = this.sort[0]?.dir === 'asc' ? 'Ascending' : 'Descending';
    this.filter = stateData?.filter?.filters;

    this.sortColumn = this.columns[stateData.sort[0]?.field];

    if (stateData.filter?.filters.length > 0) {
      this.isFiltered = true;
      const filterList = [];
      for (const filter of stateData.filter.filters) {
        filterList.push(this.columns[filter.filters[0].field]);
      }
      this.filteredBy = filterList.toString();
    } else {
      this.filter = null;
      this.isFiltered = false;
    }
    this.loadStatusPeriodData();
  }

   // Loading the grid data based on pagination
   private loadStatusPeriodData(): void {
    this.LoadStatusPeriodList(
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType     
    );
  }

  LoadStatusPeriodList(
    skipCountValue: number,
    maxResultCountValue: number,
    sortValue: string,
    sortTypeValue: string
  ) {
    const gridDataRefinerValue = {
      skipCount: skipCountValue,
      pageSize: maxResultCountValue,
      sortColumn: sortValue,
      sortType: sortTypeValue,
      filter : this.filter === undefined?null:this.filter
    };
    this.loadStatusPeriodEvent.next(gridDataRefinerValue);
  }

  fetchStatusPeriodDetails() {
    this.StatusPeriod$.subscribe((res: any) => {
      if(res['data'].length > 0) {
        res['data'].forEach((x:any, index: number) => {
          this.statusGrid?.collapseRow(index);
        });
        
        
      }
    })
  }

  onStatusPeriodDetailClosed(result: any) {
    this.isStatusPeriodDetailOpened = false;
    this.isStatusPeriodEdit = false;
    this.isCopyPeriod = false;
    if (result) {
      this.statusPeriodDialog.close();
    }
    this.cdr.detectChanges();
  }

  onModalSaveAndClose(result:any){
    if(result){
      this.statusPeriodDialog.close();
      this.clientEligibilityFacade.eligibilityPeriodPopupOpenSubject.next(false);
      this.isStatusPeriodDetailOpened=false;
      this.isStatusPeriodEdit = false;
      this.isCopyPeriod = false;
      this.clientFacade.runImportedClaimRules(this.clientId);
      this.loadStatusPeriodData();
      this.clientFacade.copyStatusPeriodTriggeredSubject.next(true);
    }
  }

  onEditEligibilityPeriodClicked(clientCaseId: any, clientCaseEligibilityId: any, template: TemplateRef<unknown>) {
    this.selectedCaseId = clientCaseId;
    this.selectedEligibilityId = clientCaseEligibilityId;
    this.clientEligibilityFacade.eligibilityPeriodPopupOpenSubject.next(true);
    this.statusPeriodDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    });
  }
  onStatusPeriodDetailClicked(template: TemplateRef<unknown>): void {
    this.statusPeriodDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    });
    this.isStatusPeriodEdit = false;
    this.isCopyPeriod = false;
    this.selectedCaseId = this.clientCaseId;
    this.selectedEligibilityId = this.clientCaseEligibilityId;
    this.isStatusPeriodDetailOpened = true;
  }


}



