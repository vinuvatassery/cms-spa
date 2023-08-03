/** Angular **/
import {
  Component,
  ChangeDetectionStrategy,
  Output,
  Input,
  EventEmitter,
} from '@angular/core';
import { DrugPharmacyFacade } from '@cms/case-management/domain';

import { UIFormStyle } from '@cms/shared/ui-tpa';

@Component({
  selector: 'case-management-deactivate-pharmacy',
  templateUrl: './deactivate-pharmacy.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class DeactivatePharmacyComponent {
  @Input() clientId: any;
  @Output() closeDeactivatePharmacies = new EventEmitter();
  @Input() clientPharmacyDetails: any;
  @Input() isShowHistoricalData: any;
  public formUiStyle: UIFormStyle = new UIFormStyle();
 /** Constructor **/
 constructor(
  private readonly drugPharmacyFacade: DrugPharmacyFacade
) {
}
  onCloseDeactivatePharmaciesClicked() {
    this.closeDeactivatePharmacies.emit();
  }
  onDeactivateClick()
  {
    let pharmacy ={
      ClientId:this.clientPharmacyDetails.clientId,
      IsActive:false
    }
    this.drugPharmacyFacade.deactivePharmacies(this.clientPharmacyDetails.clientPharmacyId,pharmacy,this.isShowHistoricalData);
  }
}
