import {
  Component,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  Input,
  OnInit,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { State, groupBy } from '@progress/kendo-data-query';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Lov, UserManagementFacade } from '@cms/system-config/domain';
import { IntlService } from '@progress/kendo-angular-intl';
import { ConfigurationProvider } from '@cms/shared/util-core';
import { Observable, Subscription, first } from 'rxjs';
import { CaseStatusCode } from '../enums/case-status-code.enum';
import { PaymentMethodCode } from '../enums/payment-method-code.enum';

@Component({
  selector: 'common-cms-pharmacy-claims-detail',
  templateUrl: './cms-pharmacy-claims-detail.component.html',
  styleUrls: ['./cms-pharmacy-claims-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CmsPharmacyClaimsDetailComponent implements OnInit, OnDestroy{

  pharmacyClaimForm!: FormGroup;
  clientTotalPayments = 0
  isClientRestricted = false
  isClientInEligible = false
  public formUiStyle: UIFormStyle = new UIFormStyle();
  isShownSearchLoader = false;
  state!: State;
  brandName =""
  drugName = ""
  serviceCount = 0
  @Input() isEdit = false
  @Input() addPharmacyClaim$: any;
  @Input() editPharmacyClaim$: any;
  @Input() getPharmacyClaim$: any;
  @Input() searchPharmacies$: any;
  @Input() searchClients$: any;
  @Input() searchDrugs$: any;
  @Input() searchPharmaciesLoader$: any;
  @Input() searchClientLoader$: any;
  @Input() searchDrugsLoader$: any;
  @Input() paymentRequestType$ : any
  @Input() deliveryMethodLov$ :any
  @Input() addDrug$ : any;
  @Input() manufacturersLov$: any;
  @Input() sortValue : any;
  @Input() sortType : any;
  @Input() pageSizes : any;
  @Input() gridSkipCount : any;
  @Input() sort : any;
  @Input() sortValueRecentClaimList : any;
  @Input() sortRecentClaimList : any;
  @Input() recentClaimsGridLists$ :any;
  @Input() pharmacyRecentClaimsProfilePhoto$!: any;
  @Input() clientCustomName:any;
  @Input() fromDrugPurchased : any;
  @Input() clientId: any;
  @Input() clientCaseEligibilityId:any;

  @Output() addPharmacyClaimEvent = new EventEmitter<any>();
  @Output() updatePharmacyClaimEvent = new EventEmitter<any>();
  @Output() searchPharmaciesEvent = new EventEmitter<any>();
  @Output() searchClientsEvent = new EventEmitter<any>();
  @Output() searchDrugEvent = new EventEmitter<any>();
  @Output() getCoPaymentRequestTypeLovEvent = new EventEmitter<any>();
  @Output() modalCloseAddEditClaimsFormModal = new EventEmitter();
  @Output() getDrugUnitTypeLovEvent = new EventEmitter<any>();
  @Output() addDrugEvent = new EventEmitter<any>();
  @Output()  searchClientsDataEvent = new EventEmitter<any>();
  @Output()  searchPharmacyDataEvent = new EventEmitter<any>();
  @Output()  loadRecentClaimListEvent = new EventEmitter<any>();
  @Output() loadManufacturer = new EventEmitter<any>();
 
  deliveryMethodLovs! :any
  vendorDetails$!: Observable<any>;
  isFinancialDrugsDetailShow = false
  selectedVendor! : any
  selectedClient! : any
  selectedPharmacy! : any
  showServicesListForm = false
  selectedNDCCode! :any
  isSubmitted = false
  groupedPaymentRequestTypes: any;
  objectCode! : any
  pcaCode! :any
  dateFormat = this.configurationProvider.appSettings.dateFormat;
  dialogTitle = "Add"
  hasDrugCreateUpdatePermission = false
  vendorId! : any  
  claimsType:any;
  IsEdit:boolean=false;
  manufacturers: any = [];
  searchClients: any;
  searchClientSubscription!: Subscription
  constructor(
    private formBuilder: FormBuilder,private cd: ChangeDetectorRef,
    public readonly intl: IntlService,
    private readonly configurationProvider: ConfigurationProvider,
    private userManagementFacade: UserManagementFacade
  ) {}

  ngOnInit(): void {
    this.searchClientSubscription  = this.searchClients$.subscribe((data:any)=>{
      this.searchClients = data;
        if(this.fromDrugPurchased){
          this.selectedClient = data[0];
        this.pharmacyClaimForm.controls["client"].setValue(data[0])     
        this.pharmacyClaimForm.controls["client"].disable();   
        this.pharmacyClaimForm.controls["client"].updateValueAndValidity();
        this.pharmacyClaimForm.controls["clientCaseEligibilityId"].setValue(this.clientCaseEligibilityId);
        this.cd.detectChanges();
        }
     }); 
    this.cd.markForCheck();
    this.loadManufacturersLovs()
    this.initClaimForm()
    this.getCoPaymentRequestTypeLovEvent.emit()
    this.getDrugUnitTypeLovEvent.emit()
    this.mapPaymentRequestTypes()
    this.cd.markForCheck();
    this.loadDeliveryMethodLovs()
    this.loadManufacturers()
     if(this.fromDrugPurchased){
      const client = [
         {
           fullCustomName: this.clientCustomName,
           clientId: this.clientId
         },
       ];   
        this.searchClientsDataEvent.next(client);
      }    
  }

  ngOnDestroy(){
    this.searchClientSubscription.unsubscribe();
  }

  get addClaimServicesForm(): FormArray {
    return this.pharmacyClaimForm.get('prescriptionFillDto') as FormArray;
  }


  private loadManufacturersLovs() {
    this.manufacturersLov$
      .subscribe({
        next: (data: any) => {
          this.manufacturers = data;
        }
      });
  }
  mapPaymentRequestTypes()
  {
    this.paymentRequestType$.subscribe((paymentRequestTypes : any) => {
      paymentRequestTypes = paymentRequestTypes.sort((x :any,y : any) => x.sequenceNbr < y.sequenceNbr ? -1 : 1 )
      let parentRequestTypes = paymentRequestTypes.filter((x : any) => x.parentCode == null);
      let refactoredPaymentRequestTypeArray :Lov[] =[]
      parentRequestTypes.forEach((x : any) => {
        let childPaymentRequestTypes= JSON.parse(JSON.stringify(paymentRequestTypes.filter((y : any) => y.parentCode == x.lovCode))) as Lov[];
       if(childPaymentRequestTypes?.length>0){
        childPaymentRequestTypes.forEach(y => y.parentCode = x.lovDesc )
        refactoredPaymentRequestTypeArray.push(...childPaymentRequestTypes);
       }
       else{
        let noChildPaymentRequestType = JSON.parse(JSON.stringify(x))as Lov;
        noChildPaymentRequestType.parentCode = noChildPaymentRequestType.lovDesc
        refactoredPaymentRequestTypeArray.push(noChildPaymentRequestType)
       }
      })
      this.groupedPaymentRequestTypes = groupBy(refactoredPaymentRequestTypeArray, [{ field: "parentCode" }]);
    });
  }

  initClaimForm() {
    this.pharmacyClaimForm = this.formBuilder.group({
      paymentRequestId :['00000000-0000-0000-0000-000000000000'] ,
      clientCaseEligibilityId: ['', Validators.required],
      vendorId: new FormControl('', Validators.required),
      pharmacy: [this.selectedVendor, Validators.required],
      client: [this.selectedClient, Validators.required],
      prescriptionFillDto: new FormArray([]),
      paymentMethodCode: [true,false]

    });
    this.onExistClaimFormLoad()
  }

  addClaimServiceGroup()
  {
    const currentDate = new Date();
    const pharmacyClaimService = this.formBuilder.group({
      prescriptionFillId : ['00000000-0000-0000-0000-000000000000'],
      claimNbr  : ['', Validators.required],
      prescriptionFillDate  :  [currentDate, Validators.required], 
      copayAmountPaid  : ['', Validators.required],
      ndc  : ['', Validators.required],
      qntType  : ['', Validators.required],
      dispensingQty  : ['', Validators.required],
      daySupply  : ['', Validators.required],
      paymentTypeCode : ['' , Validators.required],
      brandName : [{value: '', disabled: true}],
      drugName : [{value: '', disabled: true}],
      objectCode :[{value: '', disabled: true}],
      pcaCode : [{value: '', disabled: true}]
    });

    pharmacyClaimService.controls['objectCode']?.enable()
    pharmacyClaimService.controls['objectCode'].setValue(this.objectCode);
    pharmacyClaimService.controls['objectCode']?.disable()

    this.addClaimServicesForm.push(pharmacyClaimService)
    this.cd.markForCheck()
    this.isSubmitted = false
    this.serviceCount = this.addClaimServicesForm.length
  }

  isControlValid(controlName: string, index: any) {
    let control = this.addClaimServicesForm.at(index) as FormGroup;
    return control?.controls[controlName]?.status == 'INVALID';
  }
  savePharmacyClaim()
  {
    this.isSubmitted = true
    if (!this.pharmacyClaimForm.valid) {
      this.pharmacyClaimForm.markAllAsTouched()
      return;
    }

    let formValues = this.pharmacyClaimForm.value;

    let pharmacyClaimData =
    {
      paymentRequestId :this.pharmacyClaimForm.controls["paymentRequestId"].value ,
      clientCaseEligibilityId: this.pharmacyClaimForm.controls["clientCaseEligibilityId"].value ,
      vendorAddressId: this.pharmacyClaimForm.controls["pharmacy"].value.vendorAddressId ,
      vendorId : this.pharmacyClaimForm.controls["vendorId"].value ,
      clientId: this.pharmacyClaimForm.controls["client"].value.clientId ,
      paymentMethodCode: this.pharmacyClaimForm.controls["paymentMethodCode"].value ===true ? PaymentMethodCode.SPOTS : '' ,
      prescriptionFillDto: [{}]
    };

    for(let prescription  of formValues.prescriptionFillDto)
    {
       const service =
       {
        prescriptionFillId : prescription.prescriptionFillId ?? '00000000-0000-0000-0000-000000000000',
        claimNbr  : prescription.claimNbr,
        prescriptionFillDate  : this.intl.formatDate(prescription.prescriptionFillDate,this.dateFormat) ,
        copayAmountPaid  : prescription.copayAmountPaid,
        ndc  : prescription.ndc.replaceAll('-',''),
        qntType  : prescription.qntType,
        dispensingQty  : prescription.dispensingQty,
        daySupply  : prescription.daySupply ,
        paymentTypeCode : prescription.paymentTypeCode
       }
       pharmacyClaimData.prescriptionFillDto.push(service)
    }

    pharmacyClaimData.prescriptionFillDto.splice(0, 1);

     if(pharmacyClaimData.paymentRequestId != '00000000-0000-0000-0000-000000000000')
     {
        this.updatePharmacyClaimEvent.emit(pharmacyClaimData)
     }
     else
     {
        this.addPharmacyClaimEvent.emit(pharmacyClaimData)
     }

  }

  removeService(i: number) {
    if(this.isEdit && this.addClaimServicesForm.length == 1)
    {
       this.addClaimServicesForm.reset();
    }
    if(this.addClaimServicesForm.length > 1 ){
    let form = this.addClaimServicesForm.value[i]

    this.addClaimServicesForm.removeAt(i);

    this.serviceCount = this.addClaimServicesForm.length
    }
  }

  closeAddEditClaimsFormModalClicked() {
    this.modalCloseAddEditClaimsFormModal.emit(true);
  }

  searchPharmacy(searchText : any)
  {
    if (!searchText || searchText.length == 0) {
      return;
    }
    this.searchPharmaciesEvent.emit(searchText)
  }

  searchClient(searchText : any)
  {
    if (!searchText || searchText.length == 0) {
      return;
    }
    const isDateSearch = searchText.includes('/');
    searchText = this.formatSearchValue(searchText, isDateSearch);
    this.searchClientsEvent.emit(searchText)
  }

  private formatSearchValue(searchValue: any, isDateSearch: boolean) {
    if (isDateSearch) {
      if (this.isValidDate(searchValue)) {
        return this.intl.formatDate(
          new Date(searchValue),
          this.configurationProvider?.appSettings?.dateFormatUS
        );
      } else {
        return '';
      }
    }
    return searchValue;
  }
  private isValidDate = (searchValue: any) =>
  isNaN(searchValue) && !isNaN(Date.parse(searchValue));
  searchcptcode(searchText : any)
  {
    if (!searchText || searchText.length == 0) {
      return;
    }
    const ndcCodeSearch ={
      isClientRestricted : this.isClientRestricted,
      searchText : searchText
    }
    this.searchDrugEvent.emit(ndcCodeSearch)
  }

  onNdcCodeValueChange(data : any , index : any)
  {
    this.addClaimServicesForm.at(index).get('brandName')?.enable()
    this.addClaimServicesForm.at(index).get('drugName')?.enable()

    this.addClaimServicesForm.at(index).get('brandName')?.setValue(data?.brandName)
    this.addClaimServicesForm.at(index).get('drugName')?.setValue(data?.drugName)
    this.addClaimServicesForm.at(index).get('qntType')?.setValue(data?.deliveryMethodCode)

    this.addClaimServicesForm.at(index).get('brandName')?.disable()
    this.addClaimServicesForm.at(index).get('drugName')?.disable()
  }
  pharmacySelectionChange(data : any)
  {
    this.pharmacyClaimForm.controls['prescriptionFillDto'].reset()
    this.vendorId=data?.vendorId
    this.pharmacyClaimForm.controls['vendorId'].setValue(data?.vendorId);
    this.objectCode = data?.objectCode;
    this.cd.detectChanges();

  }


  clientSelectionChange(data : any)
  {
    this.pharmacyClaimForm.controls['prescriptionFillDto'].reset()
    this.pharmacyClaimForm.controls['clientCaseEligibilityId'].setValue(data?.clientCaseEligibilityId);
     this.isClientRestricted = data?.caseStatus === CaseStatusCode.restricted
     this.isClientInEligible = (data?.clientCaseEligibilityId && data?.caseStatus !== CaseStatusCode.accept && data?.caseStatus !== CaseStatusCode.restricted)
    this.objectCode = data?.objectCode;
    this.clientId=data.clientId;
    this.cd.detectChanges();
    this.clientTotalPayments = data?.TotalPayments ?? 0

  }

  showHideServiceList()
  {
    if(this.pharmacyClaimForm.controls["pharmacy"].value && this.pharmacyClaimForm.controls["client"].value?.clientId > 0
    && this.addClaimServicesForm.length == 0)
    {
    this.addClaimServiceGroup()
    this.showServicesListForm = true
    }
  }

  onExistClaimFormLoad() {
    this.getPharmacyClaim$?.pipe(first((existClaimData: any) => existClaimData?.paymentRequestId != null))
      .subscribe((existClaimData: any) => {
        this.clientId = existClaimData.clientId;
        this.vendorId = existClaimData.vendorId;
        if (existClaimData?.paymentRequestId) {
          this.isEdit = true
          const fullVendorCustomName = existClaimData?.vendorName + ' ' + existClaimData?.tin + ' ' + existClaimData?.mailCode + ' ' + existClaimData?.address
          const fullClientCustomName = existClaimData?.clientFullName + ' ' + existClaimData?.clientId + ' ' + existClaimData?.ssn + ' ' + existClaimData?.dob
          this.objectCode = existClaimData?.objectCode
          this.pcaCode = existClaimData?.pcaCode
          const client = [
            {
              fullCustomName: fullClientCustomName,
              clientId: existClaimData.clientId
            },
          ];

          const vendor = [
            {
              fullCustomName: fullVendorCustomName,
              vendorAddressId: existClaimData.vendorAddressId
            },
          ];

          this.searchClientsDataEvent.next(client);
          this.searchPharmacyDataEvent.next(vendor);
          this.selectedClient = client[0]
          this.selectedVendor = vendor[0]
          this.pharmacyClaimForm.controls['pharmacy'].setValue(vendor[0]);
          this.pharmacyClaimForm.controls['client'].setValue(client[0]);
          this.pharmacyClaimForm.patchValue(
            {
              paymentRequestId: existClaimData?.paymentRequestId,
              clientCaseEligibilityId: existClaimData?.clientCaseEligibilityId,
              vendorId: existClaimData?.vendorId,
              paymentMethodCode: existClaimData?.paymentMethodCode === PaymentMethodCode.SPOTS
            }
          )
          this.vendorId = existClaimData?.vendorId
          this.setFormValues(existClaimData?.prescriptionFillDto)
        }
      })
  }

  setFormValues(services: any) {
    this.showServicesListForm = true
    for (let i = 0; i < services.length; i++) {
      let service = services[i];
      this.addClaimServiceGroup();
      let serviceForm = this.addClaimServicesForm.at(i) as FormGroup;

      serviceForm.controls['prescriptionFillId'].setValue(service?.prescriptionFillId);
      serviceForm.controls['claimNbr'].setValue(service?.claimNbr);
       serviceForm.controls['prescriptionFillDate'].setValue(
        new Date(service?.prescriptionFillDate)
      );
      serviceForm.controls['copayAmountPaid'].setValue(service?.copayAmountPaid);
      serviceForm.controls['ndc'].setValue(service?.ndc?.replace(/\D/g, '').replace(/^(\d{5})/, '$1-').replace(/-(\d{4})/, '-$1-'));
      serviceForm.controls['qntType'].setValue(service.qntType);
      serviceForm.controls['dispensingQty'].setValue(service?.dispensingQty);
      serviceForm.controls['daySupply'].setValue(service?.daySupply);
      serviceForm.controls['paymentTypeCode'].setValue(service?.paymentTypeCode);

      serviceForm.controls['brandName']?.enable()
      serviceForm.controls['drugName']?.enable()
      serviceForm.controls['objectCode']?.enable()
      serviceForm.controls['pcaCode']?.enable()

      serviceForm.controls['brandName'].setValue(service?.brandName ?? '');
      serviceForm.controls['drugName'].setValue(service?.drugName ?? '');
      serviceForm.controls['objectCode'].setValue(this.objectCode);
      serviceForm.controls['pcaCode'].setValue(this.pcaCode);

      serviceForm.controls['brandName']?.disable()
      serviceForm.controls['drugName']?.disable()
      serviceForm.controls['objectCode']?.disable()
      serviceForm.controls['pcaCode']?.disable()
    }

  }

  clickOpenAddEditFinancialDrugsDetails() {  
    this.hasDrugCreateUpdatePermission = this.userManagementFacade.hasPermission(['Service_Provider_Drug_Create_Update']);
    this.dialogTitle = this.hasDrugCreateUpdatePermission ? "Add" : "Request New";
    this.isFinancialDrugsDetailShow = true;
    this.cd.detectChanges()
  }

  clickCloseAddEditFinancialDrugsDetails()
  {
    this.isFinancialDrugsDetailShow = false;
  }

  private loadManufacturers() {
   this.loadManufacturer.next(true);
  }

  private loadDeliveryMethodLovs() {
    this.deliveryMethodLov$
      .subscribe({
        next: (data: any) => {
          this.deliveryMethodLovs = data;
        }
      });
  }

  addDrug(data : any)
  {
    this.addDrugEvent.next(data);
  }

  loadRecentClaimListEventHandler(data : any){
    this.loadRecentClaimListEvent.next(data);
  }
}
