/** Angular **/
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { ClientInsurancePlans, InsurancePremium, InsurancePremiumDetails, PolicyPremiumCoverage,FinancialPremiumsFacade } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { DialogService } from '@progress/kendo-angular-dialog';
import { FilterService, GridDataResult, SelectableMode, SelectableSettings } from '@progress/kendo-angular-grid';
import {
  CompositeFilterDescriptor, filterBy
} from '@progress/kendo-data-query';
import { BatchPremium } from 'libs/case-management/domain/src/lib/entities/financial-management/batch-premium';
import { Observable, Subject, BehaviorSubject, Subscription } from 'rxjs';
@Component({
  selector: 'cms-financial-premiums-process-list',
  templateUrl: './financial-premiums-process-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialPremiumsProcessListComponent implements  OnChanges, OnDestroy {
  @ViewChild('batchPremiumsConfirmationDialogTemplate', { read: TemplateRef })
  batchPremiumsConfirmationDialogTemplate!: TemplateRef<any>;
  @ViewChild('removePremiumsConfirmationDialogTemplate', { read: TemplateRef })
  removePremiumsConfirmationDialogTemplate!: TemplateRef<any>;
  @ViewChild('editPremiumsDialogTemplate', { read: TemplateRef })
  editPremiumsDialogTemplate!: TemplateRef<any>;
  @ViewChild('addPremiumsDialogTemplate', { read: TemplateRef })
  addPremiumsDialogTemplate!: TemplateRef<any>;

  public formUiStyle: UIFormStyle = new UIFormStyle();
  private removePremiumsDialog: any;
  private batchConfirmPremiumsDialog: any;
  private editPremiumsFormDialog: any;
  private addPremiumsFormDialog: any;
  private addClientRecentPremiumsDialog: any;
  isRemoveBatchClosed = false;
  isBatchPremiumsClicked = false;
  isRemovePremiumsOption = false;
  isEditBatchClosed = false;
  isAddPremiumClosed = false;
  isSendReportOpened = false;
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  isProcessGridExpand = true;
  sendReportDialog: any;
  gridLoaderSubject = new BehaviorSubject(false);
  gridDataResult!: GridDataResult;
  @Input() premiumsType: any;
  @Input() batchingPremium$: any; 
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() financialPremiumsProcessGridLists$: any;
  @Input() insurancePlans$!: Observable<ClientInsurancePlans[]>;
  @Input() insurancePlansLoader$: any;
  @Input() insuranceCoverageDates$: any;
  @Input() insuranceCoverageDatesLoader$: any;
  @Input() actionResponse$: any;
  @Input() existingPremiums$!: Observable<PolicyPremiumCoverage[]>;
  @Input() insurancePremium$!: Observable<InsurancePremiumDetails>;
  @Output() clientChangeEvent = new EventEmitter<any>();
  @Output() premiumsExistValidationEvent = new EventEmitter<{ clientId: number, premiums: PolicyPremiumCoverage[] }>();
  @Output() savePremiumsEvent = new EventEmitter<InsurancePremium[]>();
  @Output() loadFinancialPremiumsProcessListEvent = new EventEmitter<any>();
  @Output() loadPremiumEvent = new EventEmitter<string>();
  @Output() updatePremiumEvent = new EventEmitter<any>();
  @Output() OnbatchClaimsClickedEvent = new EventEmitter<any>();
  public selectedProcessClaims: any[] = [];
  public state!: any;
  sortColumn = 'vendorName';
  sortDir = 'Ascending';
  columnsReordered = false;
  filteredBy = '';
  searchValue = '';
  isFiltered = false;
  filter!: any;
  selectedColumn!: any;
  columnName: string = '';
  columns: any = {
    clientFirstName:"Client Name",
    clientId:"Client Id",
  };
  columnDroplist : any = {
    ALL: "ALL",
    ClientFirstName:"clientFirstName",
    ClientId:"clientId"
  }
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  public gridFilter: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  isRemovePremiumGridOptionClosed = false;
  gridFinancialPremiumsProcessDataSubject = new Subject<any>();
  gridFinancialPremiumsProcessData$ =
  this.gridFinancialPremiumsProcessDataSubject.asObservable();
  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  vendorId:any;
  clientId:any;
  clientName:any="";
  directRemoveClicked: any = false;
  medicalPremiumListSubject = new Subject<any>();
  medicalPremiumList$ =this.medicalPremiumListSubject.asObservable();
  sendReportCount: number = 0;
  isAllSelected = false;
  processGridDataList: any= [];
  selectAll:boolean=false;
  unCheckedProcessRequest:any=[];
  checkedAndUncheckedRecordsFromSelectAll:any=[];
  financialPremiumsProcessGridLists: any = [];
  selectedSendReportList!: any;
  isSendReportClicked = false;
  isPageCountChanged: boolean = false;
  premiumId!:string;
  isPageChanged: boolean = false;
  selectedDeletePremiumsList!: any;

  public premiumsProcessMore = [
    {
      buttonType: 'btn-h-primary',
      text: 'Send Reports',
      icon: 'mail',
      click: (data: any): void => {
        if (!this.isSendReportOpened) {
          this.isSendReportOpened = true; 
          this.recordCountWhenSelectallClicked = this.totalGridRecordsCount;
          this.onBatchPremiumsGridSelectedClicked();
        }
      },
    },
    {
      buttonType: 'btn-h-primary',
      text: 'Add Premiums',
      icon: 'add',
      click: (data: any): void => {
        if (!this.isAddPremiumClosed) {
          this.isAddPremiumClosed = true;
          this.onClickOpenAddPremiumsFromModal(this.addPremiumsDialogTemplate);
        }
      },
    },

    {
      buttonType: 'btn-h-danger',
      text: 'Remove Premiums',
      icon: 'delete',
      click: (data: any): void => {
        if (!this.isRemoveBatchClosed) {
          this.isRemoveBatchClosed = true;
          this.directRemoveClicked = true;
          this.onBatchPremiumsGridSelectedClicked();
        }
      },
    },
  ];
  public processGridActions = [
    {
      buttonType: 'btn-h-primary',
      text: 'Edit Premiums',
      icon: 'edit',
      click: (data: any): void => {
        if (!this.isEditBatchClosed) {
          this.isEditBatchClosed = true;
          this.onEditPremiumsClick(data?.insurancePremiumId,data?.vendorId,data?.clientId,data.clientFullName);
        }
      },
    },
    {
      buttonType: 'btn-h-danger',
      text: 'Remove Premiums',
      icon: 'delete',
      click: (data: any): void => {
        if (!this.isRemovePremiumGridOptionClosed) {
          this.isRemovePremiumGridOptionClosed = true;
          this.directRemoveClicked = false;
          this.onSinglePremiumRemove(data);
          this.onRemovePremiumsOpenClicked(this.removePremiumsConfirmationDialogTemplate);
        }
      },
    },
  ];

  public selectableSettings: SelectableSettings;
  public checkboxOnly = true;
  public mode: SelectableMode = 'multiple';
  public drag = false;
  actionResponseSubscription = new Subscription;
  recordCountWhenSelectallClicked: number = 0;
  totalGridRecordsCount: number = 0;;

  
  /** Constructor **/
  constructor(
  private financialPremiumsFacade : FinancialPremiumsFacade ,
    private readonly cdr: ChangeDetectorRef,
    private dialogService: DialogService,
    private readonly route: Router,
    private readonly ref: ChangeDetectorRef,
  ) {

    this.selectableSettings = {
      checkboxOnly: this.checkboxOnly,
      mode: this.mode,
      drag: this.drag,
    };
  }

  ngOnInit(): void {
    this.premiumGridlistDataHandle();
    this.addActionRespSubscription();

  }

  ngOnDestroy(): void {
    this.unsubscribeFromActionResponse();
  }

  premiumGridlistDataHandle() {
    this.financialPremiumsProcessGridLists$.subscribe((data: GridDataResult) => {
      this.gridDataResult = data;
      this.gridDataResult.data = filterBy(
        this.gridDataResult.data,
        this.filterData
      );
      this.gridFinancialPremiumsProcessDataSubject.next(this.gridDataResult);
      if (data?.total >= 0 || data?.total === -1) {
        this.gridLoaderSubject.next(false);
      }
      this.financialPremiumsProcessGridLists = this.gridDataResult?.data;
      if(this.recordCountWhenSelectallClicked == 0){
        this.recordCountWhenSelectallClicked = this.gridDataResult?.total;
        this.totalGridRecordsCount = this.gridDataResult?.total;
      }
      if(!this.selectAll)
      {
      this.financialPremiumsProcessGridLists.forEach((item1: any) => {
        const matchingGridItem = this.selectedSendReportList?.SelectedSendReports.find((item2: any) => item2.paymentRequestId === item1.paymentRequestId);
        if (matchingGridItem) {
          item1.selected = true;
        } else {
          item1.selected = false;
        }
      });
    }
    //If the user is selecting the individual check boxes and changing the page count
    this.handlePageCountSelectionChange();
    //If the user click on select all header and either changing the page number or page count
    this.pageNumberAndCountChangedInSelectAll();
    this.gridLoaderSubject.next(false);
    });
    this.ref.detectChanges();
  }
  
  pageNumberAndCountChangedInSelectAll() {
    //If selecte all header checked and either the page count or the page number changed
    if(this.selectAll && (this.isPageChanged || this.isPageCountChanged)){
      this.selectedSendReportList = [];
      this.selectedSendReportList.SelectedSendReports = [];
      this.financialPremiumsProcessGridLists.forEach((eachRecord: any) => {
        eachRecord.selected = true;
      });
      this.selectedSendReportList.SelectedSendReports = this.financialPremiumsProcessGridLists;
      if(this.isSendReportOpened){
        this.sendReportCount = this.recordCountWhenSelectallClicked;
      }else{
      this.getSelectedReportCount(this.selectedSendReportList?.SelectedSendReports);
      }
    }
  }

  handlePageCountSelectionChange() {
      if(!this.selectAll && this.isPageCountChanged){
        // Extract the payment request ids from grid data
        const idsToKeep: number[] = this.financialPremiumsProcessGridLists.map((item: any) => item.paymentRequestId);
        // Remove items from selected records based on the IDs from grid data
        for (let i = this.selectedSendReportList?.SelectedSendReports?.length - 1; i >= 0; i--) {
          if (!idsToKeep.includes(this.selectedSendReportList?.SelectedSendReports[i].paymentRequestId)) {
            this.selectedSendReportList?.SelectedSendReports.splice(i, 1); // Remove the item at index i
          }
        }
        this.getSelectedReportCount(this.selectedSendReportList?.SelectedSendReports);
      }
  }

  onSinglePremiumRemove(selection: any) {
    this.selectedKeysChange(selection);
  }

  ngOnChanges(): void {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
      
    };
    this.loadFinancialPremiumsProcessListGrid();
  }

  private loadFinancialPremiumsProcessListGrid(): void {
    this.loadPremiumsProcess(
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType,
      this.filter
    );
  }
  loadPremiumsProcess(
    skipCountValue: number,
    maxResultCountValue: number,
    sortValue: string,
    sortTypeValue: string,
    filter: any
  ) {
    this.gridLoaderSubject.next(true);
    const gridDataRefinerValue = {
      skipCount: skipCountValue,
      pagesize: maxResultCountValue,
      sortColumn: sortValue,
      sortType: sortTypeValue,
      filter: this.filter ? this.filter : null,
    };
    this.loadFinancialPremiumsProcessListEvent.emit(gridDataRefinerValue);
  }
  filterChange(filter: CompositeFilterDescriptor): void {
    this.gridFilter = filter;
  }

  onChange(event: any) {
    this.defaultGridState();
    this.columnName = this.state.columnName = this.columnDroplist[this.selectedColumn];
    this.sortColumn = this.columns[this.selectedColumn];
    this.filter = {logic:'and',filters:[{
      "filters": [
          {
              "field": this.columnDroplist[this.selectedColumn] ?? "clientFullName",
              "operator": "startswith",
              "value": event
          }
      ],
      "logic": "and"
  }]}
  let stateData = this.state
  stateData.filter = this.filter
    this.dataStateChange(stateData);
  }

  defaultGridState() {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
      filters: { logic: 'and', filters: [] },
      selectedColumn: 'ALL',
      columnName: '',
      searchValue: '',
    };
  }

  onColumnReorder($event: any) {
    this.columnsReordered = true;
  }

  dataStateChange(stateData: any): void {
    this.isPageCountChanged = false;
    this.isPageChanged = true;
    if (stateData.filter?.filters.length > 0) {
      let stateFilter = stateData.filter?.filters.slice(-1)[0].filters[0];
      this.columnName = stateFilter.field;

      this.filter = stateFilter.value;

      this.isFiltered = true;
      const filterList = [];
      for (const filter of stateData.filter.filters) {
        filterList.push(this.columns[filter.filters[0].field]);
      }
      this.isFiltered = true;
      this.filteredBy = filterList.toString();
    }
    else {
      this.filter = '';
      this.columnName = '';
      this.isFiltered = false;
    }
    this.state = stateData;
    this.setGridState(stateData);
    this.loadFinancialPremiumsProcessListGrid();
  }
  public setGridState(stateData: any): void {
    this.state = stateData;

    const filters = stateData.filter?.filters ?? [];

    const filterList = this.state?.filter?.filters ?? [];
    this.filter = JSON.stringify(filterList);

    if (filters.length > 0) {
      const filterListData = filters.map((filter:any) => this.columns[filter?.filters[0]?.field]);
      this.isFiltered = true;
      this.filteredBy = filterListData.toString();
      this.cdr.detectChanges();
    }
    else {
      this.filter = "";
      this.columnName = "";
      this.isFiltered = false;
    }

    this.sort = stateData.sort;
    this.sortValue = stateData.sort[0]?.field ?? "";
    this.sortType = stateData.sort[0]?.dir ?? "";
    this.state = stateData;
    this.sortColumn = this.columns[stateData.sort[0]?.field];
    this.sortDir = "";
    if(this.sort[0]?.dir === 'asc'){
      this.sortDir = 'Ascending';
    }
    if(this.sort[0]?.dir === 'desc'){
      this.sortDir = 'Descending';
    }
    this.loadFinancialPremiumsProcessListGrid();
  }
  // updating the pagination infor based on dropdown selection
  pageSelectionChange(data: any) {
    this.isPageCountChanged = true;
    this.isPageChanged = false;
    this.state.take = data.value;
    this.state.skip = 0;
    this.isPageCountChanged = true;
    this.loadFinancialPremiumsProcessListGrid();
  }
  groupFilterChange(value: any, filterService: FilterService): void {
    filterService.filter({
      filters: [
        {
          field: 'group',
          operator: 'eq',
          value: value.lovDesc,
        },
      ],
      logic: 'or',
    });
  }
  dropdownFilterChange(
    field: string,
    value: any,
    filterService: FilterService
  ): void {
    filterService.filter({
      filters: [
        {
          field: field,
          operator: 'eq',
          value: value.lovDesc,
        },
      ],
      logic: 'or',
    });
    this.gridLoaderSubject.next(false);
  }

  public onBatchPremiumsClicked(template: TemplateRef<unknown>): void {
    this.batchConfirmPremiumsDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    });
  }
  onModalBatchPremiumsModalClose() {
      this.batchConfirmPremiumsDialog.close();
  }

  public onRemovePremiumsOpenClicked(template: TemplateRef<unknown>): void {
    this.removePremiumsDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    });
  }

  onModalRemovePremiumsModalClose(result: any) {
    if (result) {
      this.isRemovePremiumGridOptionClosed = false;
      this.removePremiumsDialog.close();
    }
  }

  onRemovingPremiums(result: boolean) {
    if(result){
      this.state = {
        skip: 0,
        take: this.pageSizes[0]?.value,
        sort: this.sort,
      };
      this.loadFinancialPremiumsProcessListGrid();
      this.onBatchPremiumsGridSelectedCancelClicked();
    }
  }

  public onSendReportOpenClicked(template: TemplateRef<unknown>): void {
    this.sendReportDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    });
  }

  onClickOpenEditPremiumsFromModal(template: TemplateRef<unknown>): void {
    this.editPremiumsFormDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-full add_premiums_modal',
    });
  }
  modalCloseEditPremiumsFormModal(result: any) {
    if (result && this.editPremiumsFormDialog) {
      this.isEditBatchClosed = false;
      this.editPremiumsFormDialog.close();
    }
  }

  onClickOpenAddPremiumsFromModal(template: TemplateRef<unknown>): void {
    this.addPremiumsFormDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-lg-100 app-c-modal-np',
    });
  }
  modalCloseAddPremiumsFormModal(result: any) {
    if (result && this.addPremiumsFormDialog) {
      this.isAddPremiumClosed = false;
      this.addPremiumsFormDialog.close();
    }
  }
  onSplitBatchPremiumsClicked(){
        this.isBatchPremiumsClicked = true;
        this.onBatchPremiumsGridSelectedClicked();
  }
  onBatchPremiumsGridSelectedClicked() {
    this.isProcessGridExpand = false;
  }

  onBatchPremiumsGridSelectedCancelClicked() {
    this.isProcessGridExpand = true;
    this.isRemoveBatchClosed = false;
    this.isAddPremiumClosed = false;
    this.isBatchPremiumsClicked = false;
    this.selectedProcessClaims = [];
    this.isSendReportOpened = false;
    this.markAsUnChecked(this.selectedSendReportList?.SelectedSendReports);
    this.markAsUnChecked(this.selectedSendReportList?.UnSelectedSendReports);
    this.markAsUnChecked(this.financialPremiumsProcessGridLists);
    this.unCheckedProcessRequest = [];
    this.checkedAndUncheckedRecordsFromSelectAll = [];
    if(this.selectedSendReportList){
      this.selectedSendReportList.SelectedSendReports = [];
    this.selectedSendReportList.UnSelectedSendReports = [];
    }
    this.getSelectedReportCount(this.selectedSendReportList?.SelectedSendReports);
    this.selectAll = false;
    this.recordCountWhenSelectallClicked = 0;
  }

  clientRecentPremiumsModalClicked (template: TemplateRef<unknown>, data:any): void {
    this.addClientRecentPremiumsDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal  app-c-modal-bottom-up-modal',
      animation:{
        direction: 'up',
        type:'slide',
        duration: 200
      }
    });
  }

