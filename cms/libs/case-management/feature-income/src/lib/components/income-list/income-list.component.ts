/** Angular **/
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';
/** Enums **/
import { ScreenType } from '@cms/case-management/domain';
/**  Facades **/
import { IncomeFacade } from '@cms/case-management/domain';

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

  /** Public properties **/
  incomes$ = this.incomeFacade.incomes$;
  dependentsProofofSchools$ = this.incomeFacade.dependentsProofofSchools$;
  isEdit!: boolean;
  isOpenedIncome = false;
  isAddIncomeButtonAndFooterNoteDisplay!: boolean;
  isIncludeNote!: boolean;
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
      //  this.onDeactivatePhoneNumberClicked()
      },
    },
   
    
 
  ];
  /** Constructor **/
  constructor(private readonly incomeFacade: IncomeFacade) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadIncomes();
    this.loadDependentsProofofSchools();
    this.includeAddIncomeButtonAndFooterNote();
  }

  /** Private methods **/
  private loadIncomes() {
    this.incomeFacade.loadIncomes();
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
}
