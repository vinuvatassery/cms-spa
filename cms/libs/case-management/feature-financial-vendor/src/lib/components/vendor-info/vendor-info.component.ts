import { ChangeDetectionStrategy, Component, OnInit, Input, EventEmitter, Output, ChangeDetectorRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoaderService, SnackBarNotificationType } from '@cms/shared/util-core';
import { FinancialVendorDataService, FinancialVendorFacade } from '@cms/case-management/domain'
import { PopoverComponent } from '@progress/kendo-angular-tooltip';
@Component({
  selector: 'cms-vendor-info',
  templateUrl: './vendor-info.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VendorInfoComponent implements OnInit {

  @Input() profileInfoTitle!: string;
  @Input() selectedVendorInfo$: any;
  @Input() vendorTypes!: any;
  @Input() vendorProfile$: any;
  @Output() onVendorEditSuccessStatus = new EventEmitter<boolean>();
  medicalProviderForm: FormGroup;
  SpecialHandlingLength = 100;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  vendorDetail!: any;
  vendorId!: string;
  openEditDailog: boolean = false;
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  addressGridView = [];
  @Input() providerType!: string;
  editTitlePrefix: string = "";
  tabCode!: string;
  public actions = [
    {
      buttonType: "btn-h-primary",
      text: "Edit Address",
      icon: "edit",
      click: (data: any): void => {
        console.log(data);
      },
    },
    {
      buttonType: "btn-h-primary",
      text: "Deactivate Address",
      icon: "block",
      click: (data: any): void => {
        console.log(data);
      },
    },
    {
      buttonType: "btn-h-danger",
      text: "Delete Address",
      icon: "delete",
      click: (data: any): void => {
        console.log(data);
      },
    },
  ];

  @ViewChild("onUserProfileDetailsHovered", { static: false })
  public onUserProfileDetailsHovered!: PopoverComponent;


  constructor(private financialVendorFacade: FinancialVendorFacade,
    private activeRoute: ActivatedRoute,
    private readonly formBuilder: FormBuilder,
    private readonly cdr: ChangeDetectorRef,private financialVendorDataService:FinancialVendorDataService,private loaderService:LoaderService) {
      this.medicalProviderForm = this.formBuilder.group({});
  }

  public popoverCallback = (anchor: HTMLElement) => {
      return this.onUserProfileDetailsHovered ;
}

  ngOnInit() {
    this.vendorId = this.activeRoute.snapshot.queryParams['v_id'];
    this.buildVendorForm();
    this.tabCode = this.activeRoute.snapshot.queryParams['tab_code'];
    if (this.providerType == this.vendorTypes.DentalProviders) {
      this.editTitlePrefix = 'Dental ';
    }
    else if (this.providerType == this.vendorTypes.MedicalProviders) {
      this.editTitlePrefix = 'Medical ';
    }
    else if (this.providerType == this.vendorTypes.InsuranceVendors) {
      this.editTitlePrefix = 'Insurance ';
    }
  }

  openEditInfoDialog() {
    this.buildVendorForm();
    this.openEditDailog = true;
  }

  closeEditModal(isEditSuccessfull: boolean) {
    this.openEditDailog = false;
    if (isEditSuccessfull) {
      this.onVendorEditSuccessStatus.emit(true);
    }
  }
  saveVendorProfile(vendorProfile: any){
    
    this.financialVendorFacade.showLoader();
    if(this.vendorDetail.vendorTypeCode=='MANUFACTURERS'){
      this.financialVendorFacade.updateManufacturerProfile(vendorProfile).subscribe({
        next:(response:any)=>{
          
          this.financialVendorFacade.hideLoader();
          this.closeEditModal(true);
          this.cdr.detectChanges();
        },
        error:(err:any)=>{
          this.financialVendorFacade.showHideSnackBar(SnackBarNotificationType.ERROR,err);
        }
      });
    }
    else{
      this.financialVendorFacade.addVendorProfile(vendorProfile).subscribe({
        next:(response:any)=>{
          
          this.financialVendorFacade.hideLoader();
          this.closeEditModal(true);
          this.cdr.detectChanges();
        },
        error:(err:any)=>{
          this.financialVendorFacade.showHideSnackBar(SnackBarNotificationType.ERROR,err);
        }
      });
    }
  }
  buildVendorForm() {
    this.medicalProviderForm.reset();
    this.medicalProviderForm = this.formBuilder.group({
      vendorId:[''],
      firstName:[''],
      lastName:[],
      providerName: [''],
      parentVendorId: [''],
      vendorTypeCode: [''],
      tinNumber: [''],
      paymentMethod: [''],
      specialHandling: [''],
      mailCode: [''],
      nameOnCheck: [''],
      nameOnEnvolop: [''],
      addressLine1: [''],
      addressLine2: [''],
      city: [''],
      state: [''],
      zip: [''],
      isPreferedPharmacy: [''],
      paymentRunDate:[''],
      isAcceptCombinedPayment:[''],
      isAcceptReports: [''],
      npiNbr: [],
      newAddContactForm: this.formBuilder.array([
      ]),
    });
  }
  updateVendorDetailsClicked(vendorValues:any)
  {
    
    this.financialVendorDataService.updateVendorDetails(vendorValues).subscribe({
      next: (resp:any) => {
        if (resp) {
         this.financialVendorFacade.showHideSnackBar(SnackBarNotificationType.SUCCESS, this.profileInfoTitle.split(' ')[0] + ' information updated.');
          this.openEditDailog=false;
          this.cdr.detectChanges();
          this.onVendorEditSuccessStatus.emit(true);
        }
        else {
          this.financialVendorFacade.showHideSnackBar(SnackBarNotificationType.WARNING, this.profileInfoTitle.split(' ')[0] + ' information not updated.');
        }
        this.loaderService.hide();
     },
       error: (err:any) => {
        this.loaderService.hide();
        this.financialVendorFacade.showHideSnackBar(SnackBarNotificationType.ERROR, err);
       },
     });
  }
}
