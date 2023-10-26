/** Angular **/
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef,
} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
/** Facades **/
import { Pharmacy, DrugPharmacyFacade, FinancialVendorFacade, ContactFacade } from '@cms/case-management/domain';
import { FinancialVendorTypeCode } from '@cms/shared/ui-common';
import { UIFormStyle } from '@cms/shared/ui-tpa'
import { SnackBarNotificationType } from '@cms/shared/util-core';
import { UserManagementFacade } from '@cms/system-config/domain';
import { Observable } from 'rxjs';
@Component({
  selector: 'case-management-pharmacy-detail',
  templateUrl: './pharmacy-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PharmacyDetailComponent implements OnInit {
  /** Input properties **/
  @Input() isEditPharmacy!: boolean;
  @Input() selectedPharmacy: any;
  @Input() pharmacySearchResult$!: Observable<Pharmacy>;
  @Input() searchLoaderVisibility$!: Observable<boolean>;
  @Input() isNewPharmacyAdded = false;
  /** Output properties  **/
  @Output() closePharmacyEvent = new EventEmitter();
  @Output() searchPharmacyEvent = new EventEmitter<string>();
  @Output() addPharmacyEvent = new EventEmitter<string>();
  @Output() editPharmacyEvent = new EventEmitter<string>();
  @Output() removePharmacyEvent = new EventEmitter<string>();
  @Output() setAsPrimaryEvent = new EventEmitter<any>();
  public formUiStyle: UIFormStyle = new UIFormStyle();
  /** Public properties **/
  isOpenNewPharmacyClicked = false;
  isSetAsPrimary = false;
  filteredSelectedPharmacy!: any;
  pharmacyForm!: FormGroup;
  selectedPharmacyForEdit!: string;
  selectedPharmacyId!: string | null;
  showSelectPharmacyRequired = false;
  btnDisabled = false;
  medicalProviderForm: FormGroup;
  ddlStates = this.contactFacade.ddlStates$;
  hasPharmacyCreateUpdatePermission:boolean = false;
  constructor(private drugPharmacyFacade: DrugPharmacyFacade, private readonly formBuilder: FormBuilder,
    private readonly cdr: ChangeDetectorRef, private userManagementFacade: UserManagementFacade,
    private financialVendorFacade: FinancialVendorFacade,private readonly contactFacade: ContactFacade,) {
    this.medicalProviderForm = this.formBuilder.group({});
  }
  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.contactFacade.loadDdlStates();
    if (this.isEditPharmacy) {
      this.selectedPharmacyForEdit = this.selectedPharmacy?.vendorFullName ?? '';
      this.selectedPharmacyId = this.selectedPharmacy?.vendorId;
    }
    this.hasPharmacyCreateUpdatePermission = this.userManagementFacade.hasPermission(['Service_Provider_Insurance_Vendor_Create_Update']);
  }

  /** Private methods **/
  searchPharmacies(searchText: string) {
    this.selectedPharmacyId = null;
    this.btnDisabled = false;
    this.searchPharmacyEvent.emit(searchText);
  }

  removePharmacy() {
    this.removePharmacyEvent.emit();
  }


  addOrEditPharmacy() {
    if (this.selectedPharmacyId) {
      this.btnDisabled = true
      if (this.isEditPharmacy) {

        this.editPharmacyEvent.emit(this.selectedPharmacyId ?? '');
      }
      else {
        this.setAsPrimaryEvent.emit(this.isSetAsPrimary);
        this.addPharmacyEvent.emit(this.selectedPharmacyId ?? '');

      }
    }
    else {
      this.showSelectPharmacyRequired = true;
    }
  }

  /** Internal event methods **/
  onCloseNewPharmacyClicked() {
    this.closePharmacyEvent.emit();
    this.isOpenNewPharmacyClicked = false;
  }

  onOpenNewPharmacyClicked() {
    this.isOpenNewPharmacyClicked = true;
    this.buildVendorForm();
  }

  onClosePharmacyClicked() {
    this.closePharmacyEvent.emit();
  }

  onSearchTemplateClick(pharmacy: Pharmacy) {
    if (pharmacy.vendorId) {
      this.selectedPharmacyId = pharmacy.vendorId;
      this.showSelectPharmacyRequired = false;
    }
    else {
      this.selectedPharmacyId = null;
    }
  }

  buildVendorForm() {
    this.medicalProviderForm.reset();
    this.medicalProviderForm = this.formBuilder.group({
      firstName: [''],
      lastName: [],
      providerName: [''],
      tinNumber: [''],
      npiNbr: [''],
      paymentMethod: [''],
      clinicType: [''],
      specialHandling: [''],
      mailCode: [''],
      nameOnCheck: [''],
      nameOnEnvolop: [''],
      addressLine1: [''],
      addressLine2: [''],
      city: [''],
      state: [''],
      zip: [''],
      physicalAddressFlag: [''],
      isPreferedPharmacy: [''],
      paymentRunDate: [''],
      isAcceptCombinedPayment: [''],
      isAcceptReports: [''],
      newAddContactForm: this.formBuilder.array([
      ]),
    });
  }
  saveVendorProfile(vendorProfile: any) {

    this.financialVendorFacade.showLoader();
    this.financialVendorFacade.addVendorProfile(vendorProfile).subscribe({
      next: (response: any) => {
        this.financialVendorFacade.hideLoader();
        this.onCloseNewPharmacyClicked();
        var notificationMessage = "Vendor profile added successfully";
        this.financialVendorFacade.showHideSnackBar(SnackBarNotificationType.SUCCESS, notificationMessage);
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.financialVendorFacade.showHideSnackBar(SnackBarNotificationType.ERROR, err);
      }
    });
  }
  searchClinicVendorClicked(clientName: any) {

    this.financialVendorFacade.searchClinicVendor(clientName);
  }
  public get vendorTypes(): typeof FinancialVendorTypeCode {
    return FinancialVendorTypeCode;
  }
}
