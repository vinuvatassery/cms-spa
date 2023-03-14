/** Angular **/
import { Component, ChangeDetectionStrategy, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
/** External libraries **/
import { UIFormStyle, UploadFileRistrictionOptions } from '@cms/shared/ui-tpa';
import { IntlService } from '@progress/kendo-angular-intl';
/** Internal Libraries **/
import { VerificationFacade, ClientHivVerification, VerificationStatusCode, VerificationTypeCode } from '@cms/case-management/domain';
import { SnackBarNotificationType} from '@cms/shared/util-core';


@Component({
  selector: 'case-management-hiv-verification-request',
  templateUrl: './hiv-verification-request.component.html',
  styleUrls: ['./hiv-verification-request.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HivVerificationRequestComponent implements OnInit {
  /** Input properties **/
  //@Input() data!: string;
  @Input() hivVerificationForm!: FormGroup;
  @Input() clientId!: number;
  public uploadRemoveUrl = 'removeUrl';
  /** Public properties **/
  providerValue$ = this.verificationFacade.providerValue$;
  providerOption:any;
  isSendRequest = false;
  isResendRequest = false;
  isEmailFieldVisible=false;
  clientHivVerification:ClientHivVerification = new ClientHivVerification;
  public formUiStyle : UIFormStyle = new UIFormStyle();
  public uploadFileRestrictions: UploadFileRistrictionOptions =
  new UploadFileRistrictionOptions();

  constructor( private verificationFacade: VerificationFacade,
    private readonly cdr: ChangeDetectorRef,
    private intl: IntlService){}
  /** Internal event methods **/
  ngOnInit(): void {
    this.providerValue$.subscribe(data=>{
      this.isSendRequest = false;
      this.providerOption = data;
      if(data==='HEALTHCARE_PROVIDER'){
        this.isEmailFieldVisible = true;
      }
      else{
        this.isEmailFieldVisible = false;
      }
      this.cdr.detectChanges();
    });
   
  }
  onSendRequestClicked() { 
    if (this.providerOption === 'HEALTHCARE_PROVIDER') {
      this.hivVerificationForm.markAllAsTouched();
      this.hivVerificationForm.controls["providerEmailAddress"].setValidators([Validators.required, Validators.email])
      this.hivVerificationForm.controls["providerEmailAddress"].updateValueAndValidity();
    }
    if(this.hivVerificationForm.controls["providerEmailAddress"].valid){

      this.isSendRequest = true;
      this.populateModel();
      this.save();
    }
  }

  onResendRequestClicked() {
    this.isEmailFieldVisible = true;
    this.isSendRequest = false;
    this.isResendRequest = true;
    this.verificationFacade.providerValueChange(this.hivVerificationForm.controls["providerOption"].value);
  }
  private populateModel(){
    this.clientHivVerification.clientId = this.clientId;
    this.clientHivVerification.verificationStatusCode = VerificationStatusCode.Pending;
    this.clientHivVerification.verificationToEmail =  this.hivVerificationForm.controls["providerEmailAddress"].value;
    this.clientHivVerification.verificationMethodCode = this.hivVerificationForm.controls["providerOption"].value;
    this.clientHivVerification.verificationTypeCode = VerificationTypeCode.HivVerificationForm;
    this.clientHivVerification.verificationStatusDate= new Date();

  }
  private save(){
    this.verificationFacade.showLoader();
    this.verificationFacade.save( this.clientHivVerification).subscribe({
      next:(data)=>{
        this.verificationFacade.showHideSnackBar(
          SnackBarNotificationType.SUCCESS,
          'Client hiv verification inserted successfully.'
        );
        this.verificationFacade.hideLoader();
      },
      error:(error)=>{
        if (error) {
          this.verificationFacade.showHideSnackBar(
            SnackBarNotificationType.ERROR,
            error
          );
          this.verificationFacade.hideLoader();
        }
      }
    });
  }
}
