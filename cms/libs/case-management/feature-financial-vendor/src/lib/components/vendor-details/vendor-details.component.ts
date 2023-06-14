import { ChangeDetectionStrategy, Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FinancialVendorFacade, FinancialVendorDataService } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { SnackBarNotificationType } from '@cms/shared/util-core';
import { Validators, FormGroup, FormControl, } from '@angular/forms';

@Component({
  selector: 'cms-vendor-details',
  templateUrl: './vendor-details.component.html',
  styleUrls: ['./vendor-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VendorDetailsComponent implements OnInit {

  @Input() vendorDetails!: any;
  @Input() editVendorInfo: boolean = false;
  @Input() profileInfoTitle!: string;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter();

  SpecialHandlingLength = 100;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  public vendorDetailForm: FormGroup = new FormGroup({
    vendorName: new FormControl('', []),
    tin: new FormControl('', []),
    npiNbr: new FormControl('', []),
    preferredFlag: new FormControl('', [])
  });
  constructor(
    private financialVendorFacade: FinancialVendorFacade,
    private financialVendorDataService: FinancialVendorDataService
  ) {
  }

  ngOnInit() {
    this.setVendorDetailFormValues();
  }

  updateVendorInfo() {
    this.validateForm();
    if (this.vendorDetailForm.valid) {
      this.financialVendorFacade.showLoader();
      let vendorValues = this.vendorDetailForm.value;
      vendorValues['vendorId'] = this.vendorDetails.vendorId;
      if (vendorValues['preferredFlag'] != null) {
        vendorValues['preferredFlag'] = vendorValues['preferredFlag'] ? 'Y' : 'N';
      }
      this.financialVendorDataService.updateVendorDetails(vendorValues).subscribe((resp: any) => {
        if (resp) {
          this.financialVendorFacade.showHideSnackBar(SnackBarNotificationType.SUCCESS, this.profileInfoTitle.split(' ')[0] + ' information updated.');
          this.closeModal.emit(true);
        }
        else {
          this.financialVendorFacade.showHideSnackBar(SnackBarNotificationType.WARNING, this.profileInfoTitle.split(' ')[0] + ' information not updated.');
        }
        this.financialVendorFacade.hideLoader();
      },
        (error: any) => {
          this.financialVendorFacade.hideLoader();
          this.financialVendorFacade.showHideSnackBar(SnackBarNotificationType.ERROR, error);
        });
    }
  }

  validateForm() {
    this.vendorDetailForm.markAllAsTouched();
    this.vendorDetailForm.controls['vendorName'].setValidators([
      Validators.required,
    ]);
    this.vendorDetailForm.controls['vendorName'].updateValueAndValidity();
  }

  onCancelClick() {
    this.closeModal.emit(false);
  }

  setVendorDetailFormValues() {
    this.vendorDetailForm.controls['vendorName'].setValue(this.vendorDetails.vendorName);
    this.vendorDetailForm.controls['tin'].setValue(this.vendorDetails.tin);
    this.vendorDetailForm.controls['npiNbr'].setValue(this.vendorDetails.npiNbr);
    if (this.vendorDetails.preferredFlag != null) {
      let flag = this.vendorDetails.preferredFlag == 'Y' ? true : false
      this.vendorDetailForm.controls['preferredFlag'].setValue(flag);
    }
    else {
      this.vendorDetailForm.controls['preferredFlag'].setValue(this.vendorDetails.preferredFlag);
    }
  }

}
