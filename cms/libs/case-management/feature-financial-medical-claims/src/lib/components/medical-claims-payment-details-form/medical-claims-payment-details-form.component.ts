import {
  Component,
  ChangeDetectionStrategy,
  Output, 
  EventEmitter,
  OnInit,
  Input
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaymentPanel, PaymentsFacade } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { SnackBarNotificationType } from '@cms/shared/util-core';
import { IntlService } from '@progress/kendo-angular-intl';
@Component({
  selector: 'cms-medical-claims-payment-details-form',
  templateUrl: './medical-claims-payment-details-form.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalClaimsPaymentDetailsFormComponent implements OnInit {  

  public formUiStyle: UIFormStyle = new UIFormStyle()
  public currentDate = new Date();
  medicalClaimPaymentForm!: FormGroup;
  dateReconciledValidator: boolean = false;
  datePaymentSentValidator: boolean = false;
  paymentDateIsGreaterThanReconciledDate: boolean = true;
  endDateMin!: Date;
  tAreaCessationCharactersCount!: number;
  tAreaCessationCounter!: string;
  tAreaCessationMaxLength = 100;
  paymentPanel!:PaymentPanel;
  @Input() vendorId:any;
  @Input() batchId:any ;
  @Input() paymentPanelData:any;
  @Output() closePaymentDetailFormClickedEvent = new EventEmitter();

  constructor(private formBuilder: FormBuilder, public intl: IntlService,
    private paymentFacade:PaymentsFacade){
    
  }
 
  ngOnInit():void{
    this.buildPremiumPaymentForm();
    this.setPaymentPanelFormData();
    this.paymentPanelData.subscribe((response:PaymentPanel)=>{
      this.paymentPanel = response;
      //healthInsurancePolicy.insuranceStartDate != null ? new Date(healthInsurancePolicy.insuranceStartDate) : null
      this.medicalClaimPaymentForm.controls['datePaymentSent'].setValue(this.paymentPanel.datePaymentSent != null?new Date(this.paymentPanel.datePaymentSent):null);
      this.medicalClaimPaymentForm.controls['datePaymentReconciled'].setValue(this.paymentPanel.datePaymentReconciled != null? new Date(this.paymentPanel.datePaymentReconciled):null);
      this.medicalClaimPaymentForm.controls['paymentAmount'].setValue(this.paymentPanel.paymentAmount);
      this.medicalClaimPaymentForm.controls['warrantNumber'].setValue(this.paymentPanel.warrantNumber);
      this.medicalClaimPaymentForm.controls['note'].setValue(this.paymentPanel.note);

    })
  }
  closePaymentDetailClicked() {
    this.closePaymentDetailFormClickedEvent.emit(true);
  }
  changeMinDate() {
    this.endDateMin = this.medicalClaimPaymentForm.controls['datePaymentReconciled'].value;
  }

  setPaymentPanelFormData(){

  }
  dateValidate(event: Event, type: any) {
    const todayDate = new Date();

    switch (type.toUpperCase()) {
      case "RECONCILED":
        this.dateReconciledValidator = false;
        const datePaymentReconciled = this.medicalClaimPaymentForm.controls['datePaymentReconciled'].value;
        if (datePaymentReconciled > todayDate) {
          this.dateReconciledValidator = true;
          this.medicalClaimPaymentForm.controls['datePaymentReconciled'].setErrors({ 'incorrect': true });
        }
        break;
      case "PAYMENT_SENT":
        this.datePaymentSentValidator = false;
        const datePaymentSent = this.medicalClaimPaymentForm.controls['datePaymentSent'].value;
        if (datePaymentSent > todayDate) {
          this.datePaymentSentValidator = true;
          this.medicalClaimPaymentForm.controls['datePaymentSent'].setErrors({ 'incorrect': true });
        }
        break

    }
  }
  startDateOnChange() {
    if (this.medicalClaimPaymentForm.controls['datePaymentSent'].value !== null) {
      this.endDateOnChange();
    }
  }
  endDateOnChange() {
    this.paymentDateIsGreaterThanReconciledDate = true;
    if (this.medicalClaimPaymentForm.controls['datePaymentReconciled'].value === null) {
      this.medicalClaimPaymentForm.controls['datePaymentReconciled'].markAllAsTouched();
      this.medicalClaimPaymentForm.controls['datePaymentReconciled'].setValidators([Validators.required]);
      this.medicalClaimPaymentForm.controls['datePaymentReconciled'].updateValueAndValidity();
      this.medicalClaimPaymentForm.controls['datePaymentSent'].setErrors({ 'incorrect': true });
      this.paymentDateIsGreaterThanReconciledDate = false;
    }
    else if (this.medicalClaimPaymentForm.controls['datePaymentSent'].value !== null) {
      const startDate = this.intl.parseDate(
        Intl.DateTimeFormat('en-US').format(
          this.medicalClaimPaymentForm.controls['datePaymentReconciled'].value
        )
      );
      const endDate = this.intl.parseDate(
        Intl.DateTimeFormat('en-US').format(
          this.medicalClaimPaymentForm.controls['datePaymentSent'].value
        )
      );

      if (startDate > endDate) {
        this.medicalClaimPaymentForm.controls['datePaymentSent'].setErrors({ 'incorrect': true });
        this.paymentDateIsGreaterThanReconciledDate = false;
      }
      else {
        this.paymentDateIsGreaterThanReconciledDate = true;
        this.medicalClaimPaymentForm.controls['datePaymentSent'].setErrors(null);
        this.endDateMin = this.medicalClaimPaymentForm.controls['datePaymentReconciled'].value;
      }
    }
  }


  validateModel(){
    this.medicalClaimPaymentForm.markAllAsTouched();
    this.medicalClaimPaymentForm.controls['datePaymentReconciled'].setValidators([
      Validators.required,
    ]);
    this.medicalClaimPaymentForm.controls['datePaymentReconciled'].updateValueAndValidity();
    this.medicalClaimPaymentForm.controls['datePaymentSent'].setValidators([
      Validators.required,
    ]);
    this.medicalClaimPaymentForm.controls['datePaymentSent'].updateValueAndValidity();
    this.medicalClaimPaymentForm.controls['paymentAmount'].setValidators([
      Validators.required,
    ]);
    this.medicalClaimPaymentForm.controls['paymentAmount'].updateValueAndValidity();
    this.medicalClaimPaymentForm.controls['warrantNumber'].setValidators([
      Validators.required,
    ]);
    this.medicalClaimPaymentForm.controls['warrantNumber'].updateValueAndValidity();
  }

  populatePaymentPanelModel(){

    this.paymentPanel.datePaymentReconciled = 
    this.intl.parseDate(
      Intl.DateTimeFormat('en-US').format(
        this.medicalClaimPaymentForm.controls['datePaymentReconciled'].value
      )
    );
    this.paymentPanel.datePaymentSent = 
    this.intl.parseDate(
      Intl.DateTimeFormat('en-US').format(
        this.medicalClaimPaymentForm.controls['datePaymentSent'].value
      )
    );
    this.paymentPanel.paymentAmount = this.medicalClaimPaymentForm.controls['paymentAmount'].value
    this.paymentPanel.warrantNumber = this.medicalClaimPaymentForm.controls['warrantNumber'].value
    this.paymentPanel.note = this.medicalClaimPaymentForm.controls['note'].value

  }

  buildPremiumPaymentForm(){
    this.medicalClaimPaymentForm = this.formBuilder.group({
      datePaymentReconciled: [null],
      datePaymentSent: [null],
      paymentAmount: [null],
      warrantNumber: [null],      
      note: [null],

    });
    
  }
  save(){
    this.paymentFacade.showLoader();
    this.validateModel();
    if(this.medicalClaimPaymentForm.valid){
      this.populatePaymentPanelModel();
      this.paymentFacade.updatePaymentPanel(this.vendorId,this.batchId, this.paymentPanel).subscribe({
        next: (data: any) => {         
          this.paymentFacade.showHideSnackBar(SnackBarNotificationType.SUCCESS, 'Payment panel updated successfully.');
          this.paymentFacade.hideLoader();
        },
        error: (err) => {       
          this.paymentFacade.hideLoader();
          this.paymentFacade.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        }
      });

    }
  }

  onTAreaCessationValueChange(event: any): void {
    this.tAreaCessationCharactersCount = event.length;
    this.tAreaCessationCounter = `${this.tAreaCessationCharactersCount}/${this.tAreaCessationMaxLength}`;
  }


}
