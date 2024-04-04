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

import { FabMenuFacade, NotificationFacade, TodoFacade } from '@cms/productivity-tools/domain';
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
    clientSearchLoaderVisibility$ = this.financialRefundFacade.clientSearchLoaderVisibility$;
    clientSearchResult$ = this.financialRefundFacade.clients$;
    providerSearchResult$ =this.financialVendorFacade.searchProvider$
    createTodo$ = this.todoFacade.curdAlert$
     clientSubject = this.financialRefundFacade.clientSubject;
     medicalProviderSearchLoaderVisibility$ = this.financialVendorFacade.medicalProviderSearchLoaderVisibility$
     getTodo$ = this.todoFacade.getTodo$;
    @Output() isToDODetailsActionOpen!: boolean;
    todoGrid$ = this.todoFacade.todoGrid$
    loadAlertGrid$ = this.todoFacade.loadAlertGrid$;
    loadTodoList$ = this.todoFacade.loadTodoList$;
    selectedAlertId! :any
    isEdit = false;
    isDelete = false;
    @ViewChild('todoList', { static: false })
    todoList!: TodoListComponent;
    @ViewChild('newReminderTemplate', { read: TemplateRef })
    newReminderTemplate!: TemplateRef<any>;
    @ViewChild('deleteTodoTemplate', { read: TemplateRef })
    deleteTodoTemplateRef!: TemplateRef<any>;
    deleteToDoDialog!:any
    isToDODeleteActionOpen = false
    reminderDialog :any
    crudText ="Create New"
    constructor( private route: ActivatedRoute,
      public readonly todoFacade: TodoFacade,
      public lovFacade : LovFacade,
      private readonly financialRefundFacade: FinancialVendorRefundFacade,
      private dialogService: DialogService, 
      private readonly financialVendorFacade : FinancialVendorFacade,
      public readonly fabMenuFacade: FabMenuFacade,
      public readonly notificationFacade : NotificationFacade
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
        this.todoFacade.curdAlert$.subscribe(res =>{
          if(this.clientId){
          this.todoFacade.todoAndRemindersByClient(this.clientId)
          }

        })
      }
      closeAction()
      {
        this.fabMenuFacade.isShownTodoReminders = !this.fabMenuFacade.isShownTodoReminders;
      }

      editTodoItem(event:any){
      
      }
      onloadTodoGrid(){
        this.todoFacade.loadAlertsData();
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
        this.isEdit = false;
        this.isDelete = false;
        if (result) {
          this.isToDODetailsActionOpen = false;
          if(this.clientId){
          this.todoFacade.todoAndRemindersByClient(this.clientId)
          }
        }
        this.todoDetailsDialog.close();

      }
      loadTodoList(){
        if(this.clientId){
        this.todoFacade.todoAndRemindersByClient(this.clientId)
        }
       }
       searchProvider(data:any){
        this.financialVendorFacade.searchAllProvider(data);
      }
      searchClientName(event:any){
        this.financialRefundFacade.loadClientBySearchText(event);
      }
      onTodoItemCreateClick(payload:any){
        this.todoFacade.createAlertItem(payload);
      }
      onGetTodoItem($event:any){
        this.todoFacade.getTodoItem($event);
      }
      onUpdateTodoItemClick(payload:any){
        this.todoFacade.updateAlertItem(payload)
      }
      getTodoItemsLov(){
        this.lovFacade.getFrequencyTypeLov()
        this.lovFacade.getEntityTypeCodeLov()
      }

      onReminderOpenClicked(event:any) {
        this.selectedAlertId = event.alertId;
        if(event.type =='edit'){
          this.crudText ="Edit"
        }
        if(event.type =='delete'){
          this.crudText ="Delete"
        }
        this.isEdit = event.type == 'edit'
        this.isDelete = event.type == 'delete'
        this.reminderDialog = this.dialogService.open({
          content: this.newReminderTemplate,
          cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
        });
      
    }

    onNewReminderClosed(){
      this.isDelete = false;
      this.isEdit = false;
      this.crudText ="Create New"
     this.reminderDialog.close()
    }

    onDeleteToDoClicked(event:any): void {
      this.selectedAlertId = event;
      this.deleteToDoDialog = this.dialogService.open({
        content: this.deleteTodoTemplateRef,
        cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
      });
    }

    onCloseDeleteToDoClicked(result: any) {
      if (result) {
        this.isToDODeleteActionOpen = false;
        this.deleteToDoDialog.close();
      }
    }
    onConfirmDeleteToDOClicked(result: any) 
    {
      if (result) {
        this.isToDODeleteActionOpen = false;
        this.deleteToDoDialog.close();
        this.onDeleteAlertGrid(this.selectedAlertId);
      }
    }

    onSnoozeReminder(event:any){ 
      this.notificationFacade.snoozeReminder$.subscribe(res =>{
        this.todoFacade.todoAndRemindersByClient(this.clientId)
      })
      this.notificationFacade.SnoozeReminder(event.reminderId,event.duration);
    }

  }