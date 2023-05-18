/** Angular **/
import { Component, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';

@Component({
  selector: 'case-management-deactivate-premium-confirmation',
  templateUrl: './deactivate-medical-premium.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeactivateInsuranceConfirmationComponent {

  endDate!: Date;
  showError = false;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  @Output() deactivateConfimEvent =  new EventEmitter<any>();
 

  onDeactivateConfirm(isDelete: boolean) {   
    if (this.endDate) 
    {
      this.showError= false;
      const removeInsuranceData = {
        endDate: this.endDate,
        confirm: isDelete      
      };
      this.deactivateConfimEvent.emit(removeInsuranceData);
    }
    else if(isDelete)
    {
      this.showError= true;
    }
   else
    {
      this.showError= false;
      const removeInsuranceData = {      
        confirm: false        
      };
      this.deactivateConfimEvent.emit(removeInsuranceData);
    }
  }
}
