import {
  Component,
  OnInit,
  ViewEncapsulation,
  ChangeDetectionStrategy,
} from '@angular/core';
import { SystemConfigFinancialFacade } from '@cms/system-config/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';

@Component({
  selector: 'system-config-pca-codes-list',
  templateUrl: './pca-codes-list.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
 
 
export class PcaCodesListComponent implements OnInit{
  
  public pageSize = 10;
  public skip = 0;
  public pageSizes = [
    {text: '5', value: 5}, 
    {text: '10', value: 10},
    {text: '20', value: 20},
    {text: 'All', value: 100}
  ];
  /** Public properties **/ 
  isPcaCodeDetailPopup = false;
  pcaCodeLists$ = this.systemConfigFinancialFacade.loadPcaCodeListsService$;
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  public formUiStyle : UIFormStyle = new UIFormStyle();
  public moreActions = [
    {
      buttonType:"btn-h-primary",
      text: "Assign Slot",
      icon: "arrow_right_alt",
   
    }, 
    {
      buttonType:"btn-h-primary",
      text: "Edit",
      icon: "edit",
   
    }, 
    {
      buttonType:"btn-h-danger",
      text: "Delete",
      icon: "delete",
 
    }, 
 
  ];
  /** Constructor **/
  constructor(private readonly systemConfigFinancialFacade: SystemConfigFinancialFacade) {}

  /** Lifecycle hooks **/
  ngOnInit(): void { 
    this.loadPcaCodeLists();
  }

  /** Private  methods **/
 
  private loadPcaCodeLists() {
    this.systemConfigFinancialFacade.loadPcaCodeLists();
  }
  onClosePcaCodeDetailClicked() {
    this.isPcaCodeDetailPopup = false;
  }
  onPcaCodeDetailClicked() {
    this.isPcaCodeDetailPopup = true;
  }
}

