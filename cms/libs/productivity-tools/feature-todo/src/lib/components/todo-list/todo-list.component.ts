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
import { FinancialVendorProviderTabCode } from '@cms/case-management/domain';
import { AlertFrequencyTypeCode, TodoFacade } from '@cms/productivity-tools/domain';
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
    )
  }
  private loadTodoGridData(skipCountValue: number,
    maxResultCountValue: number,
    sortValue: string,
    sortTypeValue: string){
      this.isToDoGridLoaderShow.next(true);
      const gridDataRefinerValue = {
        SkipCount: skipCountValue,
        MaxResultCount: maxResultCountValue,
        Sorting: sortValue,
        SortType: sortTypeValue,
        Filter: "[]",
      };
        this.isLoadTodoGridEvent.emit(gridDataRefinerValue)
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
      let res = await this.todoFacade.deleteTodoItem(this.selectedAlertId);
      if(res==1)
        this.loadTodoGrid();
    }
  }
  public get alertFrequencyTypes(): typeof AlertFrequencyTypeCode {
    return AlertFrequencyTypeCode;
  }
  get financeManagementTabs(): typeof FinancialVendorProviderTabCode {
    return FinancialVendorProviderTabCode;
  }
    onToDoClicked(gridItem: any) {
      if (gridItem && gridItem.entityTypeCode == "CLIENT") {
        this.router.navigate([`/case-management/cases/case360/${gridItem?.entityId}`]);
      }
      else if (gridItem && gridItem.entityTypeCode == "VENDOR") {
        const query = {
          queryParams: {
            v_id: gridItem?.entityId ,
            tab_code : this.financeManagementTabs.MedicalProvider
          },
        };
        this.router.navigate(['/financial-management/vendors/profile'], query )
      }
      else if (gridItem && gridItem.entityTypeCode == "TPA") {
        this.router.navigate(
          [`/financial-management/claims/medical/batch`],
          { queryParams: { bid: gridItem?.paymentRequestBatchId } }
        );
    }
    else if (gridItem && gridItem.entityTypeCode == "INSURANCE_PREMIUM") {
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
      let res = await this.onDoneTodoItem(gridItem.alertId);
      if(res==1)
        this.loadTodoGrid();
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
    return this.todoFacade.doneTodoItem(payload);
  }
}
