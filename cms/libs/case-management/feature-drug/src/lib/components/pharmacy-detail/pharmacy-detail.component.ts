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
import { FinancialVendorTypeCode, StatusFlag } from '@cms/shared/ui-common';
import { UIFormStyle } from '@cms/shared/ui-tpa'
import { SnackBarNotificationType } from '@cms/shared/util-core';
import { NavigationMenuFacade, UserManagementFacade } from '@cms/system-config/domain';
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
  @Output() addPharmacyEvent = new EventEmitter<any>();
  @Output() editPharmacyEvent = new EventEmitter<any>();
  @Output() removePharmacyEvent = new EventEmitter<string>();
  @Output() setAsPrimaryEvent = new EventEmitter<any>();
  public formUiStyle: UIFormStyle = new UIFormStyle();
  /** Public properties **/
  isOpenNewPharmacyClicked = false;
  isSetAsPrimary = false;
  filteredSelectedPharmacy!: any;
  pharmacyForm!: FormGroup;
  selectedPharmacyForEdit!: any;
  selectedPharmacyId!: string | null;
  vendorAddressId:any;
  showSelectPharmacyRequired = false;
  btnDisabled = false;
  medicalProviderForm: FormGroup;
  ddlStates = this.contactFacade.ddlStates$;
  hasPharmacyCreateUpdatePermission:boolean = false;
  permissionLevels:any[]=[];
  constructor(private drugPharmacyFacade: DrugPharmacyFacade, private readonly formBuilder: FormBuilder,
    private readonly cdr: ChangeDetectorRef, private userManagementFacade: UserManagementFacade,
    private financialVendorFacade: FinancialVendorFacade,private readonly contactFacade: ContactFacade,
    private readonly navigationMenuFacade : NavigationMenuFacade,) {
    this.medicalProviderForm = this.formBuilder.group({});
  }
  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.contactFacade.loadDdlStates();
    if (this.isEditPharmacy) {
      this.selectedPharmacyForEdit = this.selectedPharmacy?.vendorFullName ?? '';
      this.selectedPharmacyId = this.selectedPharmacy?.vendorId;
    }
    this.hasPharmacyCreateUpdatePermission = this.userManagementFacade.hasPermission(['Service_Provider_Pharmacy_Create_Update']);
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
    let pharmacyDetailObj = {
      vendorId:this.selectedPharmacyId,
      VendorAddressId:this.vendorAddressId
    }
    if (this.selectedPharmacyId) {
      this.btnDisabled = true
      if (this.isEditPharmacy) {

        this.editPharmacyEvent.emit(pharmacyDetailObj ?? {});
      }
      else {
        this.setAsPrimaryEvent.emit(this.isSetAsPrimary);
        this.addPharmacyEvent.emit(pharmacyDetailObj ?? {});

      }
    }
    else {
      this.showSelectPharmacyRequired = true;
      this.ngDirtyInValid();
    }
  }

  /** Internal event methods **/
  onCloseNewPharmacyClicked() {
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
      this.vendorAddressId = pharmacy?.vendorAddressId;
      this.showSelectPharmacyRequired = false;
      this.ngDirtyInValid();
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
        if(vendorProfile.activeFlag === StatusFlag.No)
          {
            this.loadPendingApprovalGeneralCount();
          }
        this.financialVendorFacade.hideLoader();
        this.onCloseNewPharmacyClicked();
        let notificationMessage = response.message;
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


  loadPendingApprovalGeneralCount() {

    this.navigationMenuFacade.getPendingApprovalGeneralCount();
  }

  ngDirtyInValid() {
    if (this.showSelectPharmacyRequired) {
      document.getElementById('pharmacyName')?.classList.remove('ng-valid');
      document.getElementById('pharmacyName')?.classList.add('ng-invalid');
      document.getElementById('pharmacyName')?.classList.add('ng-dirty');
    }
    else {
      document.getElementById('pharmacyName')?.classList.remove('ng-invalid');
      document.getElementById('pharmacyName')?.classList.remove('ng-dirty');
      document.getElementById('pharmacyName')?.classList.add('ng-valid');
    }
  }
}
