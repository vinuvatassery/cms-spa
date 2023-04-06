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
  selector: 'case-management-reactivate-pharmacies',
  templateUrl: './reactivate-pharmacies.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReactivatePharmaciesComponent {

  @Output() closeReactivatePharmacies = new EventEmitter();
  @Input() clientPharmacyDetails: any;
  public formUiStyle: UIFormStyle = new UIFormStyle();
 /** Constructor **/
 constructor(
  private readonly drugPharmacyFacade: DrugPharmacyFacade
) {
}
  onCloseReactivatePharmaciesClicked() {
    this.closeReactivatePharmacies.emit();
  }
  onReactivateClick()
  {
    let pharmacy ={
      ClientId:this.clientPharmacyDetails.clientId,
      IsActive:true
    }
    
    this.drugPharmacyFacade.reActivatePharmacies(this.clientPharmacyDetails.clientPharmacyId,pharmacy);
  }
}
