/** Angular **/
import {
  Component,
  ChangeDetectionStrategy, 
  Output,
  TemplateRef,
  OnInit,
} from '@angular/core';
import { FinancialVendorFacade, FinancialVendorRefundFacade, SearchFacade, VendorFacade } from '@cms/case-management/domain';
import { TodoFacade } from '@cms/productivity-tools/domain';
import { LovFacade } from '@cms/system-config/domain';
import { DialogService } from '@progress/kendo-angular-dialog';

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
  clientSearchLoaderVisibility$ = this.FinancialRefundFacade.  clientSearchLoaderVisibility$;
  clientSearchResult$ = this.FinancialRefundFacade.clients$;
  providerSearchResult$ =this.financialVendorFacade.searchProvider$ 
  medicalProviderSearchLoaderVisibility$ = this.financialVendorFacade.medicalProviderSearchLoaderVisibility$
  
  createTodo$ = this.todoFacade.createTodo$
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
      this.isToDODetailsActionOpen = false;
      this.todoDetailsDialog.close();
    }
  }

  onOpenTodoClicked(template: TemplateRef<unknown>): void {
    this.todoDetailsDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np mnl',
    });
    this.isToDODetailsActionOpen = true;
  }
  onloadTodoGrid(event: any, alertTypeCode:any){
    this.todoFacade.loadAlerts(event,alertTypeCode.alertType);
  }
  onMarkAlertDoneGrid(selectedAlertId: any){
    this.todoFacade.markAlertAsDone(selectedAlertId);
  }
  onDeleteAlertGrid(selectedAlertId: any){
    this.todoFacade.deleteAlert(selectedAlertId);
  }

  onTodoItemCreateClick(payload:any){
    this.todoFacade.createTodoItem(payload);
  }

  onUpdateTodoItemClick(payload:any){
    this.todoFacade.updateTodoItem(payload)
  }

  onGetTodoItem($event:any){
    this.todoFacade.getTodoItem($event);
  }
}
