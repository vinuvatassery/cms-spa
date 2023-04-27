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
  HealthInsurancePolicyFacade,
  HealthInsurancePolicy,
  CarrierContactInfo,
  InsurancePlanFacade,
  StatusFlag,
  HealthInsurancePlan,
  DependentTypeCode,
  PriorityCode,
  InsuranceStatusType
} from '@cms/case-management/domain';
import { UIFormStyle, UploadFileRistrictionOptions } from '@cms/shared/ui-tpa';
import { Lov, LovFacade, LovType } from '@cms/system-config/domain';
import { Subscription } from 'rxjs';
import { SnackBarNotificationType, ConfigurationProvider, LoggingService, NotificationSnackbarService } from '@cms/shared/util-core';
import { IntlService } from '@progress/kendo-angular-intl';
@Component({
  selector: 'case-management-medical-payment-detail',
  templateUrl: './medical-payment-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalPaymentDetailComponent {
  public formUiStyle: UIFormStyle = new UIFormStyle(); 
  isPaymentAddForm = true;
  @Input() copayPaymentForm: FormGroup; 
  @Input() caseEligibilityId: any;
  @Input() clientId:any;
  @Input() tabStatus:any;

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
  ) {
    this.copayPaymentForm = this.formBuilder.group({});
  }
  
    /** Lifecycle hooks **/
 
    savePaymentDetailsClicked(){
      this.copayPaymentForm.markAllAsTouched();
      this.copayPaymentForm.controls['serviceProviderName'].setValidators([  Validators.required,  ]); 
      this.copayPaymentForm.controls['paymentAmount'].setValidators([  Validators.required,  ]);
      this.copayPaymentForm.controls['type'].setValidators([  Validators.required,  ]);
      this.copayPaymentForm.controls['reversal'].setValidators([  Validators.required,  ]);
      this.copayPaymentForm.controls['coverageStartDate'].setValidators([  Validators.required,  ]);
      this.copayPaymentForm.controls['coverageEndDate'].setValidators([  Validators.required,  ]);
      this.copayPaymentForm.controls['entryDate'].setValidators([  Validators.required,  ]);
      this.copayPaymentForm.controls['serviceDescription'].setValidators([  Validators.required,  ]);
      this.copayPaymentForm.controls['checkMailDate'].setValidators([  Validators.required,  ]);
      this.copayPaymentForm.controls['comment'].setValidators([  Validators.required,  ]);

      this.copayPaymentForm.controls['serviceProviderName'].updateValueAndValidity(); 
      this.copayPaymentForm.controls['paymentAmount'].updateValueAndValidity();
      this.copayPaymentForm.controls['type'].updateValueAndValidity();
      this.copayPaymentForm.controls['reversal'].updateValueAndValidity();
      this.copayPaymentForm.controls['coverageStartDate'].updateValueAndValidity();
      this.copayPaymentForm.controls['coverageEndDate'].updateValueAndValidity();
      this.copayPaymentForm.controls['entryDate'].updateValueAndValidity();
      this.copayPaymentForm.controls['serviceDescription'].updateValueAndValidity();
      this.copayPaymentForm.controls['checkMailDate'].updateValueAndValidity();
      this.copayPaymentForm.controls['comment'].updateValueAndValidity();
      
 
            if (this.copayPaymentForm.valid) {
              alert("success");
              console.log("teaette",this.copayPaymentForm);
            } else{
              alert("fail")
            }
    };
    resetForm() {
      this.copayPaymentForm.reset();
      this.copayPaymentForm.updateValueAndValidity();
    }
  

    loadCopayPaymentDetails(){
    // this.bindValues(data);
    }

    bindValues(copayPaymentDetails: any) {
      this.copayPaymentForm.controls['serviceProviderName'].setValue(copayPaymentDetails.serviceProviderName);
      this.copayPaymentForm.controls['paymentAmount'].setValue(copayPaymentDetails.paymentAmount); 
      this.copayPaymentForm.controls['type'].setValue(copayPaymentDetails.type); 
      this.copayPaymentForm.controls['reversal'].setValue(copayPaymentDetails.reversal); 
      this.copayPaymentForm.controls['coverageStartDate'].setValue(copayPaymentDetails.coverageStartDate != null ? new Date(copayPaymentDetails.coverageStartDate) : null);
      this.copayPaymentForm.controls['coverageEndDate'].setValue(copayPaymentDetails.coverageEndDate != null ? new Date(copayPaymentDetails.coverageEndDate) : null  );
      this.copayPaymentForm.controls['entryDate'].setValue(  copayPaymentDetails.entryDate != null ? new Date(copayPaymentDetails.entryDate) : null );
      this.copayPaymentForm.controls['serviceDescription'].setValue(copayPaymentDetails.serviceDescription);
      this.copayPaymentForm.controls['checkMailDate'].setValue(copayPaymentDetails.checkMailDate != null ? new Date(copayPaymentDetails.checkMailDate) : null);
      this.copayPaymentForm.controls['comment'].setValue(copayPaymentDetails.comment);
   
  
    }
}
