import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
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
  @Input() isEdit!: boolean;
  @Input() defaultValue: any = {};
  public formUiStyle: UIFormStyle = new UIFormStyle();
  metalLevellov$ = this.lovFacade.metalLevellov$;
  MetalLevels: any = [];
  constructor(
    private readonly lovFacade: LovFacade,
    private formBuilder: FormBuilder
  ) {
    this.healthInsuranceForm = this.formBuilder.group({});
  }

  ngOnInit(): void {
    this.lovFacade.getMetalLevelLovs();
    this.loadMetalLevelLov();
  }

  private loadMetalLevelLov() {
    this.metalLevellov$.subscribe((data: any) => {
      if (!Array.isArray(data)) return;

      this.MetalLevels = data;
      if (this.isEdit && data.length > 0) {
        this.healthInsuranceForm.controls['metalLevel'].setValue(
          this.defaultValue
        );
      }
    });
  }
}
