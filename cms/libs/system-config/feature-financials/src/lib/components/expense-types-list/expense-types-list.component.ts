import {
  Component,
  OnInit,
  ViewEncapsulation,
  ChangeDetectionStrategy,
} from '@angular/core';
import { SystemConfigFinancialFacade } from '@cms/system-config/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';

@Component({
  selector: 'system-config-expense-types-list',
  templateUrl: './expense-types-list.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExpenseTypesListComponent implements OnInit{
  
  public pageSize = 10;
  public skip = 0;
  public pageSizes = [
    {text: '5', value: 5}, 
    {text: '10', value: 10},
    {text: '20', value: 20},
    {text: 'All', value: 100}
  ];
  /** Public properties **/
  isExpenseTypeDetailPopup = false; 
  indexLists$ = this.systemConfigFinancialFacade.loadExpenseTypeListsService$;
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  public formUiStyle : UIFormStyle = new UIFormStyle();
  public moreActions = [
    {
      buttonType:"btn-h-primary",
      text: "Edit",
      icon: "edit",
      click: (): void => {
      },
    }, 
    {
      buttonType:"btn-h-danger",
      text: "Deactivate",
      icon: "block",
      click: (): void => {
      },
    }, 
 
  ];
  /** Constructor **/
  constructor(private readonly systemConfigFinancialFacade: SystemConfigFinancialFacade) {}

  /** Lifecycle hooks **/
  ngOnInit(): void { 
    this.loadExpenseTypeLists();
  }

  /** Private  methods **/
 
  private loadExpenseTypeLists() {
    this.systemConfigFinancialFacade.loadExpenseTypeLists();
  }

  /** Internal event methods **/
  onCloseExpenseTypeDetailClicked() {
    this.isExpenseTypeDetailPopup = false;
  }
  onExpenseTypeDetailClicked() {
    this.isExpenseTypeDetailPopup = true;
  }
}

