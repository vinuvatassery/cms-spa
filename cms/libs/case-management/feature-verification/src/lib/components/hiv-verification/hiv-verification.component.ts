/** Angular **/
import { Component, ChangeDetectionStrategy, Input, ChangeDetectorRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { VerificationFacade } from '@cms/case-management/domain';

@Component({
  selector: 'case-management-hiv-verification',
  templateUrl: './hiv-verification.component.html',
  styleUrls: ['./hiv-verification.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HivVerificationComponent {

   /** Input properties **/
  @Input() hivVerificationForm!: FormGroup;
  /** Public properties **/
  rdoVerificationMethod!: string;


  constructor(private readonly cd: ChangeDetectorRef, private verificationFacade: VerificationFacade){

  }
  providerChange(event:any){
    this.verificationFacade.providerValueChange((event.target as HTMLInputElement).value);
    this.cd.detectChanges();
  }
}
