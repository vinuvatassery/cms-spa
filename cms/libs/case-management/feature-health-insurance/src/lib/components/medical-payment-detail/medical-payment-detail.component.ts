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
import { FormGroup, FormBuilder, Validators, FormArray,  FormControl } from '@angular/forms';
import { UIFormStyle, UploadFileRistrictionOptions } from '@cms/shared/ui-tpa';
@Component({
  selector: 'case-management-medical-payment-detail',
  templateUrl: './medical-payment-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalPaymentDetailComponent {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  isHealthInsuranceTab = true;
  isPaymentAddForm = true;
  // @Input() medicalPaymentForm: FormGroup;
 
  public medicalPaymentForm: FormGroup = new FormGroup({
    serviceProviderName: new FormControl('', []),
    serviceDescription: new FormControl('', []),
    paymentAmount: new FormControl('', []),
    type: new FormControl('', []),
    reversal: new FormControl('', []),
    coverageStartDate: new FormControl('', []),
    coverageEndDate: new FormControl('', []),
    entryDate: new FormControl('', []),
    checkMailDate: new FormControl('', []),
    comment: new FormControl('', []),
  });

    // constructor
    constructor( ) {}
  
    /** Lifecycle hooks **/
    ngOnInit(): void {
      this.medicalPaymentForm = new FormGroup({
        serviceProviderName: new FormControl('', []),
        serviceDescription: new FormControl('', []),
        paymentAmount: new FormControl('', []),
        type: new FormControl('', []),
        reversal: new FormControl('', []),
        coverageStartDate: new FormControl('', []),
        coverageEndDate: new FormControl('', []),
        entryDate: new FormControl('', []),
        checkMailDate: new FormControl('', []),
        comment: new FormControl('', []),
      });
    }
    savePaymentDetails(){
      this.medicalPaymentForm.markAllAsTouched();
      this.medicalPaymentForm.controls['serviceProviderName'].setValidators([  Validators.required,  ]);
      this.medicalPaymentForm.controls['serviceProviderName'].setValidators([  Validators.required,  ]);
      this.medicalPaymentForm.controls['paymentAmount'].setValidators([  Validators.required,  ]);
      this.medicalPaymentForm.controls['type'].setValidators([  Validators.required,  ]);
      this.medicalPaymentForm.controls['reversal'].setValidators([  Validators.required,  ]);
      this.medicalPaymentForm.controls['coverageStartDate'].setValidators([  Validators.required,  ]);
      this.medicalPaymentForm.controls['coverageEndDate'].setValidators([  Validators.required,  ]);
      this.medicalPaymentForm.controls['entryDate'].setValidators([  Validators.required,  ]);
      this.medicalPaymentForm.controls['serviceDescription'].setValidators([  Validators.required,  ]);
      this.medicalPaymentForm.controls['checkMailDate'].setValidators([  Validators.required,  ]);
      this.medicalPaymentForm.controls['comment'].setValidators([  Validators.required,  ]);

      this.medicalPaymentForm.controls['serviceProviderName'].updateValueAndValidity();
      this.medicalPaymentForm.controls['serviceProviderName'].updateValueAndValidity();
      this.medicalPaymentForm.controls['paymentAmount'].updateValueAndValidity();
      this.medicalPaymentForm.controls['type'].updateValueAndValidity();
      this.medicalPaymentForm.controls['reversal'].updateValueAndValidity();
      this.medicalPaymentForm.controls['coverageStartDate'].updateValueAndValidity();
      this.medicalPaymentForm.controls['coverageEndDate'].updateValueAndValidity();
      this.medicalPaymentForm.controls['entryDate'].updateValueAndValidity();
      this.medicalPaymentForm.controls['serviceDescription'].updateValueAndValidity();
      this.medicalPaymentForm.controls['checkMailDate'].updateValueAndValidity();
      this.medicalPaymentForm.controls['comment'].updateValueAndValidity();
      
 
            if (this.medicalPaymentForm.valid) {
              alert("success");
              console.log("teaette",this.medicalPaymentForm);
            } else{
              alert("fail")
            }
    }
}
