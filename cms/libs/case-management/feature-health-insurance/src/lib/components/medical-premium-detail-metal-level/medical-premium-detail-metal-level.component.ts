import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { LovFacade } from '@cms/system-config/domain';
@Component({
  selector: 'case-management-medical-premium-detail-metal-level',
  templateUrl: './medical-premium-detail-metal-level.component.html',
  styleUrls: ['./medical-premium-detail-metal-level.component.scss'],
})
export class MedicalPremiumDetailMetalLevelComponent implements OnInit {
  @Input() healthInsuranceForm: FormGroup;
  @Input() isViewContentEditable!: boolean;
  public formUiStyle : UIFormStyle = new UIFormStyle();
  metalLevellov$ = this.lovFacade.metalLevellov$;
  MetalLevels: any = [];
  constructor(
    private readonly lovFacade: LovFacade,
    private formBuilder: FormBuilder
  ) {
    this.healthInsuranceForm = this.formBuilder.group({ metalLevel: [''] });
  }

  ngOnInit(): void {
    this.lovFacade.getMetalLevelLovs();
    this.loadMetalLevelLov();
  }

  private loadMetalLevelLov() {
    this.metalLevellov$.subscribe((data:any) => {
      if (!Array.isArray(data)) return;

      this.MetalLevels = data;
    });
  }
}
