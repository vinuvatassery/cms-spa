import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { StatusFlag } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { LovFacade } from '@cms/system-config/domain';

@Component({
  selector: 'case-management-medical-premium-detail-aptc',
  templateUrl: './medical-premium-detail-aptc.component.html',
  styleUrls: ['./medical-premium-detail-aptc.component.scss'],
})
export class MedicalPremiumDetailAPTCComponent implements OnInit {
  @Input() healthInsuranceForm: FormGroup;
  @Input() isViewContentEditable!: boolean;
  @Input() healthInsurancePolicy:any;
   test:boolean=true;
  aptcFlagValue: string = "";
  public formUiStyle: UIFormStyle = new UIFormStyle();
  constructor(
    public readonly lovFacade: LovFacade,
    private readonly formBuilder: FormBuilder
  ) {
    this.healthInsuranceForm = this.formBuilder.group({ aptcFlag: [''] });
  }

  ngOnInit(): void {
    this.lovFacade.getAptcLovs();
    this.setRadioSelection();
  }

  ngOnChanges() {
    this.setRadioSelection();
  }

  setRadioSelection(){
    if (this.healthInsuranceForm && this.healthInsurancePolicy) {
      let flagValue=this.healthInsuranceForm.controls["aptcFlag"].value;
      if(flagValue !== 'YES'){
        this.aptcFlagValue = this.healthInsurancePolicy.aptcNotTakingFlag;
      }
      else{
        this.aptcFlagValue = this.healthInsuranceForm.controls["aptcFlag"].value
      }
      
    }
    this.disableEnableRadio();
  }

  disableEnableRadio(){
    if(this.isViewContentEditable){
      this.healthInsuranceForm.controls["aptcFlag"].disable();
      this.healthInsuranceForm.controls["aptcMonthlyAmt"].disable();
    }
    else{
      this.healthInsuranceForm.controls["aptcFlag"].enable();
      this.healthInsuranceForm.controls["aptcMonthlyAmt"].enable();
    }
  }
}