gridlistDataHandle() {
    this.medicalPremiumList$.subscribe((data: GridDataResult) => {
    this.gridDataResult = data;
  });

}
closeRecentPremiumsModal(result: any){
    if (result) { 
      this.addClientRecentPremiumsDialog.close();
    }
  }

  onSendReportCloseClicked(result: any) {
    if (result) {
      this.sendReportDialog.close();
    }
  }

  getSelectedReportCount(selectedSendReportList : []){
    this.sendReportCount = selectedSendReportList.length;
  }

  selectionChange(dataItem:any,selected:boolean){
    // this.selectAll = false;
    if(!selected){
      this.unCheckedProcessRequest.push({'paymentRequestId':dataItem.paymentRequestId,'vendorAddressId':dataItem.vendorAddressId,'selected':true});
        const index = this.checkedAndUncheckedRecordsFromSelectAll.findIndex((item:any) => item.paymentRequestId == dataItem.paymentRequestId);
        if (index !== -1) {
          this.checkedAndUncheckedRecordsFromSelectAll.splice(index, 1);
        }
    }
    else{
      this.unCheckedProcessRequest = this.unCheckedProcessRequest.filter((item:any) => item.paymentRequestId !== dataItem.paymentRequestId);
      this.checkedAndUncheckedRecordsFromSelectAll.push({'paymentRequestId':dataItem.paymentRequestId,'vendorAddressId':dataItem.vendorAddressId,'selected':true});
    }
    this.selectedSendReportList = {'selectAll':this.selectAll,'UnSelectedSendReports':this.unCheckedProcessRequest,
    'SelectedSendReports':this.checkedAndUncheckedRecordsFromSelectAll, 'batchId':null, 'currentSendReportsGridFilter':this.state.filter}
    if(this.selectAll && this.isSendReportOpened){
      this.recordCountWhenSelectallClicked = selected == true ? this.recordCountWhenSelectallClicked + 1 : this.recordCountWhenSelectallClicked - 1;
      this.sendReportCount = this.recordCountWhenSelectallClicked;
    }else{
    this.getSelectedReportCount(this.selectedSendReportList?.SelectedSendReports);
    }
    this.ref.detectChanges();
  }

  selectionAllChange(){
    this.unCheckedProcessRequest=[];
    this.checkedAndUncheckedRecordsFromSelectAll=[];
    if(this.selectAll){
      this.markAsChecked(this.financialPremiumsProcessGridLists);
    }
    else{
      this.markAsUnChecked(this.financialPremiumsProcessGridLists);
    }
    this.selectedSendReportList = {'selectAll':this.selectAll,'UnSelectedSendReports':this.unCheckedProcessRequest,
    'SelectedSendReports':this.checkedAndUncheckedRecordsFromSelectAll, 'batchId':null, 'currentSendReportsGridFilter': this.state.filter, "filter": this.filter}
    if(this.selectAll && this.isSendReportOpened){
      this.sendReportCount = this.recordCountWhenSelectallClicked;
    }else{
    this.getSelectedReportCount(this.selectedSendReportList?.SelectedSendReports);
    }
    this.ref.detectChanges();
  }

  markAsChecked(data:any){
    data.forEach((element:any) => { 
      if(this.selectAll){
        element.selected = true;
      } 
      else{
        element.selected = false;
      }
      this.checkedAndUncheckedRecordsFromSelectAll.push(element);
      if(this.unCheckedProcessRequest.length > 0 || this.checkedAndUncheckedRecordsFromSelectAll.length > 0){
        let itemMarkedAsUnChecked = this.unCheckedProcessRequest.find((x:any)=>x.paymentRequestId ===element.paymentRequestId);
        //Unchecked records from select all result
        if(itemMarkedAsUnChecked !== null && itemMarkedAsUnChecked !== undefined){
          element.selected = false;
        }
        let itemMarkedAsChecked = this.checkedAndUncheckedRecordsFromSelectAll.find((x:any)=>x.paymentRequestId ===element.paymentRequestId);
        //Checked records after unselecting a few unselected records
        if(itemMarkedAsChecked !== null && itemMarkedAsChecked !== undefined){
          element.selected = true;
        }
      }
    });
  }

  markAsUnChecked(data:any){
      data.forEach((element:any) => {     
        element.selected = false;    
    });
    if(!this.selectAll && this.isSendReportOpened){
      this.sendReportCount = 0;
      this.selectAll = false;
    }
  }

  loadInsurancePlans(client: any){
    this.clientChangeEvent.emit(client);
  }

  savePremiums(premiums: InsurancePremium[]){
    this.savePremiumsEvent.emit(premiums);
  }

  premiumsExistValidation(data: { clientId: number, premiums: PolicyPremiumCoverage[] } ){
    this.premiumsExistValidationEvent.emit(data);
  }

  clientRecentClaimsModalClicked(
    template: TemplateRef<unknown>,
    dataItem: any
  ): void {
    this.addClientRecentPremiumsDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal  app-c-modal-bottom-up-modal',
      animation: {
        direction: 'up',
        type: 'slide',
        duration: 200,
      },
    });
    this.vendorId=dataItem.vendorId;
    this.clientId=dataItem.clientId;
    this.clientName=dataItem.clientFullName;
  }

  onClientClicked(clientId: any) {
    this.route.navigate([`/case-management/cases/case360/${clientId}`]);
    this.closeRecentPremiumsModal(true);
  }

  onEditPremiumsClick(premiumId: string,vendorId:any,clientId:any,clientName:any){
    this.vendorId=vendorId;
    this.clientId=clientId;
    this.clientName=clientName;
    this.premiumId = premiumId
    this.onClickOpenEditPremiumsFromModal(this.editPremiumsDialogTemplate);
  }

  selectedKeysChange(selection: any) {
    this.selectedSendReportList = selection;
    this.checkedAndUncheckedRecordsFromSelectAll = [];
    this.checkedAndUncheckedRecordsFromSelectAll.push({'paymentRequestId':selection.paymentRequestId,'vendorAddressId':selection.vendorAddressId});
    this.selectedSendReportList = { 'SelectedSendReports':this.checkedAndUncheckedRecordsFromSelectAll };
    this.getSelectedReportCount(this.selectedSendReportList?.SelectedSendReports);
  }

  OnbatchClaimsClicked(){

    const input: BatchPremium = {
      managerId: '',
      PaymentRequestIds: this.selectedProcessClaims,
    };
    this.batchingPremium$.subscribe((_:any) =>{
      this.onModalBatchPremiumsModalClose()
      this.loadFinancialPremiumsProcessListGrid()
      this.onBatchPremiumsGridSelectedCancelClicked()
    })
    this.OnbatchClaimsClickedEvent.emit(input)
  }

  loadPremium(premiumId: string){
    this.loadPremiumEvent.emit(premiumId);
  }

  updatePremium(data: any){
    this.updatePremiumEvent.emit(data);
  }

  private addActionRespSubscription() {
    this.actionResponseSubscription = this.actionResponse$.subscribe((resp: boolean) => {
      if (resp) {
        this.modalCloseAddPremiumsFormModal(true);
        this.modalCloseEditPremiumsFormModal(true);
        this.loadFinancialPremiumsProcessListGrid();
      }
    });
  }

  private unsubscribeFromActionResponse() {
    if (this.actionResponseSubscription) {
      this.actionResponseSubscription.unsubscribe();
    }
  }
}
