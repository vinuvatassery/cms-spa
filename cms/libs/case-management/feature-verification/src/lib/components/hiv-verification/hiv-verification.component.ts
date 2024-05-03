/** Angular **/
import { Component, ChangeDetectionStrategy, Input, ChangeDetectorRef, OnInit,Output, EventEmitter, OnChanges, ElementRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
/** Internal Libraries **/
import { CompletionChecklist, VerificationFacade, WorkflowFacade } from '@cms/case-management/domain';
import { StatusFlag } from '@cms/shared/ui-common';
import { LovFacade } from '@cms/system-config/domain';
import { Subscription } from 'rxjs';

@Component({
  selector: 'case-management-hiv-verification',
  templateUrl: './hiv-verification.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HivVerificationComponent implements OnInit, OnChanges {

   /** Input properties **/
  @Input() hivVerificationForm!: FormGroup;
  @Input() clientId!: number;
  @Input() clientCaseId!: any;
  @Input() clientCaseEligibilityId!: any;
  @Input() healthCareProviderExists!: any;
  @Input() isCaseManagerExists!: any;
  @Input() providerEmail!: any;
  @Input() emailSentDate!: any;
  @Input() loginUserName!: any;
  @Input() isSendEmailFailed!: boolean;
  @Input() errorMessage!: any;
  @Input() isSendEmailClicked!: boolean;
  @Input() loginUserId!: any;
  @Output() onAttachmentConfirmationEvent = new EventEmitter();
  @Output() checkCaseManagerAndHealthCareProviderExists = new EventEmitter();

  /** Public properties **/
  rdoVerificationMethod!: string;
  verificationMethod$ = this.lovFacade.verificationMethod$;
  OptionControllerName:any ='providerOption';
  isHivVerificationRemovalConfirmationOpened : boolean = false;
  clientHivVerificationId!:string;
  removeHivVerification$ = this.verificationFacade.removeHivVerification$;
  private saveForLaterValidationSubscription !: Subscription;
  constructor(private readonly cd: ChangeDetectorRef,
    private verificationFacade: VerificationFacade,
    private readonly lovFacade: LovFacade,
    private readonly workflowFacade: WorkflowFacade,
    private elementRef: ElementRef){

  }
  ngOnInit(): void {
    this.lovFacade.getVerificationMethodLovs();
    this.hivVerificationForm?.get('providerOption')?.valueChanges.subscribe(val => {
      this.cd.detectChanges();
    });
    this.removeHivVerification$.subscribe(response=>{
      if(response && this.clientId!=0){
        this.verificationFacade.showAttachmentOptions.next(true);
        this.updateVerificationCount(false);
        this.onHivRemoveConfirmationClosed();
        this.cd.detectChanges();
      }
    });
    this.verificationFacade.showHideAttachment.next(true);
    this.addSaveForLaterValidationsSubscription();
  }

  ngOnChanges() {
    if (!this.isCaseManagerExists) {
      this.hivVerificationForm.controls["providerOption"].setValue("");
    }
  }

  providerChange(event:any){
    if(this.hivVerificationForm.controls["providerOption"].value=="UPLOAD_ATTACHMENT")
    {
      this.verificationFacade.showHideAttachment.next(true);
    }

    this.verificationFacade.providerValueChange(this.hivVerificationForm.controls["providerOption"].value);
    this.updateVerificationCount(true);
    this.cd.detectChanges();
  }

  onHivRemoveConfirmationClosed() {
    this.isHivVerificationRemovalConfirmationOpened = false;
  }
  onHivRemoveConfirmation(){
    this.verificationFacade.removeHivVerificationAttachment(this.clientHivVerificationId,this.clientId);
    this.hivVerificationForm.controls["providerOption"].setValue("");
    this.checkCaseManagerAndHealthCareProviderExists.emit(true);
    this.verificationFacade.showHideAttachment.next(false);
    this.cd.detectChanges();
    this.updateVerificationCount(false);
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
  private addSaveForLaterValidationsSubscription(): void {
    this.saveForLaterValidationSubscription = this.workflowFacade.saveForLaterValidationClicked$.subscribe((val) => {
      if (val) {
        this.workflowFacade.showSaveForLaterConfirmationPopup(true);
      }
    });
  }

  private updateVerificationCount(isCompleted: boolean) {
    const workFlowData: CompletionChecklist[] = [{
      dataPointName: 'verificationMethod',
      status: isCompleted ? StatusFlag.Yes : StatusFlag.No
    }];

    this.workflowFacade.updateChecklist(workFlowData);
  }
}
