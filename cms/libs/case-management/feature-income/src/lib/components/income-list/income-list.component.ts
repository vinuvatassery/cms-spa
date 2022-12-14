/** Angular **/
import {
  Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter
} from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
/** Enums **/
import { ScreenType } from '@cms/case-management/domain';
/**  Facades **/
import { IncomeFacade } from '@cms/case-management/domain';
/** Entities **/
import { DeleteRequest, SnackBar } from '@cms/shared/ui-common';

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
  /** Public properties **/
  incomes$ = this.incomeFacade.incomes$;
  incomesTotal:any={};
  dependentsProofofSchools$ = this.incomeFacade.dependentsProofofSchools$;
  isEdit!: boolean;
  isOpenedIncome = false;
  isAddIncomeButtonAndFooterNoteDisplay!: boolean;
  isIncludeNote!: boolean;
  deleteRequestSubject = new Subject<DeleteRequest>();
  deleteRequest$ = this.deleteRequestSubject.asObservable();
  
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
      click: (): void => {
        this.onIncomeClicked(true);
      },
    },
    
 
    {
      buttonType:"btn-h-danger",
      text: "Delete Income",
      icon: "delete",
      click: (): void => {
      this.onDeleteEmployerDetailsClicked('john')
      },
    },
   
    
 
  ];
  /** Constructor **/
  constructor(private readonly incomeFacade: IncomeFacade) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadIncomes();
    this.includeAddIncomeButtonAndFooterNote();
  }

  /** Private methods **/
  private loadIncomes() {
    this.incomeFacade.incomesResponse$.subscribe((incomeresponse:any)=>{
      this.incomesTotal=incomeresponse;
    })
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

  onDeleteEmployerDetailsClicked(deleteDetails: any) {
    const deleteConfirmation: DeleteRequest = {
      title: ' Income',
      content: 'The Income will be deleted from the application',
      data: deleteDetails,
    };
    this.deleteRequestSubject.next(deleteConfirmation);
  }

  handleDeleteConfirmationClicked(event: any) {
    console.log('Response Data :', event);
  }

 
}
