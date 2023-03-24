/** Angular **/
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Output, Input,
  EventEmitter,
  ChangeDetectorRef
} from '@angular/core';
import {
  FormGroup
} from '@angular/forms'
 
 
import { UIFormStyle } from '@cms/shared/ui-tpa';

@Component({
  selector: 'case-management-set-as-primary-pharmacy',
  templateUrl: './set-as-primary-pharmacy.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetAsPrimaryPharmacyComponent {

  @Output() closeSelectNewPrimaryPharmacies = new EventEmitter();
  @Input() clientPharmacyDetails!: any;
  IsDeactivateSelectPrimaryPharmacies = false;
  public formUiStyle : UIFormStyle = new UIFormStyle(); 



  onCloseSelectNewPrimaryPharmaciesClicked(){
    this.closeSelectNewPrimaryPharmacies.emit();
  }
}
