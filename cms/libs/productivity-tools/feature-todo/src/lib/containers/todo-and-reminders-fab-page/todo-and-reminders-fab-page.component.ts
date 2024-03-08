/** Angular **/
import {
    Component,
    ChangeDetectionStrategy,  
    OnInit,
    TemplateRef,
    Output,
    ViewChild,
  } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { TodoFacade } from '@cms/productivity-tools/domain';
import { DialogService } from '@progress/kendo-angular-dialog';
import { TodoListComponent } from '../../components/todo-list/todo-list.component';
import { LovFacade } from '@cms/system-config/domain';
import { FinancialVendorFacade, FinancialVendorRefundFacade } from '@cms/case-management/domain';
  
  @Component({
    selector: 'productivity-tools-todo-and-reminders-fab-page',
    templateUrl: './todo-and-reminders-fab-page.component.html',  
    changeDetection: ChangeDetectionStrategy.OnPush,
  })
  export class TodoAndRemindersFabPageComponent implements OnInit{
    isShowTodoReminders = false
    showRemindersList = false
    clientId = 0
    todoItemList:any;
    private todoDetailsDialog: any;
    frequencyTypeCodeSubject$ = this.lovFacade.frequencyTypeCodeSubject$
    entityTypeCodeSubject$ = this.lovFacade.entityTypeCodeSubject$;
    searchProviderSubject = this.financialVendorFacade.searchProviderSubject
    clientSearchLoaderVisibility$ = this.FinancialRefundFacade.clientSearchLoaderVisibility$;
    clientSearchResult$ = this.FinancialRefundFacade.clients$;
    providerSearchResult$ =this.financialVendorFacade.searchProvider$
    createTodo$ = this.todoFacade.createTodo$
     clientSubject = this.FinancialRefundFacade.clientSubject;
     medicalProviderSearchLoaderVisibility$ = this.financialVendorFacade.medicalProviderSearchLoaderVisibility$
     getTodo$ = this.todoFacade.getTodo$;
    @Output() isToDODetailsActionOpen!: boolean;
    todoGrid$ = this.todoFacade.todoGrid$
    loadAlertGrid$ = this.todoFacade.loadAlertGrid$;
    selectedAlertId! :any
    @ViewChild('todoList', { static: false })
    todoList!: TodoListComponent;
    constructor( private route: ActivatedRoute,
      public readonly todoFacade: TodoFacade,
      public lovFacade : LovFacade,
      private readonly FinancialRefundFacade: FinancialVendorRefundFacade,
      private dialogService: DialogService, 
      private readonly financialVendorFacade : FinancialVendorFacade
    ) {}
    /** Lifecycle hooks **/
    ngOnInit(): void {        

        this.clientId = this.route.snapshot.queryParams['id'];
        if(this.clientId > 0 )
        {
            this.isShowTodoReminders = true
            this.showRemindersList = false
        }
        else
        {
            this.isShowTodoReminders = false
            this.showRemindersList = true
        }
      }
      closeAction()
      {
        this.isShowTodoReminders = false
      }

      onloadTodoGrid(payload: any, alertTypeCode:any){
        this.todoFacade.loadAlerts(payload,alertTypeCode.alertType);
      }
      onMarkAlertDoneGrid(selectedAlertId: any){
        this.todoFacade.markAlertAsDone(selectedAlertId);
      }
      onDeleteAlertGrid(selectedAlertId: any){
        this.todoFacade.deleteAlert(selectedAlertId);
      }
      onOpenTodoClicked(alertId:any ,template: TemplateRef<unknown>): void {
        this.selectedAlertId = alertId;
         this.todoDetailsDialog = this.dialogService.open({
           content: template,
           cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np mnl',
         });
         this.isToDODetailsActionOpen = true;
       }
       onCloseTodoClicked(result: any) {
        if (result) {
          this.isToDODetailsActionOpen = false;
          this.todoDetailsDialog.close();
        }
      }
      loadTodoList(){
        this.todoList.initilizeGridRefinersAndGrid()
       }
       searchProvider(data:any){
        this.financialVendorFacade.searchAllProvider(data);
      }
      searchClientName(event:any){
        this.FinancialRefundFacade.loadClientBySearchText(event);
      }
      onTodoItemCreateClick(payload:any){
        this.todoFacade.createTodoItem(payload);
      }
      onGetTodoItem($event:any){
        this.todoFacade.getTodoItem($event);
      }
      onUpdateTodoItemClick(payload:any){
        this.todoFacade.updateTodoItem(payload)
      }
      getTodoItemsLov(){
        this.lovFacade.getFrequencyTypeLov()
        this.lovFacade.getEntityTypeCodeLov()
      }
  }