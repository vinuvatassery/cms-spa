import {
  Component,
  OnInit,
  ViewEncapsulation,
  ChangeDetectionStrategy,
} from '@angular/core';
import { SystemConfigFinancialFacade } from '@cms/system-config/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
@Component({
  selector: 'system-config-index-list',
  templateUrl: './index-list.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IndexListComponent implements OnInit{
  
  public pageSize = 10;
  public skip = 0;
  public pageSizes = [
    {text: '5', value: 5}, 
    {text: '10', value: 10},
    {text: '20', value: 20},
    {text: 'All', value: 100}
  ];
  /** Public properties **/
  isIndexDetailPopup = false; 
  indexLists$ = this.systemConfigFinancialFacade.loadIndexListsService$;
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  public formUiStyle : UIFormStyle = new UIFormStyle();
  public moreactions = [
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
    this.loadIndexLists();
  }

  /** Private  methods **/
 
  private loadIndexLists() {
    this.systemConfigFinancialFacade.loadIndexLists();
  }

  /** Internal event methods **/
  onCloseIndexDetailClicked() {
    this.isIndexDetailPopup = false;
  }
  onIndexDetailClicked() {
    this.isIndexDetailPopup = true;
  }
}
