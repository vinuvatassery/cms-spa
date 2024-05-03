/** Angular **/
import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  Output,
  EventEmitter,
  Input,
  ChangeDetectorRef,
  OnInit
} from '@angular/core';
/** External libraries **/
import { SnackBar, ToDoEntityTypeCode } from '@cms/shared/ui-common';
import { Subject } from 'rxjs';
import { UIFormStyle } from '@cms/shared/ui-tpa';
/** Facades **/ 
import { ConfigurationProvider, LoaderService, SnackBarNotificationType } from '@cms/shared/util-core';
import { DialogService } from '@progress/kendo-angular-dialog';
import { NotificationFacade, TodoFacade } from '@cms/productivity-tools/domain';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { SortDescriptor, State } from '@progress/kendo-data-query';
import { CaseFacade, FinancialVendorProviderTab, FinancialVendorProviderTabCode } from '@cms/case-management/domain';
import { Router } from '@angular/router';
import { LovFacade } from '@cms/system-config/domain';
import { FinancialVendorFacade, FinancialVendorRefundFacade } from '@cms/case-management/domain';
import { FormControl } from '@angular/forms';
import { IntlService } from '@progress/kendo-angular-intl';

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
  @Output() onSnoozeReminderEvent = new EventEmitter<any>();
  alertSearchLoaderVisibility$ =
  this.notificationFacade.alertSearchLoaderVisibility$;
  isOpenDeleteTODOItem = false;
  itemsLoader = false;
  sortColumn ="alertDueDate";
  sortValue ="alertDueDate";
  isToDODeleteActionOpen = false;
  @Input() isToDODetailsActionOpen: any;
   @Input()todoGrid$ : any;
   @Input()loadTodoList$ : any;
  @Output() isLoadTodoGridEvent = new EventEmitter<any>();
  @Output() isModalTodoDetailsOpenClicked = new EventEmitter<any>();
  dateFormat = this.configurationProvider.appSettings.dateFormat;
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
  @ViewChild('NewReminderTemplate', { read: TemplateRef })
  NewReminderTemplate!: TemplateRef<any>;
  medicalProviderSearchLoaderVisibility$ = this.financialVendorFacade.medicalProviderSearchLoaderVisibility$
  providerSearchResult$ =this.financialVendorFacade.searchProvider$ 
  clientSearchLoaderVisibility$ = this.financialRefundFacade.clientSearchLoaderVisibility$;
  clientSearchResult$ = this.financialRefundFacade.clients$;
  clientSubject = this.financialRefundFacade.clientSubject;
  searchProviderSubject = this.financialVendorFacade.searchProviderSubject;
  notificationList$ = this.notificationFacade.notificationList$;
  getTodo$ = this.Todofacade.getTodo$
  todoItemList: any[] = [];
  skeletonCounts = [1,2,3,4,5];
  selectedAlertId:string="";
  isEdit = false;
  isDelete = false;
  searchTerm = new FormControl();
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
    private caseFacade: CaseFacade,
  private readonly router: Router,
    private cdr : ChangeDetectorRef,
    private lovFacade : LovFacade,
    private readonly configurationProvider: ConfigurationProvider,
    public readonly  intl: IntlService,
    private financialVendorFacade : FinancialVendorFacade,
    public notificationFacade: NotificationFacade, 
    private financialRefundFacade : FinancialVendorRefundFacade
  ) {}
  ngOnInit(): void {
  this.InitializeData()
  this.searchTerm.valueChanges.subscribe((value) => {
  const containsOnlyNumbers = /^\d+$/.test(value);
  const tempDate = new Date(value);
  const isDateFormat = !isNaN(tempDate.getTime());
  if (containsOnlyNumbers) 
  { 
      this.onListenSearchTerm(value);
  } 
  else if (isDateFormat) 
  {
      const formattedDate = this.intl.formatDate(tempDate, this.dateFormat);
      this.onListenSearchTerm(formattedDate);
  }
 else 
 {
      this.onListenSearchTerm(value?.trim());
  }});
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
    this.notificationFacade.loadNotificationsAndReminders(true);
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
    this.isEdit = false;
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
      cssClass: 'app-c-modal app-c-modal-lg app-c-modal-np',
      
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
  private loadTodoGridData(){
      this.itemsLoader=true;
        this.isLoadTodoGridEvent.emit();
        this.loadTodoList$?.subscribe((todoItemList : any) =>{
          if(todoItemList)
          {
            this.itemsLoader =false;
          }
          this.todoItemList = todoItemList?.data ? todoItemList?.data : [];
          var currentDate = new Date();
          var validDate = new Date(currentDate.setDate(currentDate.getDate() +30));
          this.todoItemList = this.todoItemList.filter(todoItem => new Date(todoItem.alertDueDate) <= validDate);
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
    this.loadTodoGridData();
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
    this.isDelete =false;
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
      this.getEligibilityInfoByEligibilityId(result?.entityId)
      //this.router.navigate([`/case-management/cases/case360/${result.entityId}`]);
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
    else if (result.entityTypeCode == this.entityTypes.BatchSentBack) {
      const urlPaths = {
          [this.entityTypes.MedicalClaim]: '/financial-management/claims/medical/batch',
          [this.entityTypes.DentalClaim]: '/financial-management/claims/dental/batch',
          [this.entityTypes.MedicalPremium]: '/financial-management/premiums/medical/batch',
          [this.entityTypes.DentalPremium]: '/financial-management/premiums/dental/batch',
          [this.entityTypes.Pharmacy]: '/financial-management/pharmacy-claims/batch',
      } as const;
  
      const entityType = result.displayEntityTypeCode;
      const urlPath = urlPaths[entityType as keyof typeof urlPaths];
  
      if (urlPath) {
          this.router.navigate([urlPath], { queryParams: { bid: result?.entityId } });
      }
  }
  else if (result.entityTypeCode == this.entityTypes.NewApplication) {     
    this.getSessionInfoByEligibilityId(result?.entityId);
  }
  else if (result.entityTypeCode == this.entityTypes.CERComplete) {
    this.getSessionInfoByEligibilityId(result?.entityId);
  }
  }

  getSessionInfoByEligibilityId(clientCaseEligibilityId:any){
    ;
    this.loaderService.show();
          this.caseFacade.getSessionInfoByCaseEligibilityId(clientCaseEligibilityId).subscribe({
            next: (response: any) => {
              if (response) {                
                this.loaderService.hide();
                this.router.navigate(['case-management/case-detail'], {
                  queryParams: {
                    sid: response.sessionId,
                    eid: response.entityID,                   
                    wtc: response?.workflowTypeCode
                  },
                });
              }
            },
            error: (err: any) => {
              this.loaderService.hide();
              this.caseFacade.showHideSnackBar(SnackBarNotificationType.ERROR, err);
            }
          })
  }

  getEligibilityInfoByEligibilityId(clientId:any){   
    this.loaderService.show();
          this.caseFacade.loadClientEligibility(clientId).subscribe({
            next: (response: any) => {
              if (response) {                
                this.loaderService.hide();
                   const eligibilityId = response?.clientCaseEligibilityId       
                 if(eligibilityId)
                {     
                this.clientNavigation(eligibilityId,response?.caseStatus,clientId)
                }
              }
            },
            error: (err: any) => {
              this.loaderService.hide();
              this.caseFacade.showHideSnackBar(SnackBarNotificationType.ERROR, err);
            }
          })
  }

  clientNavigation(clientCaseEligibilityId:any,eligibilityStatusCode :  any,clientId : any){    
    if(eligibilityStatusCode === 'ACCEPT')
      {
        this.router.navigate([`/case-management/cases/case360/${clientId}`]);
      }
      else
      {
            this.loaderService.show();
            this.caseFacade.getSessionInfoByCaseEligibilityId(clientCaseEligibilityId).subscribe({
              next: (response: any) => {
                if (response) {                
                  this.loaderService.hide();
                  this.router.navigate(['case-management/case-detail'], {
                    queryParams: {
                      sid: response.sessionId,
                      eid: response.entityID,                   
                      wtc: response?.workflowTypeCode
                    },
                  });
                }
              },
              error: (err: any) => {
                this.loaderService.hide();
                this.caseFacade.showHideSnackBar(SnackBarNotificationType.ERROR, err);
              }
            })
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

  onListenSearchTerm(searchedValue:any){
    if(searchedValue){
      this.notificationFacade.loadNotificatioBySearchText(searchedValue);
    }else {
      this.onloadReminderAndNotificationsGrid();
    }
    
  }
  remainderFor(event:any){
    this.remainderIsFor = event
  }
  onSnoozeReminder(event:any){ 
    this.notificationFacade.SnoozeReminder(event.reminderId,event.duration);
  }
}
