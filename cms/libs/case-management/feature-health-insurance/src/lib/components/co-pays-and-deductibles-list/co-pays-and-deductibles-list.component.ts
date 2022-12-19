/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
/** Facades **/
import { HealthInsuranceFacade } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
@Component({
  selector: 'case-management-co-pays-and-deductibles-list',
  templateUrl: './co-pays-and-deductibles-list.component.html',
  styleUrls: ['./co-pays-and-deductibles-list.component.scss'],

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoPaysAndDeductiblesListComponent implements OnInit {
  /** Public properties **/
  coPaysAndDeductibles$ = this.healthFacade.coPaysAndDeductibles$;
  gridOptionData: Array<any> = [{ text: 'Options' }];
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  public pageSize = 10;
  public skip = 5;
  public pageSizes = [
    {text: '5', value: 5}, 
    {text: '10', value: 10},
    {text: '20', value: 20},
    {text: 'All', value: 100}
  ];
  public formUiStyle : UIFormStyle = new UIFormStyle(); 
  /** Constructor **/
  constructor(private readonly healthFacade: HealthInsuranceFacade) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadCoPaysAndDeductibles();
  }

  /** Private methods **/
  private loadCoPaysAndDeductibles() {
    this.healthFacade.loadCoPaysAndDeductibles();
  }
}
