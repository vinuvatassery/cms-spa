/** Angular **/
import { Component, ChangeDetectionStrategy, Input, ChangeDetectorRef, OnInit } from '@angular/core';
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
  /** Public properties **/
  rdoVerificationMethod!: string;
  verificationMethod$ = this.lovFacade.verificationMethod$;
  OptionControllerName:any ='providerOption';

  constructor(private readonly cd: ChangeDetectorRef, private verificationFacade: VerificationFacade,private readonly lovFacade: LovFacade){

  }
  ngOnInit(): void {
    this.lovFacade.getVerificationMethodLovs();
    this.hivVerificationForm?.get('providerOption')?.valueChanges.subscribe(val => {
      this.cd.detectChanges();
    });
   
  }
  providerChange(event:any){
    this.verificationFacade.providerValueChange(this.hivVerificationForm.controls["providerOption"].value);
    this.cd.detectChanges();
  }
}
