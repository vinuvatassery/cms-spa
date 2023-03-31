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
  selector: 'case-management-deactivate-pharmacy',
  templateUrl: './deactivate-pharmacy.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeactivatePharmacyComponent {
  @Output() closeDeactivatePharmacies = new EventEmitter();
  @Input() clientPharmacyDetails!: any;
  public formUiStyle : UIFormStyle = new UIFormStyle(); 


  onCloseDeactivatePharmaciesClicked(){
    this.closeDeactivatePharmacies.emit();
  }
}
