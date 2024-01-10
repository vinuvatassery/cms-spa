import {
  Component,
  OnInit,
  ViewEncapsulation,
  ChangeDetectionStrategy,
} from '@angular/core';
import { SystemConfigServiceProviderFacade } from '@cms/system-config/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';

@Component({
  selector: 'system-config-insurance-plan-list',
  templateUrl: './insurance-plan-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InsurancePlanListComponent implements OnInit {
  public pageSize = 10;
  public skip = 0;
  public pageSizes = [
    { text: '5', value: 5 },
    { text: '10', value: 10 },
    { text: '20', value: 20 },
    { text: 'All', value: 100 },
  ];
  /** Public properties **/
  isInsurancePlansDetailPopup = false;
  isInsurancePlansDeletePopupShow = false;
  isInsurancePlansDeactivatePopupShow = false;
  isInsurancePlansBulkMigrationPopupShow = false;
  insurancePlansLists$ =
    this.systemConfigServiceProviderFacade.loadInsurancePlansListsService$;
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  public formUiStyle: UIFormStyle = new UIFormStyle();
  public bulkMore = [
    {
      buttonType: 'btn-h-primary',
      text: 'BULK MIGRATION',
      click: (data: any): void => {
        this.onInsurancePlansBulkMigrationClicked();
      },
    },
  ];
  public moreactions = [
    {
      buttonType: 'btn-h-primary',
      text: 'Edit',
      icon: 'edit',
    },

    {
      buttonType: 'btn-h-primary',
      text: 'Deactivate',
      icon: 'block',
      click: (data: any): void => {
        this.onInsurancePlansDeactivateClicked();
      },
    },
    {
      buttonType: 'btn-h-danger',
      text: 'Delete',
      icon: 'delete',
      click: (data: any): void => {
        this.onInsurancePlansDeleteClicked();
      },
    },
  ];
  /** Constructor **/
  constructor(
    private readonly systemConfigServiceProviderFacade: SystemConfigServiceProviderFacade
  ) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadInsurancePlansLists();
  }

  /** Private  methods **/

  private loadInsurancePlansLists() {
    this.systemConfigServiceProviderFacade.loadInsurancePlansLists();
  }

  /** Internal event methods **/
  onCloseInsurancePlansDetailClicked() {
    this.isInsurancePlansDetailPopup = false;
  }
  onInsurancePlansDetailClicked() {
    this.isInsurancePlansDetailPopup = true;
  }

  onCloseInsurancePlansDeleteClicked() {
    this.isInsurancePlansDeletePopupShow = false;
  }
  onInsurancePlansDeleteClicked() {
    this.isInsurancePlansDeletePopupShow = true;
  }
  onCloseInsurancePlansDeactivateClicked() {
    this.isInsurancePlansDeactivatePopupShow = false;
  }
  onInsurancePlansDeactivateClicked() {
    this.isInsurancePlansDeactivatePopupShow = true;
  }

  onCloseInsurancePlansBulkMigrationClicked() {
    this.isInsurancePlansBulkMigrationPopupShow = false;
  }
  onInsurancePlansBulkMigrationClicked() {
    this.isInsurancePlansBulkMigrationPopupShow = true;
  }
}
