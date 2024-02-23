import {
  Component,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  Input,
  OnInit,
  OnDestroy,
  ChangeDetectorRef
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaymentPanel,PremiumPaymentStatus} from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { ConfigurationProvider } from '@cms/shared/util-core';
import { IntlService } from '@progress/kendo-angular-intl';
import { Subscription } from 'rxjs';
@Component({
  selector: 'cms-financial-claims-payment-details-form',
  templateUrl: './financial-claims-payment-details-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
 export class FinancialClaimsPaymentDetailsFormComponent implements OnInit, OnDestroy {

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
  @Input() vendorAddressId:any;
  @Input() batchId:any ;
  @Input() paymentPanelDetails:any;
  @Output() closePaymentDetailFormClickedEvent = new EventEmitter();
  @Output()  updatePaymentPanel  = new EventEmitter<any>();

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

  closePaymentDetailClicked() {
    this.closePaymentDetailFormClickedEvent.emit(true);
  }
  changeMinDate() {
    this.endDateMin = this.medicalClaimPaymentForm.controls['datePaymentReconciled'].value;
  }

  paymentPanelLoadSubscription(){
      this.medicalClaimPaymentForm.controls['datePaymentSent'].setValue(this.paymentPanelDetails?.paymentSentDate != null?new Date(this.paymentPanelDetails.paymentSentDate):null);
      this.medicalClaimPaymentForm.controls['datePaymentReconciled'].setValue(this.paymentPanelDetails?.paymentReconciledDate != null? new Date(this.paymentPanelDetails.paymentReconciledDate):null);
      if(this.paymentPanelDetails?.amountPaid !== undefined && this.paymentPanelDetails?.amountPaid !== null){
        this.medicalClaimPaymentForm.controls['paymentAmount'].setValue(this.paymentPanelDetails?.amountPaid);
      }
      this.medicalClaimPaymentForm.controls['warrantNumber'].setValue(this.paymentPanelDetails?.checkNbr);
      if(this.paymentPanelDetails.notes !== undefined && this.paymentPanelDetails?.notes !== null){
        this.medicalClaimPaymentForm.controls['note'].setValue(this.paymentPanelDetails.notes);
      }

  }
  dateValidate(type: any) {
    const todayDate = new Date();

    switch (type.toUpperCase()) {
      case PremiumPaymentStatus.RECONCILED:
        this.dateReconciledValidator = false;
        const datePaymentReconciled = this.medicalClaimPaymentForm.controls['datePaymentReconciled'].value;
        if (datePaymentReconciled > todayDate) {
          this.dateReconciledValidator = true;
          this.medicalClaimPaymentForm.controls['datePaymentReconciled'].setErrors({ 'incorrect': true });
        }
        break;
        case PremiumPaymentStatus.PAYMENT_SENT:
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
        this.paymentDateIsGreaterThanReconciledDate = true;
      }
      else if(endDate > new Date()){
        this.medicalClaimPaymentForm.controls['datePaymentSent'].setErrors({ 'incorrect': true });
        this.datePaymentSentValidator = true;
      }
      else {
        this.paymentDateIsGreaterThanReconciledDate = false;
        this.medicalClaimPaymentForm.controls['datePaymentSent'].setErrors(null);
        this.endDateMin = this.medicalClaimPaymentForm.controls['datePaymentReconciled'].value;
      }
    }
  }


  validateModel(){
    if (this.medicalClaimPaymentForm.controls['datePaymentSent'].value === null) {
     this.paymentDateIsGreaterThanReconciledDate = false;
    }
    this.medicalClaimPaymentForm.markAllAsTouched();
    this.medicalClaimPaymentForm.controls['datePaymentReconciled'].setValidators([
      Validators.required,
    ]);
    this.medicalClaimPaymentForm.controls['datePaymentReconciled'].updateValueAndValidity();
    this.dateValidate(PremiumPaymentStatus.RECONCILED);
    this.medicalClaimPaymentForm.controls['datePaymentSent'].setValidators([
      Validators.required,
    ]);
    this.medicalClaimPaymentForm.controls['datePaymentSent'].updateValueAndValidity();
    this.dateValidate(PremiumPaymentStatus.PAYMENT_SENT);
    this.startDateOnChange();
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
    this.paymentPanel = new PaymentPanel();
    this.paymentPanel.CheckRequestId = this.paymentPanelDetails.checkRequestId;
    this.paymentPanel.PaymentRequestBatchId = this.paymentPanelDetails.paymentRequestBatchId;
    this.paymentPanel.PaymentRequestId = this.paymentPanelDetails.paymentRequestId;
    this.paymentPanel.paymentReconciledDate = this.intl.formatDate(this.medicalClaimPaymentForm.controls['datePaymentReconciled'].value, this.dateFormat);
    this.paymentPanel.paymentSentDate = this.intl.formatDate(this.medicalClaimPaymentForm.controls['datePaymentSent'].value, this.dateFormat);
    this.paymentPanel.amountPaid = this.medicalClaimPaymentForm.controls['paymentAmount'].value
    this.paymentPanel.checkNbr = this.medicalClaimPaymentForm.controls['warrantNumber'].value
    this.paymentPanel.notes = this.medicalClaimPaymentForm.controls['note'].value

  }

  buildPremiumPaymentForm(){
    this.medicalClaimPaymentForm = this.formBuilder.group({
      datePaymentReconciled: [null, [Validators.required]],
      datePaymentSent: [null, [Validators.required]],
      paymentAmount: [null],
      warrantNumber: [null],
      note: [null],

    });

  }
  isModalValid : any = true;
  save(){
    this.validateModel();
    if(this.medicalClaimPaymentForm.valid){
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
