/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
/** Facades **/
import { HealthInsuranceFacade } from '@cms/case-management/domain';

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
