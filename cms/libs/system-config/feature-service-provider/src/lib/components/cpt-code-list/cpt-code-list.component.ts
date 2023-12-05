import {
  Component,
  OnInit,
  ViewEncapsulation,
  ChangeDetectionStrategy,
} from '@angular/core';
import { SystemConfigServiceProviderFacade } from '@cms/system-config/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';

 

@Component({
  selector: 'system-config-cpt-code-list',
  templateUrl: './cpt-code-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CptCodeListComponent implements OnInit{
  
  public pageSize = 10;
  public skip = 0;
  public pageSizes = [
    {text: '5', value: 5}, 
    {text: '10', value: 10},
    {text: '20', value: 20},
    {text: 'All', value: 100}
  ];
  /** Public properties **/
  isCptCodeDetailPopup = false; 
  isCptCodeDeletePopupShow = false;
  isCptCodeDeactivatePopupShow = false;
  indexLists$ = this.systemConfigServiceProviderFacade.loadCptCodeListsService$;
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  public formUiStyle : UIFormStyle = new UIFormStyle();
  public moreActions = [
    {
      buttonType:"btn-h-primary",
      text: "Edit",
      icon: "edit",
     
    }, 
  
    {
      buttonType:"btn-h-primary",
      text: "Deactivate",
      icon: "block",
      click: (data: any): void => {
        this.onCptCodeDeactivateClicked();
      },
    }, 
    {
      buttonType:"btn-h-danger",
      text: "Delete",
      icon: "delete", 
      click: (data: any): void => {
        this.onCptCodeDeleteClicked();
      },
    }, 
 
  ];
  /** Constructor **/
  constructor(private readonly systemConfigServiceProviderFacade: SystemConfigServiceProviderFacade) {}

  /** Lifecycle hooks **/
  ngOnInit(): void { 
    this.loadCptCodeLists();
  }

  /** Private  methods **/
 
  private loadCptCodeLists() {
    this.systemConfigServiceProviderFacade.loadCptCodeLists();
  }

  /** Internal event methods **/
  onCloseCptCodeDetailClicked() {
    this.isCptCodeDetailPopup = false;
  }
  onCptCodeDetailClicked() {
    this.isCptCodeDetailPopup = true;
  }

  onCloseCptCodeDeleteClicked() {
    this.isCptCodeDeletePopupShow = false;
  }
  onCptCodeDeleteClicked() {
    this.isCptCodeDeletePopupShow = true;
  }
  onCloseCptCodeDeactivateClicked() {
    this.isCptCodeDeactivatePopupShow = false;
  }
  onCptCodeDeactivateClicked() {
    this.isCptCodeDeactivatePopupShow = true;
  }
}
