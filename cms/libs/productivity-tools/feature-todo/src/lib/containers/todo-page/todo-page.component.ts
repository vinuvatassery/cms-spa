/** Angular **/
import {
  Component,
  ChangeDetectionStrategy, 
  Output,
  TemplateRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CaseFacade, FinancialVendorFacade, FinancialVendorRefundFacade, SearchFacade, VendorFacade } from '@cms/case-management/domain';
import { TodoFacade } from '@cms/productivity-tools/domain';
import { LovFacade } from '@cms/system-config/domain';
import { DialogService } from '@progress/kendo-angular-dialog';
import { TodoListComponent } from '../../components/todo-list/todo-list.component';
import { LoaderService, SnackBarNotificationType } from '@cms/shared/util-core';
import { Router } from '@angular/router';

@Component({
  selector: 'productivity-tools-todo-page',
  templateUrl: './todo-page.component.html',
  styleUrls: ['./todo-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoPageComponent implements OnInit {
  /** Public properties **/
  private todoDetailsDialog: any;
  @Output() isToDODetailsActionOpen!: boolean;
  todoGrid$ = this.todoFacade.todoGrid$;
  loadAlertGrid$ = this.todoFacade.loadAlertGrid$;
  frequencyTypeCodeSubject$ = this.lovFacade.frequencyTypeCodeSubject$
  entityTypeCodeSubject$ = this.lovFacade.entityTypeCodeSubject$;
  getTodo$ = this.todoFacade.getTodo$;
  showHeaderSearchInputLoader = false;
  searchProviderSubject = this.financialVendorFacade.searchProviderSubject
  clientSearchLoaderVisibility$ = this.FinancialRefundFacade.clientSearchLoaderVisibility$;
  clientSearchResult$ = this.FinancialRefundFacade.clients$;
  clientSubject = this.FinancialRefundFacade.clientSubject;
  providerSearchResult$ =this.financialVendorFacade.searchProvider$ 
  medicalProviderSearchLoaderVisibility$ = this.financialVendorFacade.medicalProviderSearchLoaderVisibility$
  @ViewChild('todoList', { static: false })
  todoList!: TodoListComponent;
  selectedAlertId! :any
  createTodo$ = this.todoFacade.curdAlert$
  pageSizes = this.todoFacade.gridPageSizes;
  isToDODeleteActionOpen = false
  deleteToDoDialog:any
  @ViewChild('deleteToDOTemplate', { read: TemplateRef })
  deleteTodoTemplate!: TemplateRef<any>;
  /** Constructor **/
  constructor(private dialogService: DialogService, 
    public todoFacade: TodoFacade,
    public lovFacade : LovFacade,
    private readonly FinancialRefundFacade: FinancialVendorRefundFacade,
    private readonly financialVendorFacade : FinancialVendorFacade,
    private caseFacade: CaseFacade,
    private router: Router,
    private loaderService: LoaderService) {}
 
    ngOnInit(): void {
     
  }

  searchClientName(event:any){
    this.FinancialRefundFacade.loadClientBySearchText(event);
  }

  getTodoItemsLov(){
    this.lovFacade.getFrequencyTypeLov()
    this.lovFacade.getEntityTypeCodeLov()
  }
  searchProvider(data:any){
    this.financialVendorFacade.searchAllProvider(data);
  }
  /** Public methods **/
  onCloseTodoClicked(result: any) {
      this.selectedAlertId = undefined
      this.isToDODetailsActionOpen = false;
    this.todoDetailsDialog.close();
    
  }

  onOpenTodoClicked(alertId:any ,template: TemplateRef<unknown>): void {
   this.selectedAlertId = alertId
    this.todoDetailsDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-lg app-c-modal-np mnl',
    });
    this.isToDODetailsActionOpen = true;
  }
  onloadTodoGrid(event: any, alertTypeCode:any){
    this.todoFacade.loadAlerts(event,alertTypeCode.alertType);
  }

   loadTodoList(){
    this.todoList.initilizeGridRefinersAndGrid()
   }
  onMarkAlertDoneGrid(selectedAlertId: any){
    this.todoFacade.markAlertAsDone(selectedAlertId);
  }
  onDeleteAlertGrid(selectedAlertId: any){
    this.todoFacade.deleteAlert(selectedAlertId);
  }

  onTodoItemCreateClick(payload:any){
    this.todoFacade.createAlertItem(payload);
  }

  onUpdateTodoItemClick(payload:any){
    this.todoFacade.updateAlertItem(payload)
  }

  onGetTodoItem($event:any){
    this.todoFacade.getTodoItem($event);
  }

  
  onCloseDeleteToDoClicked(result: any) {
    if (result) {
      this.deleteToDoDialog.close();
    }
  }
  onDeleteToDOClicked(result: any) 
  {
    if (result) {
      this.deleteToDoDialog.close();
      this.onDeleteAlertGrid(this.selectedAlertId);
    }
  }

onDeleteAlertClicked(event:any){
    if (!this.isToDODeleteActionOpen) {
        this.isToDODeleteActionOpen = true;
        this.selectedAlertId = event;
        this.onDeleteToDoClicked(this.deleteTodoTemplate);
      }
    }

    onDeleteToDoClicked(template: TemplateRef<unknown>): void {
      this.deleteToDoDialog = this.dialogService.open({
        content: template,
        cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
      });
    }

  getSessionInfoByEligibilityId(clientCaseEligibilityId:any){   
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
