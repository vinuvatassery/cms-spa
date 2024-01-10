 
import {
  Component,
  OnInit,
  ViewEncapsulation,
  ChangeDetectionStrategy,
} from '@angular/core';
import { SystemConfigServiceProviderFacade } from '@cms/system-config/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';

 

@Component({
  selector: 'system-config-medical-providers-list',
  templateUrl: './medical-providers-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalProvidersListComponent implements OnInit{
  
  public pageSize = 10;
  public skip = 0;
  public pageSizes = [
    {text: '5', value: 5}, 
    {text: '10', value: 10},
    {text: '20', value: 20},
    {text: 'All', value: 100}
  ];
  /** Public properties **/
  isMedicalProvidersDetailPopup = false; 
  isMedicalProvidersDeletePopupShow = false;
  isMedicalProvidersDeactivatePopupShow = false;
  medicalProvidersLists$ = this.systemConfigServiceProviderFacade.loadMedicalProvidersListsService$;
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  public formUiStyle : UIFormStyle = new UIFormStyle();
  public moreactions = [
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
        this.onMedicalProvidersDeactivateClicked();
      },
    }, 
    {
      buttonType:"btn-h-danger",
      text: "Delete",
      icon: "delete", 
      click: (data: any): void => {
        this.onMedicalProvidersDeleteClicked();
      },
    }, 
 
  ];
  /** Constructor **/
  constructor(private readonly systemConfigServiceProviderFacade: SystemConfigServiceProviderFacade) {}

  /** Lifecycle hooks **/
  ngOnInit(): void { 
    this.loadMedicalProvidersLists();
  }

  /** Private  methods **/
 
  private loadMedicalProvidersLists() {
    this.systemConfigServiceProviderFacade.loadMedicalProvidersLists();
  }

  /** Internal event methods **/
  onCloseMedicalProvidersDetailClicked() {
    this.isMedicalProvidersDetailPopup = false;
  }
  onMedicalProvidersDetailClicked() {
    this.isMedicalProvidersDetailPopup = true;
  }

  onCloseMedicalProvidersDeleteClicked() {
    this.isMedicalProvidersDeletePopupShow = false;
  }
  onMedicalProvidersDeleteClicked() {
    this.isMedicalProvidersDeletePopupShow = true;
  }
  onCloseMedicalProvidersDeactivateClicked() {
    this.isMedicalProvidersDeactivatePopupShow = false;
  }
  onMedicalProvidersDeactivateClicked() {
    this.isMedicalProvidersDeactivatePopupShow = true;
  }
}
