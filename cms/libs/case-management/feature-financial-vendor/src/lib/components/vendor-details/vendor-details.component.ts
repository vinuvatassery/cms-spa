import { ChangeDetectionStrategy, Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FinancialVendorFacade, FinancialVendorDataService } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { LoaderService, SnackBarNotificationType } from '@cms/shared/util-core';
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
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter();

  SpecialHandlingLength = 100;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  public vendorDetailForm: FormGroup = new FormGroup({
    vendorName: new FormControl('', []),
    tin: new FormControl('', []),
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
    this.financialVendorDataService.updateVendorDetails(this.vendorDetails).subscribe((resp: any) => {
      if (resp) {
        this.financialVendorFacade.showHideSnackBar(SnackBarNotificationType.SUCCESS, 'Vendor information updated.');
        this.closeModal.emit(true);
      }
      else {
        this.financialVendorFacade.showHideSnackBar(SnackBarNotificationType.WARNING, 'Vendor information not updated.');
      }
    },
      (error: any) => {
        this.financialVendorFacade.showHideSnackBar(SnackBarNotificationType.ERROR, error);
      });
  }

  onCancelClick() {
    this.closeModal.emit(true);
  }

  setVendorDetailFormValues() {
    this.vendorDetailForm.controls['vendorName'].setValue(this.vendorDetails.vendoName);
    this.vendorDetailForm.controls['tin'].setValue(this.vendorDetails.tin);
  }

}
