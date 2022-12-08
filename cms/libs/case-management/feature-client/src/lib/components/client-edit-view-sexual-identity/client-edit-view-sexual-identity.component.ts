import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { LovDataService, LovType, LovFacade } from '@cms/system-config/domain';

@Component({
  selector: 'case-management-client-edit-view-sexual-identity',
  templateUrl: './client-edit-view-sexual-identity.component.html',
  styleUrls: ['./client-edit-view-sexual-identity.component.scss'],
})
export class ClientEditViewSexualIdentityComponent implements OnInit {
  @Input() appInfoForm: FormGroup;

  SexulaIdentityLovs$ = this.lovFacade.lovs$;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  ControlPrefix = 'SexulaIdentity';
  DescriptionField = 'SexulaIdentityDescription';
  constructor(
    private readonly lovDataService: LovDataService,
    private readonly lovFacade: LovFacade,
    private formBuilder: FormBuilder
  ) {
    this.appInfoForm = this.formBuilder.group({ SexulaIdentity: [''] });
  }
  SexulaIdentities: any = [];

  ngOnInit(): void {
    this.lovFacade.getLovs(LovType.SexulaIdentity);
    this.loadSexulaIdentities();
    // this.lovDataService
    //   .getLovsbyType(LovType.SexulaIdentity)
    //   .subscribe((data) => {
    //     if (!Array.isArray(data)) return;
    //     data.forEach((element) => {
    //       this.appInfoForm.addControl(
    //         this.ControlPrefix + element.lovCode,
    //         new FormControl('')
    //       );
    //     });
    //     this.appInfoForm.addControl(this.DescriptionField, new FormControl(''));
    //     this.appInfoForm.addControl(
    //       'SexulaIdentityGroup',
    //       new FormControl('', [Validators.required])
    //     );
    //     this.SexulaIdentities = data;
    //   });
  }
  private loadSexulaIdentities() {
    this.SexulaIdentityLovs$.subscribe((data) => {
      if (!Array.isArray(data)) return;
      data.forEach((element) => {
        this.appInfoForm.addControl(
          this.ControlPrefix + element.lovCode,
          new FormControl('')
        );
      });
      this.appInfoForm.addControl(this.DescriptionField, new FormControl(''));
      this.appInfoForm.addControl(
        'SexulaIdentityGroup',
        new FormControl('', [Validators.required])
      );
      this.SexulaIdentities = data;
    });
  }

  onCheckChange(event: any, lovCode: string) {
    if (event.target.checked) {
      this.appInfoForm.controls['SexulaIdentityGroup'].setValue(lovCode);
      if (lovCode === 'NOT_LISTED') {
        this.appInfoForm.controls[this.DescriptionField].setValidators(
          Validators.required
        );
        this.appInfoForm.controls[
          this.DescriptionField
        ].updateValueAndValidity();
      }
    } else {
      this.appInfoForm.controls['SexulaIdentityGroup'].setValue('');

      if (lovCode === 'NOT_LISTED') {
        this.appInfoForm.controls[this.DescriptionField].removeValidators(
          Validators.required
        );
        this.appInfoForm.controls[
          this.DescriptionField
        ].updateValueAndValidity();
      }
    }
  }
}
