import {
  Component,
  ChangeDetectionStrategy,
  Output, 
  EventEmitter,
  Input,
  ChangeDetectorRef,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaymentPanel, PremiumPaymentStatus } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { ConfigurationProvider } from '@cms/shared/util-core';
import { IntlService } from '@progress/kendo-angular-intl';
import { Subscription } from 'rxjs';
@Component({
  selector: 'cms-financial-premiums-payment-details-form',
  templateUrl: './financial-premiums-payment-details-form.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialPremiumsPaymentDetailsFormComponent {  
  public formUiStyle: UIFormStyle = new UIFormStyle()

  @Input() paymentDetailsForm!: any;
  @Input() vendorAddressId:any;
  @Input() batchId:any ;
  @Input() paymentPanelDetails:any;
  @Output() closePaymentDetailFormClickedEvent = new EventEmitter();
  @Output()  updatePaymentPanel  = new EventEmitter<any>();


  isValidateForm!: boolean;
  premiumPaymentForm!: FormGroup;
  public currentDate = new Date();
  dateReconciledValidator: boolean = false;
  datePaymentSentValidator: boolean = false;
  paymentDateIsGreaterThanReconciledDate: boolean = true;
  endDateMin!: Date;
  tAreaCessationCharactersCount!: number;
  tAreaCessationCounter!: string;
  tAreaCessationMaxLength = 200;
  paymentPanel!: PaymentPanel;
  dateFormat = this.configurationProvider.appSettings.dateFormat;
  paymentPanelDataSubscription!: Subscription;

  constructor(private formBuilder: FormBuilder, public intl: IntlService,
    private configurationProvider: ConfigurationProvider,
    private readonly cd: ChangeDetectorRef){  
  }
 

  ngOnInit():void{
    this.buildPremiumPaymentForm();
    this.paymentPanelLoadSubscription();   
  }

  ngOnDestroy(): void {
    this.paymentPanelDataSubscription.unsubscribe();
  }

  changeMinDate() {
    this.endDateMin = this.premiumPaymentForm.controls['datePaymentReconciled'].value;
  }
  
  closePaymentDetailClicked() {
    this.closePaymentDetailFormClickedEvent.emit(true);
  }

  paymentPanelLoadSubscription(){
    this.premiumPaymentForm.controls['datePaymentSent'].setValue(this.paymentDetailsForm?.paymentSentDate != null?new Date(this.paymentDetailsForm.paymentSentDate):null);
    this.premiumPaymentForm.controls['datePaymentReconciled'].setValue(this.paymentDetailsForm?.paymentReconciledDate != null? new Date(this.paymentDetailsForm.paymentReconciledDate):null);
    if(this.paymentDetailsForm?.amountPaid !== undefined && this.paymentDetailsForm?.amountPaid !== null){
      this.premiumPaymentForm.controls['paymentAmount'].setValue(this.paymentDetailsForm?.amountPaid);
    }
    this.premiumPaymentForm.controls['warrantNumber'].setValue(this.paymentDetailsForm?.checkNbr);
    if(this.paymentDetailsForm.notes !== undefined && this.paymentDetailsForm?.notes !== null){
      this.premiumPaymentForm.controls['note'].setValue(this.paymentDetailsForm.notes);
    }
}
dateValidate(type: any) {
  const todayDate = new Date();

  switch (type.toUpperCase()) {
    case PremiumPaymentStatus.RECONCILED:
      this.dateReconciledValidator = false;
      const datePaymentReconciled = this.premiumPaymentForm.controls['datePaymentReconciled'].value;
      if (datePaymentReconciled > todayDate) {
        this.dateReconciledValidator = true;
        this.premiumPaymentForm.controls['datePaymentReconciled'].setErrors({ 'incorrect': true });
      }
      break;
    case PremiumPaymentStatus.PAYMENT_SENT:
      this.datePaymentSentValidator = false;
      const datePaymentSent = this.premiumPaymentForm.controls['datePaymentSent'].value;
      if (datePaymentSent > todayDate) {
        this.datePaymentSentValidator = true;
        this.premiumPaymentForm.controls['datePaymentSent'].setErrors({ 'incorrect': true });
      }
      break

  }
}
startDateOnChange() {
  if (this.premiumPaymentForm.controls['datePaymentSent'].value !== null) {
    this.endDateOnChange();
  }
}
endDateOnChange() {
  this.premiumPaymentForm.markAllAsTouched();
  this.paymentDateIsGreaterThanReconciledDate = true;
  if (this.premiumPaymentForm.controls['datePaymentReconciled'].value === null) {
    this.premiumPaymentForm.controls['datePaymentReconciled'].markAllAsTouched();
    this.premiumPaymentForm.controls['datePaymentReconciled'].setValidators([Validators.required]);
    this.premiumPaymentForm.controls['datePaymentReconciled'].updateValueAndValidity();
    this.premiumPaymentForm.controls['datePaymentSent'].setErrors({ 'incorrect': true });
    this.paymentDateIsGreaterThanReconciledDate = false;
  }
  else if (this.premiumPaymentForm.controls['datePaymentSent'].value !== null) {
    const startDate = this.intl.parseDate(
      Intl.DateTimeFormat('en-US').format(
        this.premiumPaymentForm.controls['datePaymentReconciled'].value
      )
    );
    const endDate = this.intl.parseDate(
      Intl.DateTimeFormat('en-US').format(
        this.premiumPaymentForm.controls['datePaymentSent'].value
      )
    );

    if (startDate > endDate) {
      this.premiumPaymentForm.controls['datePaymentSent'].setErrors({ 'incorrect': true });
      this.paymentDateIsGreaterThanReconciledDate = true;
    }
    else if(endDate > new Date()){
      this.premiumPaymentForm.controls['datePaymentSent'].setErrors({ 'incorrect': true });
      this.datePaymentSentValidator = true;
    }
    else {
      this.paymentDateIsGreaterThanReconciledDate = false;
      this.premiumPaymentForm.controls['datePaymentSent'].setErrors(null);
      this.endDateMin = this.premiumPaymentForm.controls['datePaymentReconciled'].value;
    }
  }
}


validateModel(){
  if (this.premiumPaymentForm.controls['datePaymentSent'].value === null) {
   this.paymentDateIsGreaterThanReconciledDate = false;
  }
  this.premiumPaymentForm.markAllAsTouched();
  this.premiumPaymentForm.controls['datePaymentReconciled'].setValidators([
    Validators.required,
  ]);
  this.premiumPaymentForm.controls['datePaymentReconciled'].updateValueAndValidity();
  this.dateValidate(PremiumPaymentStatus.RECONCILED);
  this.premiumPaymentForm.controls['datePaymentSent'].setValidators([
    Validators.required,
  ]);
  this.premiumPaymentForm.controls['datePaymentSent'].updateValueAndValidity();
  this.dateValidate(PremiumPaymentStatus.PAYMENT_SENT);
  this.startDateOnChange();
  this.premiumPaymentForm.controls['paymentAmount'].setValidators([
    Validators.required,
  ]);
  this.premiumPaymentForm.controls['paymentAmount'].updateValueAndValidity();
  this.premiumPaymentForm.controls['warrantNumber'].setValidators([
    Validators.required,
  ]);
  this.premiumPaymentForm.controls['warrantNumber'].updateValueAndValidity();
  if (this.premiumPaymentForm.controls['datePaymentReconciled'].value === null || 
      this.premiumPaymentForm.controls['datePaymentReconciled'].value > this.currentDate) {
    this.dateReconciledValidator = false;
    this.premiumPaymentForm.controls['datePaymentReconciled'].setErrors({'incorrect': true});
   }
   if (this.premiumPaymentForm.controls['datePaymentSent'].value === null || 
       this.premiumPaymentForm.controls['datePaymentSent'].value > this.currentDate) {
    this.datePaymentSentValidator = false;
    this.premiumPaymentForm.controls['datePaymentSent'].setErrors({'incorrect': true});
   }
}

populatePaymentPanelModel(){
  this.paymentPanel = new PaymentPanel();
  this.paymentPanel.CheckRequestId = this.paymentDetailsForm.checkRequestId;
  this.paymentPanel.PaymentRequestBatchId = this.paymentDetailsForm.paymentRequestBatchId;
  this.paymentPanel.PaymentRequestId = this.paymentDetailsForm.paymentRequestId;
  this.paymentPanel.paymentReconciledDate = this.intl.formatDate(this.premiumPaymentForm.controls['datePaymentReconciled'].value, this.dateFormat); 
  this.paymentPanel.paymentSentDate = this.intl.formatDate(this.premiumPaymentForm.controls['datePaymentSent'].value, this.dateFormat); 
  this.paymentPanel.amountPaid = this.premiumPaymentForm.controls['paymentAmount'].value
  this.paymentPanel.checkNbr = this.premiumPaymentForm.controls['warrantNumber'].value
  this.paymentPanel.notes = this.premiumPaymentForm.controls['note'].value

}

buildPremiumPaymentForm(){
  this.premiumPaymentForm = this.formBuilder.group({
    datePaymentReconciled: [null],
    datePaymentSent: [null],
    paymentAmount: [null],
    warrantNumber: [null],      
    note: [null],
  });
  
}
save(){   
  this.validateModel();
  if(this.premiumPaymentForm.valid){
    this.populatePaymentPanelModel();    
    this.closePaymentDetailFormClickedEvent.emit(true);
    this.updatePaymentPanel.emit(this.paymentPanel);
  }
}

onTAreaCessationValueChange(event: any): void {
  this.tAreaCessationCharactersCount = event.length;
  this.tAreaCessationCounter = `${this.tAreaCessationCharactersCount}/${this.tAreaCessationMaxLength}`;
}

}
