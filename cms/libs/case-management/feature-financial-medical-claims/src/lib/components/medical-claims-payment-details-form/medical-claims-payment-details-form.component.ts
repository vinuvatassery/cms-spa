import {
  Component,
  ChangeDetectionStrategy,
  Output, 
  EventEmitter,
  OnInit,
  Input,
  OnDestroy
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaymentPanel, PaymentsFacade } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { ConfigurationProvider, SnackBarNotificationType } from '@cms/shared/util-core';
import { IntlService } from '@progress/kendo-angular-intl';
import { Subscription } from 'rxjs';
@Component({
  selector: 'cms-medical-claims-payment-details-form',
  templateUrl: './medical-claims-payment-details-form.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalClaimsPaymentDetailsFormComponent implements OnInit, OnDestroy {  

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
  dateFormat = this.configurationProvider.appSettings.dateFormat;
  paymentPanelDataSubscription!: Subscription;
  @Input() vendorId:any;
  @Input() batchId:any;
  @Input() paymentPanelData:any;
  @Output() closePaymentDetailFormClickedEvent = new EventEmitter();
  @Output() loadPaymentPanelDataEvent = new EventEmitter();

  constructor(private formBuilder: FormBuilder, public intl: IntlService,
    private paymentFacade:PaymentsFacade, private configurationProvider: ConfigurationProvider){
    
  }
 
  ngOnInit():void{
    this.buildPremiumPaymentForm();
    this.paymentPanelLoadSubscription();   
  }

  ngOnDestroy(): void {
    this.paymentPanelDataSubscription.unsubscribe();
  }

  closePaymentDetailClicked() {
    this.closePaymentDetailFormClickedEvent.emit(true);
  }
  changeMinDate() {
    this.endDateMin = this.medicalClaimPaymentForm.controls['datePaymentReconciled'].value;
  }

  paymentPanelLoadSubscription(){
    this.paymentPanelDataSubscription = this.paymentPanelData.subscribe((response:PaymentPanel)=>{
      this.paymentPanel = response;
      this.medicalClaimPaymentForm.controls['datePaymentSent'].setValue(this.paymentPanel.sentDate != null?new Date(this.paymentPanel.sentDate):null);
      this.medicalClaimPaymentForm.controls['datePaymentReconciled'].setValue(this.paymentPanel.paymentStatusDate != null? new Date(this.paymentPanel.paymentStatusDate):null);
      this.medicalClaimPaymentForm.controls['paymentAmount'].setValue(this.paymentPanel.amountPaid);
      this.medicalClaimPaymentForm.controls['warrantNumber'].setValue(this.paymentPanel.checkNbr);
      this.medicalClaimPaymentForm.controls['note'].setValue(this.paymentPanel.notes);

    })
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
    this.medicalClaimPaymentForm.markAllAsTouched();
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
    this.paymentPanel.paymentStatusDate = this.intl.formatDate(this.medicalClaimPaymentForm.controls['datePaymentReconciled'].value, this.dateFormat); 
    this.paymentPanel.sentDate = this.intl.formatDate(this.medicalClaimPaymentForm.controls['datePaymentSent'].value, this.dateFormat); 
    this.paymentPanel.amountPaid = this.medicalClaimPaymentForm.controls['paymentAmount'].value
    this.paymentPanel.checkNbr = this.medicalClaimPaymentForm.controls['warrantNumber'].value
    this.paymentPanel.notes = this.medicalClaimPaymentForm.controls['note'].value

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
          if(data){       
          this.paymentFacade.showHideSnackBar(SnackBarNotificationType.SUCCESS, 'Payment panel updated successfully.');
          this.paymentFacade.hideLoader();
          this.loadPaymentPanelDataEvent.emit(true);
          }
          
        },
        error: (err) => {       
          this.paymentFacade.hideLoader();
          this.paymentFacade.showHideSnackBar(SnackBarNotificationType.ERROR, err);
          this.closePaymentDetailClicked();
        }
      });

    }
  }

  onTAreaCessationValueChange(event: any): void {
    this.tAreaCessationCharactersCount = event.length;
    this.tAreaCessationCounter = `${this.tAreaCessationCharactersCount}/${this.tAreaCessationMaxLength}`;
  }


}
