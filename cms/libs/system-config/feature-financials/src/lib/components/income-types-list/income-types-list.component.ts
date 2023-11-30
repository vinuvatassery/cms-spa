import {
  Component,
  OnInit,
  ViewEncapsulation,
  ChangeDetectionStrategy,
} from '@angular/core';
import { SystemConfigFinancialFacade } from '@cms/system-config/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';

@Component({
  selector: 'system-config-income-types-list',
  templateUrl: './income-types-list.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
 
export class IncomeTypesListComponent implements OnInit{
  
  public pageSize = 10;
  public skip = 0;
  public pageSizes = [
    {text: '5', value: 5}, 
    {text: '10', value: 10},
    {text: '20', value: 20},
    {text: 'All', value: 100}
  ];
  /** Public properties **/ 
  incomeTypeLists$ = this.systemConfigFinancialFacade.loadIncomeTypeListsService$;
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  public formUiStyle : UIFormStyle = new UIFormStyle();
  public moreActions = [
    {
      buttonType:"btn-h-primary",
      text: "Edit",
      icon: "edit",
 
    }, 
    {
      buttonType:"btn-h-danger",
      text: "Deactivate",
      icon: "block",
  
    }, 
 
  ];
  /** Constructor **/
  constructor(private readonly systemConfigFinancialFacade: SystemConfigFinancialFacade) {}

  /** Lifecycle hooks **/
  ngOnInit(): void { 
    this.loadIncomeTypeLists();
  }

  /** Private  methods **/
 
  private loadIncomeTypeLists() {
    this.systemConfigFinancialFacade.loadIncomeTypeLists();
  }
 
}

