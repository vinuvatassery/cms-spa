import {
  Component,
  OnInit,
  ViewEncapsulation,
  ChangeDetectionStrategy,
} from '@angular/core';
import { SystemConfigServiceProviderFacade } from '@cms/system-config/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';



@Component({
  selector: 'system-config-drugs-list',
  templateUrl: './drugs-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrugsListComponent  implements OnInit{
  
  public pageSize = 10;
  public skip = 0;
  public pageSizes = [
    {text: '5', value: 5}, 
    {text: '10', value: 10},
    {text: '20', value: 20},
    {text: 'All', value: 100}
  ];
  /** Public properties **/
  isDrugsDetailPopup = false; 
  isDrugsReassignPopupShow = false;
  isDrugsDeactivatePopupShow = false;
  drugsLists$ = this.systemConfigServiceProviderFacade.loadDrugsListsService$;
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  public formUiStyle : UIFormStyle = new UIFormStyle();
  public moreactions = [
    {
      buttonType:"btn-h-primary",
      text: "Edit Drugs",
      icon: "edit",
     
    }, 
  
    {
      buttonType:"btn-h-primary",
      text: "Deactivate Drugs",
      icon: "block",
      click: (data: any): void => {
        this.onDrugsDeactivateClicked();
      },
    }, 
    {
      buttonType:"btn-h-primary",
      text: "Re-assign Drugs",
      icon: "compare_arrows", 
      click: (data: any): void => {
        this.onDrugsReassignClicked();
      },
    }, 
 
  ];
  /** Constructor **/
  constructor(private readonly systemConfigServiceProviderFacade: SystemConfigServiceProviderFacade) {}

  /** Lifecycle hooks **/
  ngOnInit(): void { 
    this.loadDrugsLists();
  }

  /** Private  methods **/
 
  private loadDrugsLists() {
    this.systemConfigServiceProviderFacade.loadDrugsLists();
  }

  /** Internal event methods **/
  onCloseDrugsDetailClicked() {
    this.isDrugsDetailPopup = false;
  }
  onDrugsDetailClicked() {
    this.isDrugsDetailPopup = true;
  }

  onCloseDrugsReassignClicked() {
    this.isDrugsReassignPopupShow = false;
  }
  onDrugsReassignClicked() {
    this.isDrugsReassignPopupShow = true;
  }
  onCloseDrugsDeactivateClicked() {
    this.isDrugsDeactivatePopupShow = false;
  }
  onDrugsDeactivateClicked() {
    this.isDrugsDeactivatePopupShow = true;
  }
}
