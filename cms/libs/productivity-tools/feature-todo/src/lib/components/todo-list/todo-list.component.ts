/** Angular **/
import {
  Component,
  OnInit,
  Output,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  Input,
  EventEmitter,
  ChangeDetectorRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { FinancialServiceTypeCode, FinancialVendorProviderTab, FinancialVendorProviderTabCode, WorkflowTypeCode } from '@cms/case-management/domain';
import { AlertEntityTypeCode, AlertFrequencyTypeCode, AlertTypeCode, ConstantValue } from '@cms/productivity-tools/domain';
import { ToDoEntityTypeCode } from '@cms/shared/ui-common';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { ConfigurationProvider } from '@cms/shared/util-core';
/** Facades **/
import { DialogService } from '@progress/kendo-angular-dialog';
import { GridDataResult,FilterService } from '@progress/kendo-angular-grid';
import { SortDescriptor, State } from '@progress/kendo-data-query';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
@Component({
  selector: 'productivity-tools-todo-list',
  templateUrl: './todo-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoListComponent implements OnInit {
  /** Public properties **/
  @ViewChild('deleteToDODialogTemplate', { read: TemplateRef })
  deleteToDODialogTemplate!: TemplateRef<any>;
  isOpenDeleteTodo = false;
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  public deleteToDoDialog: any;
  isToDODeleteActionOpen = false;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  @Output() isModalTodoDetailsOpenClicked = new EventEmitter<any>();
  @Output() isLoadTodoGridEvent = new EventEmitter<any>();
  @Input() isToDODetailsActionOpen: any;
  @Input()  todoGrid$ :any;
  @Input() entityTypeCodeSubject$!: Observable<any>;
  entityTypeList:any=[];
  public toDoGridState!: State;
  gridDataResult!: GridDataResult;
  gridTodoDataSubject = new Subject<any>();
  gridToDoItemData$ = this.gridTodoDataSubject.asObservable();
  dateFormat= this.configurationProvider.appSettings.dateFormat
  isToDoGridLoaderShow = new BehaviorSubject<boolean>(true);
  selectedAlertId:string="";
  sortValue ="alertDueDate"; 
  sortColumn = 'alertDueDate';
  sortDir = 'Ascending';
  sortColumnName = '';
  tabCode ='';
  sortType = 'asc';
  sort: SortDescriptor[] = [{
    field: this.sortColumn,
    dir: 'asc',
  }];
  columns:any;
  filter!: any;
  selectedEntityType = "";
  entityTypeValue = null;
  filteredBy = "";
  @Input() pageSizes : any;
  @Input() loadAlertGrid$ : any;
  @Output() onMarkAlertAsDoneGridClicked = new EventEmitter<any>();
  @Output() onDeleteAlertGridClicked = new EventEmitter<any>();
  @Output() getTodoItemsLov = new EventEmitter();
  @Output() getSessionInfoByEligibilityEvent = new EventEmitter<any>();
  public moreactions = [
    {
      buttonType: 'btn-h-primary',
      id:'done',
      text: 'Done',
      icon: 'done',
    },
    {
      buttonType: 'btn-h-primary',
      id:'edit',
      text: 'Edit',
      icon: 'edit',
    },
    {
      buttonType: 'btn-h-danger',
      id:'del',
      text: 'Delete',
      icon: 'delete',
    }
  ]; 
  public moreactionsSystemGenerated = [
  {
     buttonType: 'btn-h-primary',
     id:'done',
     text: 'Done',
     icon: 'done',
   },
   {
     buttonType: 'btn-h-danger',
     id:'del',
     text: 'Delete',
     icon: 'delete',
   }
 ]; 
  
  /** Constructor **/
  constructor( 
    private dialogService: DialogService,
    private configurationProvider: ConfigurationProvider,
    private readonly router: Router
  ) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
   this.initilizeGridRefinersAndGrid()
    this.loadColumnsData();
   
    this.todoGrid$.subscribe((data: any) => {
      if(data == true){
        this.loadTodoGrid();
      } 
    });
    this.loadEntityTypeList()
  }

  initilizeGridRefinersAndGrid(){
    this.toDoGridState = {
      skip: 0,
      take: this.pageSizes[2]?.value,
      sort: this.sort,
    };
    this.loadTodoGrid();
  }
  
  private loadColumnsData(){
    this.columns = {
      alertName:"Title",
      entityName:"To Do Item For",
      entityTypeCode : "Type",
      alertDesc:"Description",
      alertDueDate:"Due Date"

    }
  }
  

  /** Private methods **/
  public loadTodoGrid() {
    this.loadTodoGridData(
      this.toDoGridState.skip?? 0,
      this.toDoGridState.take?? this.pageSizes[2]?.value,
      this.toDoGridState?.sort![0]?.field ?? this.sortValue,
      this.toDoGridState?.sort![0]?.dir ?? 'asc',
      AlertTypeCode.Todo.toString()
    )
  }
  private loadTodoGridData(skipCountValue: number,
    maxResultCountValue: number,
    sortValue: string,
    sortTypeValue: string, alertType:string){
      this.isToDoGridLoaderShow.next(true);
      const gridDataRefinerValue = {
        skipCount: skipCountValue,
        maxResultCount: maxResultCountValue,
        sorting: sortValue,
        sortType: sortTypeValue,
        filter: JSON.stringify(this.filter),
      }; 
        this.isLoadTodoGridEvent.emit({gridDataRefinerValue, alertType})
        this.todoGrid$.subscribe((data: any) => {
          this.gridDataResult = data;
          if(data?.total >=0 || data?.total === -1){
            this.isToDoGridLoaderShow.next(false);
          }
          this.gridTodoDataSubject.next(this.gridDataResult);
        });
  }
  onOpenTodoDetailsClicked() {
    this.isModalTodoDetailsOpenClicked.emit(this.selectedAlertId);
  }

  onOpenDeleteToDoClicked(template: TemplateRef<unknown>): void {
    this.deleteToDoDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    });
  }

  onCloseDeleteToDoClicked(result: any) {
    if (result) {
      this.isToDODeleteActionOpen = false;
      this.deleteToDoDialog.close();
    }
  }
  onDeleteToDOClicked(result: any) 
  {
    if (result) {
      this.isToDODeleteActionOpen = false;
      this.deleteToDoDialog.close();
      this.onDeleteAlertGridClicked.emit(this.selectedAlertId);
    }
  }
  public get alertFrequencyTypes(): typeof AlertFrequencyTypeCode {
    return AlertFrequencyTypeCode;
  }
  get financeManagementTabs(): typeof FinancialVendorProviderTabCode {
    return FinancialVendorProviderTabCode;
  }
    onToDoClicked(gridItem: any) {
      if (gridItem && gridItem.entityTypeCode == this.entityTypes.Client) {
        this.router.navigate([`/case-management/cases/case360/${gridItem?.entityId}`]);
      }
      else if (gridItem && gridItem.entityTypeCode == this.entityTypes.Vendor) {
        this.getVendorProfile(gridItem.vendorTypeCode)
        const query = {
          queryParams: {
            v_id: gridItem?.entityId ,
            tab_code : this.tabCode
          },
        };
        this.router.navigate(['/financial-management/vendors/profile'], query )
      }
      else if (gridItem && gridItem.entityTypeCode === this.entityTypes.BatchSentBack) {
        const urlPaths = {
            [this.entityTypes.MedicalClaim]: '/financial-management/claims/medical/batch',
            [this.entityTypes.DentalClaim]: '/financial-management/claims/dental/batch',
            [this.entityTypes.MedicalPremium]: '/financial-management/premiums/medical/batch',
            [this.entityTypes.DentalPremium]: '/financial-management/premiums/dental/batch',
            [this.entityTypes.Pharmacy]: '/financial-management/pharmacy-claims/batch',
        } as const;
    
        const entityType = gridItem.displayEntityTypeCode;
        const urlPath = urlPaths[entityType as keyof typeof urlPaths];
    
        if (urlPath) {
            this.router.navigate([urlPath], { queryParams: { bid: gridItem?.entityId } });
        }
    }
    else if (gridItem && gridItem.entityTypeCode == this.entityTypes.NewApplication) {     
      this.getSessionInfoByEligibilityEvent.emit(gridItem?.entityId);
    }
    else if (gridItem && gridItem.entityTypeCode == this.entityTypes.CERComplete) {
      this.getSessionInfoByEligibilityEvent.emit(gridItem?.entityId);
    }
  }
  dataStateChange(stateData: any): void { 
    this.sort = stateData.sort;
    this.sortValue = stateData.sort[0]?.field ?? this.sortValue;
    this.sortType = stateData.sort[0]?.dir ?? 'asc';
    this.toDoGridState = stateData;
    this.sortDir = this.sort[0]?.dir === 'asc' ? 'Ascending' : 'Descending';
    this.sortColumn = this.columns[stateData.sort[0]?.field];
    this.filter = stateData?.filter?.filters;
    this.loadTodoGrid();
    const filterList = []
    for(const filter of stateData.filter.filters)
    {
      filterList.push(this.columns[filter.filters[0].field]);
    }
    this.filteredBy =  filterList.toString();
    if (!this.filteredBy.includes('Type')) this.selectedEntityType = '';
  }
   onToDoActionClicked(item: any,gridItem: any){ 
    if(item.id == 'done'){
      this.selectedAlertId = gridItem.alertId;
       this.onDoneTodoItem();
    }else if(item.id == 'edit'){ 
      if (!this.isToDODetailsActionOpen) {
        this.selectedAlertId = gridItem.alertId;
          this.onOpenTodoDetailsClicked();
        }
    }
    else if(item.id == 'del'){ 
      if (!this.isToDODeleteActionOpen) {
          this.isToDODeleteActionOpen = true;
          this.selectedAlertId = gridItem.alertId;
          this.onOpenDeleteToDoClicked(this.deleteToDODialogTemplate);
        }
    }
  }
  onDoneTodoItem(){
    this.onMarkAlertAsDoneGridClicked.emit(this.selectedAlertId);
  }
  public get claimTypes(): typeof FinancialServiceTypeCode {
    return FinancialServiceTypeCode;
  }
  public get entityTypes(): typeof ToDoEntityTypeCode {
    return ToDoEntityTypeCode;
  }
  getVendorProfile(vendorTypeCode :any) {
    switch (vendorTypeCode) {
      case (FinancialVendorProviderTab.Manufacturers)  :
        this.tabCode = FinancialVendorProviderTabCode.Manufacturers;
        break;
 
      case  (FinancialVendorProviderTab.MedicalClinic) :
        this.tabCode = FinancialVendorProviderTabCode.MedicalProvider;
        break;
 
        case  (FinancialVendorProviderTab.MedicalProvider) :
          this.tabCode = FinancialVendorProviderTabCode.MedicalProvider;
          break;
      case  (FinancialVendorProviderTab.InsuranceVendors):
        this.tabCode = FinancialVendorProviderTabCode.InsuranceVendors;
        break;
 
      case  (FinancialVendorProviderTab.Pharmacy):
        this.tabCode = FinancialVendorProviderTabCode.Pharmacy;
        break;
 
      case (FinancialVendorProviderTab.DentalClinic)  :
        this.tabCode =FinancialVendorProviderTabCode.DentalProvider;
        break;
 
        case (FinancialVendorProviderTab.DentalProvider)  :
          this.tabCode =FinancialVendorProviderTabCode.DentalProvider;
          break;
    }
  }

  dropdownFilterChange(field:string, value: any, filterService: FilterService): void {
    filterService.filter({
        filters: [{
          field: field,
          operator: "eq",
          value:value.lovDesc
      }],
        logic: "or"
    });
    const obj = this.entityTypeList.find((x: any) => x.lovCode === value.lovCode);
    this.selectedEntityType = obj;
    this.entityTypeValue = value;
  }
  private getEntityTypeLovs() {
    this.entityTypeCodeSubject$
    .subscribe({
      next: (data: any) => {
        data.forEach((item: any) => {
          item.lovDesc = item.lovDesc.toUpperCase();
        });
        this.entityTypeList=data.sort((value1:any,value2:any) => value1.sequenceNbr - value2.sequenceNbr);
      }
    });
  }
  loadEntityTypeList(){
    this.entityTypeList.push({"lovDesc":this.entityTypes.Client.toString(),"lovCode":this.entityTypes.Client.toString()});
    this.entityTypeList.push({"lovDesc":this.entityTypes.Vendor.toString(),"lovCode":this.entityTypes.Vendor.toString()});
  }
  // updating the pagination infor based on dropdown selection
  pageselectionchange(data: any) {
    this.toDoGridState.take = data.value;
    this.toDoGridState.skip = 0;
    this.loadTodoGrid();
  }
  alertRepeatDesc(desc: string){
    return  ConstantValue.Repeat +" "+ desc.toLowerCase().replace(/\b\w/g, s => s.toUpperCase());
  }
}
