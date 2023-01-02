/** Angular **/
import {
  Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter
} from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
/** Enums **/
import { CompletionChecklist, ScreenType, StatusFlag, WorkflowFacade } from '@cms/case-management/domain';
/**  Facades **/
import { IncomeFacade, Income } from '@cms/case-management/domain';
/** Entities **/
import { DeleteRequest, SnackBar } from '@cms/shared/ui-common';

import { State } from '@progress/kendo-data-query';

import { UIFormStyle } from '@cms/shared/ui-tpa';
@Component({
  selector: 'case-management-income-list',
  templateUrl: './income-list.component.html',
  styleUrls: ['./income-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IncomeListComponent implements OnInit {
  /** Input properties **/
  @Input() data!: any;
  @Input() hasNoIncome!: boolean;
  @Input() clientCaseEligibilityId: string="";
  @Input() clientId: any;
  @Input() clientCaseId: any;
 
  @Output() loadIncomeListEvent = new EventEmitter<any>();
  public formUiStyle: UIFormStyle = new UIFormStyle();
  public pageSizes = this.incomeFacade.gridPageSizes;
  public gridSkipCount = this.incomeFacade.skipCount;
  public state!: State;

  /** Public properties **/
  incomes$ = this.incomeFacade.incomes$;
  incomesTotal:any={};
  dependentsProofofSchools$ = this.incomeFacade.dependentsProofofSchools$;
  isEdit!: boolean;
  selectedIncome: any;
  isOpenedIncome = false;
  isAddIncomeButtonAndFooterNoteDisplay!: boolean;
  isIncludeNote!: boolean;
  deleteRequestSubject = new Subject<DeleteRequest>();
  deleteRequest$ = this.deleteRequestSubject.asObservable();
  isRemoveIncomeConfirmationPopupOpened = false;
  snackbarMessage!: SnackBar;
  snackbarSubject = new Subject<SnackBar>();
  snackbar$ = this.snackbarSubject.asObservable();
  // actions: Array<any> = [{ text: 'Action' }];
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  public actions = [
    {
      buttonType:"btn-h-primary",
      text: "Attach from computer",
      // icon: "edit",
      click: (): void => {
        // this.onPhoneNumberDetailClicked(true);
      },
    },
    {
      buttonType:"btn-h-primary",
      text: "Attach from client attachments",
      // icon: "star",
      click: (): void => {
      //  this.onDeactivateEmailAddressClicked()
      },
    },
 
    {
      buttonType:"btn-h-danger",
      text: "Remove File",
      // icon: "delete",
      click: (): void => {
      //  this.onDeactivatePhoneNumberClicked()
      },
    },
   
    
 
  ];

  public actionsmore = [
    {
      buttonType:"btn-h-primary",
      text: "Edit Income",
        icon: "edit",
        type: 'edit',
        // click: (): void => {
        //   this.onIncomeClicked(true);
        // },
    },
    
 
    {
      buttonType:"btn-h-danger",
      text: "Delete Income",
      icon: "delete",
      // click: (): void => {
      // this.onDeleteEmployerDetailsClicked('john')
      // },
      type: 'delete',
    },
   
    
 
  ];
  /** Constructor **/
  constructor(private readonly incomeFacade: IncomeFacade, private readonly workflowFacade: WorkflowFacade) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadIncomes();
    this.includeAddIncomeButtonAndFooterNote();
  }

  ngOnChanges(){
    this.state = {
      skip: this.gridSkipCount,
      take: this.pageSizes[0]?.value
    };
  }
  /** Private methods **/
  private loadIncomes() {
    this.incomeFacade.incomesResponse$.subscribe((incomeresponse:any)=>{
      this.incomesTotal=incomeresponse;
    })
    this.incomeFacade.HideLoader();

    this.incomes$.subscribe({
      next:(income:any) => {
        this.updateWorkFlowStatus(income?.total > 0);
      },
      error:()=>{
        this.updateWorkFlowStatus(false);
      }
    })
  }
// Grid More action clicl function
onIncomeActionClicked(
  selectedincome : any, modalType: string = '') {
    this.selectedIncome = selectedincome;
  if (modalType == 'edit') {
 this.onIncomeClicked(true);
  }
  if (modalType == 'delete') {
    this.isRemoveIncomeConfirmationPopupOpened = true;
  }
}
  private loadDependentsProofofSchools() {
    this.incomeFacade.loadDependentsProofofSchools();
  }

  private includeAddIncomeButtonAndFooterNote() {
    if (this.data === ScreenType.Case360Page) {
      this.isAddIncomeButtonAndFooterNoteDisplay = false;
    } else {
      this.isAddIncomeButtonAndFooterNoteDisplay = true;
    }
  }
  private updateWorkFlowStatus(isCompleted:boolean) 
  {
    const workFlowdata: CompletionChecklist[] = [{
      dataPointName: 'income',
      status: isCompleted ? StatusFlag.Yes :StatusFlag.No 
    }];

    this.workflowFacade.updateChecklist(workFlowdata);
  }

  /** Internal event methods **/
  onIncomeClosed() {
    this.isOpenedIncome = false;
  }

  onIncomeClicked(editValue: boolean) {
    this.isOpenedIncome = true;
    this.isEdit = editValue;
  }

  closeIncomePopup($event:any){
    this.isOpenedIncome = $event.popupState;
  }

  updateIncomeHandle(icome: any) {
    this.loadIncomes();
  }

  handleDeleteConfirmationClicked(event: any) {
    console.log('Response Data :', event);
  }

  onRemoveIncomeConfirmationClosed() {
    this.isRemoveIncomeConfirmationPopupOpened = false;
}
  // updating the pagination infor based on dropdown selection
  pageselectionchange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadIncomeData();
  }

  public dataStateChange(stateData: any): void {
    this.state = stateData;
    this.loadIncomeData();
  }
  // Loading the grid data based on pagination
  private loadIncomeData(): void {
    this.LoadIncomeList(
      this.state.skip ?? 0,
      this.state.take ?? 0
    );
  }

  LoadIncomeList(
    skipcountValue: number,
    maxResultCountValue: number
  ) {
    const gridDataRefinerValue = {
      skipCount: skipcountValue,
      pagesize: maxResultCountValue
    };
    this.loadIncomeListEvent.next(gridDataRefinerValue);
  }

  incomeDetailResponseHandle(event:any){
    if(event){
      this.loadIncomeData();
    }
  }
}
