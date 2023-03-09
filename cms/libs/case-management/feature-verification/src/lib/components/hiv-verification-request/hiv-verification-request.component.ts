/** Angular **/
import { Component, ChangeDetectionStrategy, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { UIFormStyle, UploadFileRistrictionOptions } from '@cms/shared/ui-tpa';
import { VerificationFacade } from '@cms/case-management/domain';

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
  public uploadRemoveUrl = 'removeUrl';
  /** Public properties **/
  providerValue$ = this.verificationFacade.providerValue$;
  isSendRequest = false;
  isResendRequest = false;
  public formUiStyle : UIFormStyle = new UIFormStyle();
  public uploadFileRestrictions: UploadFileRistrictionOptions =
  new UploadFileRistrictionOptions();

  constructor( private verificationFacade: VerificationFacade){}
  /** Internal event methods **/
  ngOnInit(): void {
   
  }
  onSendRequestClicked() {
    this.isSendRequest = true;
  }

  onResendRequestClicked() {
    this.isResendRequest = true;
  }
}
