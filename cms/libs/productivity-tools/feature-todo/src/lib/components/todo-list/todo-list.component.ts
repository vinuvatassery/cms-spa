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
} from '@angular/core';
import { Router } from '@angular/router';
import { FinancialServiceTypeCode, FinancialVendorProviderTabCode } from '@cms/case-management/domain';
import { AlertEntityTypeCode, AlertFrequencyTypeCode, AlertTypeCode, TodoFacade } from '@cms/productivity-tools/domain';
import { ToDoEntityTypeCode } from '@cms/shared/ui-common';
import { ConfigurationProvider } from '@cms/shared/util-core';
/** Facades **/
import { DialogService } from '@progress/kendo-angular-dialog';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { SortDescriptor, State } from '@progress/kendo-data-query';
import { BehaviorSubject, Subject } from 'rxjs';
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
  @Output() isModalTodoDetailsOpenClicked = new EventEmitter<any>();
  @Output() isLoadTodoGridEvent = new EventEmitter<any>();
  @Input() isToDODetailsActionOpen: any;
  @Input()  todoGrid$ :any;
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
  sortType = 'asc';
  sort: SortDescriptor[] = [{
    field: this.sortColumn,
    dir: 'asc',
  }];
  columns:any;
  filter!: any;
  @Input() loadAlertGrid$ : any;
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
    },
  ]; 
  
  /** Constructor **/
  constructor( 
    private dialogService: DialogService,
    private configurationProvider: ConfigurationProvider,
    private readonly router: Router,
    public todoFacade: TodoFacade,
  ) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.toDoGridState = {
      skip: 0,
      take: 10,
      sort: this.sort,
    };
    this.loadColumnsData();
    this.loadTodoGrid();
    this.loadAlertGrid$.subscribe((data: any) => {
      this.loadTodoGrid();
    });
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
  private loadTodoGrid() {
    this.loadTodoGridData(
      this.toDoGridState.skip?? 0,
      this.toDoGridState.take?? 10,
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
        filter: "[]",
      }; 
        this.isLoadTodoGridEvent.emit({gridDataRefinerValue, alertType})
        this.todoGrid$.subscribe((data: any) => {
          this.gridDataResult = data?.items;
          if(data?.totalCount >=0 || data?.totalCount === -1){
            this.isToDoGridLoaderShow.next(false);
          }
          this.gridTodoDataSubject.next(this.gridDataResult);
        });
  }
  onOpenTodoDetailsClicked() {
    this.isModalTodoDetailsOpenClicked.emit();
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
  async onDeleteToDOClicked(result: any) 
  {
    if (result) {
      this.isToDODeleteActionOpen = false;
      this.deleteToDoDialog.close();
      await this.todoFacade.deleteAlert(this.selectedAlertId);
    }
  }
  public get alertFrequencyTypes(): typeof AlertFrequencyTypeCode {
    return AlertFrequencyTypeCode;
  }
  get financeManagementTabs(): typeof FinancialVendorProviderTabCode {
    return FinancialVendorProviderTabCode;
  }
    onToDoClicked(gridItem: any) {
      if (gridItem && gridItem.entityTypeCode == this.entityTypes.Vendor) {
        this.router.navigate([`/case-management/cases/case360/${gridItem?.entityId}`]);
      }
      else if (gridItem && gridItem.entityTypeCode == this.entityTypes.Vendor) {
        const query = {
          queryParams: {
            v_id: gridItem?.entityId ,
            tab_code : this.financeManagementTabs.MedicalProvider
          },
        };
        this.router.navigate(['/financial-management/vendors/profile'], query )
      }
      else if (gridItem && gridItem.entityTypeCode == this.entityTypes.Tpa) {
        this.router.navigate(
          [`/financial-management/claims/medical/batch`],
          { queryParams: { bid: gridItem?.paymentRequestBatchId } }
        );
    }
    else if (gridItem && gridItem.entityTypeCode == this.entityTypes.Insurance) {
      this.router.navigate(
        [`/financial-management/claims/dental/batch`],
        { queryParams: { bid: gridItem?.paymentRequestBatchId } }
      );
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
  }
  async onToDoActionClicked(item: any,gridItem: any){ 
    if(item.id == 'done'){
       this.onDoneTodoItem(gridItem.alertId);
    }else if(item.id == 'edit'){ 
      if (!this.isToDODetailsActionOpen) {
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
  onDoneTodoItem(payload:any){
    return this.todoFacade.markAlertAsDone(payload);
  }
  public get claimTypes(): typeof FinancialServiceTypeCode {
    return FinancialServiceTypeCode;
  }
  public get entityTypes(): typeof ToDoEntityTypeCode {
    return ToDoEntityTypeCode;
  }
}
