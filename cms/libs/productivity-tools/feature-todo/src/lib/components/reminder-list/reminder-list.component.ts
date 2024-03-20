/** Angular **/
import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  Output,
  OnChanges,
  EventEmitter,
  Input,
  ChangeDetectorRef,
  OnInit
} from '@angular/core';
/** External libraries **/
import { SnackBar, ToDoEntityTypeCode } from '@cms/shared/ui-common';
import { BehaviorSubject, Subject } from 'rxjs';
import { UIFormStyle } from '@cms/shared/ui-tpa';
/** Facades **/ 
import { LoaderService } from '@cms/shared/util-core';
import { DialogService } from '@progress/kendo-angular-dialog';
import { AlertTypeCode, NotificationFacade, TodoFacade } from '@cms/productivity-tools/domain';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { SortDescriptor, State } from '@progress/kendo-data-query';
import { FinancialVendorProviderTab, FinancialVendorProviderTabCode } from '@cms/case-management/domain';
import { Router } from '@angular/router';
import { LovFacade } from '@cms/system-config/domain';
import { FinancialVendorFacade, FinancialVendorRefundFacade } from '@cms/case-management/domain';
@Component({
  selector: 'productivity-tools-reminder-list',
  templateUrl: './reminder-list.component.html',
  styleUrls: ['./reminder-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReminderListComponent implements  OnInit{
  public formUiStyle: UIFormStyle = new UIFormStyle();
  @ViewChild('reminderDetailsTemplate', { read: TemplateRef })
  reminderDetailsTemplate!: TemplateRef<any>;
  @ViewChild('deleteToDODialogTemplate', { read: TemplateRef })
  deleteToDODialogTemplate!: TemplateRef<any>;
  isOpenDeleteTODOItem = false;
  sortColumn ="alertDueDate";
  sortValue ="alertDueDate";
  isToDODeleteActionOpen = false;
  @Input() isToDODetailsActionOpen: any;
   @Input()todoGrid$ : any;
  @Output() isLoadTodoGridEvent = new EventEmitter<any>();
  @Output() isModalTodoDetailsOpenClicked = new EventEmitter<any>();
  sort: SortDescriptor[] = [{
    field: this.sortColumn,
    dir: 'asc',
  }]
  /** Public properties **/
  snackbarMessage!: SnackBar;
  snackbarSubject = new Subject<SnackBar>();
  snackbar$ = this.snackbarSubject.asObservable();
  isShowReminderDetailsModal = false;
  reminderActionPopupClass = 'more-action-dropdown app-dropdown-action-list';
  private newReminderDetailsDialog: any;
  public deleteReminderDialog: any;
  public deleteToDoDialog: any;
  gridDataResult!: GridDataResult;
  @Input() loadAlertGrid$ : any;
  tabCode= 'MEDICAL_CLINIC'
  gridTodoDataSubject = new Subject<any>();
  entityTypeCodeSubject$ = this.lovFacade.entityTypeCodeSubject$;
  gridToDoItemData$ = this.gridTodoDataSubject.asObservable();
  remainderIsFor ="";
  @Output() ReminderEventClicked  = new EventEmitter<any>();
  @Output() onMarkAlertAsDoneGridClicked = new EventEmitter<any>();
  @Output() onDeleteAlertGridClicked = new EventEmitter<any>();
  medicalProviderSearchLoaderVisibility$ = this.financialVendorFacade.medicalProviderSearchLoaderVisibility$
  providerSearchResult$ =this.financialVendorFacade.searchProvider$ 
  clientSearchLoaderVisibility$ = this.financialRefundFacade.clientSearchLoaderVisibility$;
  clientSearchResult$ = this.financialRefundFacade.clients$;
  clientSubject = this.financialRefundFacade.clientSubject;
  notificationList$ = this.notificationFacade.notificationList$;
  getTodo$ = this.Todofacade.getTodo$
  todoItemList: any[] = [];
  selectedAlertId:string="";
  isEdit = false;
  isDelete = false;
  reminderCrudText ="Create New"
  public toDoGridState!: State;

  public reminderActions = [
    {
      buttonType: 'btn-h-primary',
      id:'done',
      text: 'Done',
      icon: 'done',
      click: (): void => {
        this.onReminderDoneClicked();
      },
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
    },
  ];

  /** Constructor **/
  constructor( 
    private loaderService: LoaderService,
    private dialogService: DialogService,
    private readonly Todofacade: TodoFacade,
  private readonly router: Router,
    private cdr : ChangeDetectorRef,
    private lovFacade : LovFacade,
    private financialVendorFacade : FinancialVendorFacade,
    public notificationFacade: NotificationFacade, 
    private financialRefundFacade : FinancialVendorRefundFacade
  ) {}
  ngOnInit(): void {
  this.InitializeData()
  }

  InitializeData(){
    this.toDoGridState = {
      skip: 0,
      take: 10,
      sort: this.sort,
    };
    this.loadTodoGrid();
    this.loadAlertGrid$?.subscribe((data: any) => {
      this.loadTodoGrid();
    });
  }

  /** Internal event methods **/
  onReminderDoneClicked() { 
    this.ReminderEventClicked.emit();
  }
  onloadReminderAndNotificationsGrid(){
    this.notificationFacade.loadNotificationsAndReminders();
  }

  onGetTodoItemData(event:any){
    this.Todofacade.getTodoItem(event);
  }

  onNewReminderClosed(result: any) {
    this.remainderIsFor = ''
    this.newReminderDetailsDialog.close();
    this.isEdit = false;
    this.isDelete = false;
    this.reminderCrudText ="Create New"
    if (result) {
    
      this.onloadReminderAndNotificationsGrid();
    }
  }

  onDeleteReminderAlert(event:any){
    this.isDelete = true;
    this.reminderCrudText ="Delete"
    this.selectedAlertId = event;
    this.onNewReminderOpenClicked(this.reminderDetailsTemplate)
  }
  getReminderDetailsLov(){
    this.lovFacade.getEntityTypeCodeLov()
  }
  searchClientName(event:any){
    this.financialRefundFacade.loadClientBySearchText(event);
  }

  searchProvider(data:any){
    this.financialVendorFacade.searchAllProvider(data);
  }

  onNewReminderOpenClicked(template: TemplateRef<unknown>): void {
    this.newReminderDetailsDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
      
    });
  }

  onOpenDeleteToDoClicked(template: TemplateRef<unknown>): void {
    this.deleteToDoDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    });
  }

  onCloseDeleteToDoClicked(result: any) {
    if (result) {
      this.deleteToDoDialog.close();
    }
  }

  onDeleteReminderClosed(result: any) {
    if (result) {
      this.deleteReminderDialog.close();
    }
  }
  onDeleteReminderOpenClicked(template: TemplateRef<unknown>): void {
    this.deleteReminderDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    });
  }
  todoItemCrossedDueDate(todoItem:any):boolean{
    let isCrossedDueDate = false;
    var currentDate = new Date();
    var numberOfDaysToAdd = 7;
    var resultDate =new Date(currentDate.setDate(currentDate.getDate() + numberOfDaysToAdd));
    if(new Date(todoItem.alertDueDate) < resultDate){
      isCrossedDueDate = true;
    }
     return isCrossedDueDate;
  }
  private loadTodoGridData(skipCountValue: number,
    maxResultCountValue: number,
    sortValue: string,
    sortTypeValue: string, alertType:string){
      this.loaderService.show;
      const gridDataRefinerValue = {
        SkipCount: skipCountValue,
        MaxResultCount: maxResultCountValue,
        Sorting: sortValue,
        SortType: sortTypeValue,
        Filter: "[]",
      };
        this.isLoadTodoGridEvent.emit({gridDataRefinerValue, alertType})
        this.todoGrid$?.subscribe((todoItemList : any) =>{
          this.todoItemList = todoItemList?.data ? todoItemList?.data : [];
          var currentDate = new Date();
          this.todoItemList = this.todoItemList.filter(todoItem => new Date(todoItem.alertDueDate) <= new Date(currentDate.setDate(currentDate.getDate() +30)));
          this.todoItemList.forEach((todoItem:any)=>{
          
            var todayDate = new Date();
            todayDate.setHours(0,0,0);
            var postDate = new Date();
            todoItem.isToday = false;
            todoItem.isTomorrow = false;
            let tomorrow = new Date(postDate.setDate(postDate.getDate() +1));
            if(new Date(todoItem.alertDueDate).toDateString() == todayDate.toDateString()){
              todoItem.isToday = true;
            }
            if(new Date(todoItem.alertDueDate).toDateString() == tomorrow.toDateString()){
              todoItem.isTomorrow = true;
            }
                  
          })
          this.cdr.detectChanges();
        });
  }
  private loadTodoGrid() {
    this.loadTodoGridData(
      this.toDoGridState.skip?? 0,
      this.toDoGridState.take?? 10,
      this.toDoGridState?.sort![0]?.field ?? this.sortValue,
      this.toDoGridState?.sort![0]?.dir ?? 'asc',
      AlertTypeCode.Todo.toString()
    )
  }
  onToDoActionClicked(item: any,gridItem: any){ 
    if(item.id == 'done'){
      this.selectedAlertId = gridItem.alertId;
       this.onDoneTodoItem();
     }
    else if(item.id == 'edit'){ 
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


  onEditReminder(event:any){
    this.isEdit = true;
    this.reminderCrudText ="Edit"
    this.selectedAlertId = event;
    this.onNewReminderOpenClicked(this.reminderDetailsTemplate)
  }
 
  onOpenTodoDetailsClicked() {
    this.isModalTodoDetailsOpenClicked.emit(this.selectedAlertId);
  }
  onDoneTodoItem(){
    this.onMarkAlertAsDoneGridClicked.emit(this.selectedAlertId);
  }
  onDeleteToDOClicked(result: any) 
  {
    if (result) {
      this.isToDODeleteActionOpen = false;
      this.deleteToDoDialog.close();
      this.onDeleteAlertGridClicked.emit(this.selectedAlertId);
    }
  }
  public get entityTypes(): typeof ToDoEntityTypeCode {
    return ToDoEntityTypeCode;
  }
  onNavigationClicked(result: any) {
    if (result.entityTypeCode == this.entityTypes.Client) {
      this.router.navigate([`/case-management/cases/case360/${result.entityId}`]);
    }
    else if(result.entityTypeCode == this.entityTypes.Vendor)
    { 
      this.getVendorProfile(result.vendorTypeCode);
     
      const query = {
        queryParams: {
          v_id: result?.entityId ,
          tab_code : this.tabCode
        },
      };
      this.router.navigate(['/financial-management/vendors/profile'], query )
    }
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


  remainderFor(event:any){
    this.remainderIsFor = event
  }
}
