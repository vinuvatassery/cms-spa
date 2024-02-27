import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UserManagementFacade } from '@cms/system-config/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
@Component({
  selector: 'system-config-income-inclusions-exclusions-list',
  templateUrl: './income-inclusions-exclusions-list.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IncomeInclusionsExclusionsListComponent implements OnInit {

  public pageSize = 10;
  public skip = 0;
  public pageSizes = [
    {text: '5', value: 5}, 
    {text: '10', value: 10},
    {text: '20', value: 20},
    {text: 'All', value: 100}
  ];
  isIncomeInclusionsExclusionsDetailPopup = false;
  public formUiStyle : UIFormStyle = new UIFormStyle();
  ddlColumnFilters$ = this.userManagementFacade.ddlColumnFilters$;
  clientProfileIncomeInclusionsExclusions$ =
    this.userManagementFacade.clientProfileIncomeInclusionsExclusions$;
    popupClassAction = 'TableActionPopup app-dropdown-action-list';
    public girdMoreActionsList = [
      {
        buttonType:"btn-h-primary",
        text: "Edit",
        icon: "edit",
        click: (): void => {
           this.onIncomeInclusionExclusionDetailClicked();
        },
      }, 
      
   
    ];
  constructor(private readonly userManagementFacade: UserManagementFacade) { }

  ngOnInit(): void {
    this.loadDdlColumnFilters();
    this.loadIncomeInclusionsExlusionsList();
  }
   /** Private methods **/
   private loadDdlColumnFilters() {
    this.userManagementFacade.loadDdlColumnFilters();
  }

  private loadIncomeInclusionsExlusionsList() {
    this.userManagementFacade.loadIncomeInclusionsExlusionsList();
  }
   /** Internal event methods **/
   onCloseIncomeInclusionsExclusionsDetailClicked() {
  this.isIncomeInclusionsExclusionsDetailPopup = false;
}
onIncomeInclusionExclusionDetailClicked() {
  this.isIncomeInclusionsExclusionsDetailPopup = true;
}

}
