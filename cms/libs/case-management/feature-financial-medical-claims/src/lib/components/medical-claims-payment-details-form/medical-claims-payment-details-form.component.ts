import {
  Component,
  ChangeDetectionStrategy,
  Output, 
  EventEmitter,
  OnInit
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UIFormStyle } from '@cms/shared/ui-tpa';
@Component({
  selector: 'cms-medical-claims-payment-details-form',
  templateUrl: './medical-claims-payment-details-form.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalClaimsPaymentDetailsFormComponent implements OnInit {  

  public formUiStyle: UIFormStyle = new UIFormStyle()
  public currentDate = new Date();
  medicalClaimPaymentForm!: FormGroup;
  dateValidator: boolean = false;
  
  @Output() closePaymentDetailFormClickedEvent = new EventEmitter();

  constructor(private formBuilder: FormBuilder){
    
  }
 
  ngOnInit():void{
    this.buildPremiumPaymentForm();
  }
  closePaymentDetailClicked() {
    this.closePaymentDetailFormClickedEvent.emit(true);
  }
  dateValidate(event: Event) {
    this.dateValidator = false;
    const signedDate = this.medicalClaimPaymentForm.controls['datePaymentReconciled'].value;
    const todayDate = new Date();
    if (signedDate > todayDate) {
      this.dateValidator = true;
    }
  }

  validateModel(){

  }
  buildPremiumPaymentForm(){
    this.medicalClaimPaymentForm = this.formBuilder.group({
      datePaymentReconciled: [''],
      datePaymentSent: [''],
      paymentAmount: [''],
      warrantNumber: [''],      
      note: [''],
    });
    
  }
  save(){
    this.validateModel();
  }
}
