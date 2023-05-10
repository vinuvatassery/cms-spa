/** Angular **/
import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';

/** Facades **/
import {
  ClientDocumentFacade,
  PaymentRequest,
  HealthInsurancePolicyFacade
} from '@cms/case-management/domain';
import { UIFormStyle, UploadFileRistrictionOptions } from '@cms/shared/ui-tpa';
import { Lov, LovFacade, LovType } from '@cms/system-config/domain';
import { Subscription } from 'rxjs';
import { SnackBarNotificationType, ConfigurationProvider, LoggingService, NotificationSnackbarService } from '@cms/shared/util-core';
import { IntlService } from '@progress/kendo-angular-intl';
@Component({
  selector: 'case-management-medical-premium-payment-detail',
  templateUrl: './medical-premium-payment-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalPremiumPaymentDetailComponent {
  public formUiStyle: UIFormStyle = new UIFormStyle(); 
  isPremiumPaymentAddForm = true;
  @Input() premiumPaymentForm: FormGroup; 
  @Input() caseEligibilityId: any;
  @Input() clientId:any;
  @Input() tabStatus:any;
  paymentRequest !: PaymentRequest;
  paymentRequestType$= this.lovFacade.premiumPaymentType$;
  paymentReversal$= this.lovFacade.premiumPaymentReversal$;
    /** Constructor **/
    constructor(
      private formBuilder: FormBuilder,
      private lovFacade: LovFacade,
      private changeDetector: ChangeDetectorRef,
      public intl: IntlService,
      private configurationProvider: ConfigurationProvider,
      public readonly clientDocumentFacade: ClientDocumentFacade,
      private readonly loggingService: LoggingService,
      private readonly snackbarService: NotificationSnackbarService,
      private insurancePolicyFacade: HealthInsurancePolicyFacade,
    ) {
      this.premiumPaymentForm = this.formBuilder.group({});
    }

    
    savePaymentDetailsClicked(){
      this.validateForm(); 
      if (this.premiumPaymentForm.valid) {
        this.populatePaymentRequest();
        this.insurancePolicyFacade.savePaymentRequest(this.paymentRequest).subscribe({
          next: () => {                       
            
          },
          error: (error: any) => {
            //this.insurancePolicyFacade.showHideSnackBar(SnackBarNotificationType.ERROR, error)
          }
        })
      }
    };
    resetForm() {
      this.premiumPaymentForm.reset();
      this.premiumPaymentForm.updateValueAndValidity();
    }
  
    validateForm(){
      this.premiumPaymentForm.markAllAsTouched();
      this.premiumPaymentForm.controls['serviceProviderName'].setValidators([  Validators.required,  ]); 
      this.premiumPaymentForm.controls['premiumAmount'].setValidators([  Validators.required,  ]);
      this.premiumPaymentForm.controls['type'].setValidators([  Validators.required,  ]);
      this.premiumPaymentForm.controls['reversal'].setValidators([  Validators.required,  ]);
      this.premiumPaymentForm.controls['coverageStartDate'].setValidators([  Validators.required,  ]);
      this.premiumPaymentForm.controls['coverageEndDate'].setValidators([  Validators.required,  ]);
      this.premiumPaymentForm.controls['entryDate'].setValidators([  Validators.required,  ]);
      this.premiumPaymentForm.controls['serviceDescription'].setValidators([  Validators.required,  ]);
      //this.premiumPaymentForm.controls['checkMailDate'].setValidators([  Validators.required,  ]);
      this.premiumPaymentForm.controls['comment'].setValidators([  Validators.required,  ]);

      this.premiumPaymentForm.controls['serviceProviderName'].updateValueAndValidity(); 
      this.premiumPaymentForm.controls['premiumAmount'].updateValueAndValidity();
      this.premiumPaymentForm.controls['type'].updateValueAndValidity();
      this.premiumPaymentForm.controls['reversal'].updateValueAndValidity();
      this.premiumPaymentForm.controls['coverageStartDate'].updateValueAndValidity();
      this.premiumPaymentForm.controls['coverageEndDate'].updateValueAndValidity();
      this.premiumPaymentForm.controls['entryDate'].updateValueAndValidity();
      this.premiumPaymentForm.controls['serviceDescription'].updateValueAndValidity();
      //this.premiumPaymentForm.controls['checkMailDate'].updateValueAndValidity();
      this.premiumPaymentForm.controls['comment'].updateValueAndValidity();
    }
     populatePaymentRequest(){
      this.paymentRequest = new PaymentRequest()
      this.paymentRequest.clientId= this.clientId;
      this.paymentRequest.paymentTypeCode =  this.premiumPaymentForm.controls['type'].value;
      this.paymentRequest.amountRequested = this.premiumPaymentForm.controls['premiumAmount'].value;
     }
    loadPremiumPaymentDetails(){
    // this.bindValues(data);
    }

    bindValues(premiumPaymentDetails: any) {
      this.premiumPaymentForm.controls['serviceProviderName'].setValue(premiumPaymentDetails.serviceProviderName);
      this.premiumPaymentForm.controls['premiumAmount'].setValue(premiumPaymentDetails.paymentAmount); 
      this.premiumPaymentForm.controls['type'].setValue(premiumPaymentDetails.type); 
      this.premiumPaymentForm.controls['reversal'].setValue(premiumPaymentDetails.reversal); 
      this.premiumPaymentForm.controls['coverageStartDate'].setValue(premiumPaymentDetails.coverageStartDate != null ? new Date(premiumPaymentDetails.coverageStartDate) : null);
      this.premiumPaymentForm.controls['coverageEndDate'].setValue(premiumPaymentDetails.coverageEndDate != null ? new Date(premiumPaymentDetails.coverageEndDate) : null  );
      this.premiumPaymentForm.controls['entryDate'].setValue(  premiumPaymentDetails.entryDate != null ? new Date(premiumPaymentDetails.entryDate) : null );
      this.premiumPaymentForm.controls['serviceDescription'].setValue(premiumPaymentDetails.serviceDescription);
      this.premiumPaymentForm.controls['checkMailDate'].setValue(premiumPaymentDetails.checkMailDate != null ? new Date(premiumPaymentDetails.checkMailDate) : null);
      this.premiumPaymentForm.controls['comment'].setValue(premiumPaymentDetails.comment);
    }
}
