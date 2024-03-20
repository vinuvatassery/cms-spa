/** Angular **/
import {
  Component,
  ChangeDetectionStrategy, 
  Output,
  TemplateRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FinancialVendorFacade, FinancialVendorRefundFacade, SearchFacade, VendorFacade } from '@cms/case-management/domain';
import { TodoFacade } from '@cms/productivity-tools/domain';
import { LovFacade } from '@cms/system-config/domain';
import { DialogService } from '@progress/kendo-angular-dialog';
import { TodoListComponent } from '../../components/todo-list/todo-list.component';

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
  /** Constructor **/
  constructor(private dialogService: DialogService, 
    public todoFacade: TodoFacade,
    public lovFacade : LovFacade,
    private readonly FinancialRefundFacade: FinancialVendorRefundFacade,
    private readonly financialVendorFacade : FinancialVendorFacade) {}
 
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
    if (result) {
      this.selectedAlertId = undefined
      this.isToDODetailsActionOpen = false;
      this.todoDetailsDialog.close();
    }
  }

  onOpenTodoClicked(alertId:any ,template: TemplateRef<unknown>): void {
   this.selectedAlertId = alertId
    this.todoDetailsDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np mnl',
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
}
