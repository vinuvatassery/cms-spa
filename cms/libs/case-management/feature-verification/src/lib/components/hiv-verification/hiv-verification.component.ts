/** Angular **/
import { Component, ChangeDetectionStrategy, Input, ChangeDetectorRef, OnInit,Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
/** Internal Libraries **/
import { VerificationFacade } from '@cms/case-management/domain';
import { LovFacade } from '@cms/system-config/domain';

@Component({
  selector: 'case-management-hiv-verification',
  templateUrl: './hiv-verification.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HivVerificationComponent implements OnInit {

   /** Input properties **/
  @Input() hivVerificationForm!: FormGroup;
  @Input() clientId!: number;
  @Input() clientCaseId!: any;
  @Input() clientCaseEligibilityId!: any;
  @Output() onAttachmentConfirmationEvent = new EventEmitter();

  /** Public properties **/
  rdoVerificationMethod!: string;
  verificationMethod$ = this.lovFacade.verificationMethod$;
  OptionControllerName:any ='providerOption';
  isHivVerificationRemovalConfirmationOpened : boolean = false;
  clientHivVerificationId!:string;
  removeHivVerification$ = this.verificationFacade.removeHivVerification$;

  constructor(private readonly cd: ChangeDetectorRef, private verificationFacade: VerificationFacade,private readonly lovFacade: LovFacade){

  }
  ngOnInit(): void {
    this.lovFacade.getVerificationMethodLovs();
    this.hivVerificationForm?.get('providerOption')?.valueChanges.subscribe(val => {
      this.cd.detectChanges();
    });
    this.removeHivVerification$.subscribe(response=>{
      if(response==true && this.clientId!=0){
        this.verificationFacade.showAttachmentOptions.next(true);
        this.onHivRemoveConfirmationClosed();
        this.cd.detectChanges();
      }
    });
  }
  providerChange(event:any){
    this.verificationFacade.providerValueChange(this.hivVerificationForm.controls["providerOption"].value);
    this.cd.detectChanges();
  }
  onHivRemoveConfirmationClosed() {
    this.isHivVerificationRemovalConfirmationOpened = false;
  }
  onHivRemoveConfirmation(){
    this.verificationFacade.removeHivVerificationAttachment(this.clientHivVerificationId,this.clientId);
  }
  onHivRemoveConfirmationOpen(clientHivVerificationId:string) {
    if(clientHivVerificationId && clientHivVerificationId != ""){
      this.isHivVerificationRemovalConfirmationOpened = true;
      this.clientHivVerificationId = clientHivVerificationId;
    }
  }
  onAttachmentConfirmation(event:any)
  {
    this.onAttachmentConfirmationEvent.emit(event);
  }
}
