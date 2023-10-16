import {
  Component,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  Input,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { State, groupBy } from '@progress/kendo-data-query';
import { FinancialPharmacyClaimsFacade } from '@cms/case-management/domain';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Lov } from '@cms/system-config/domain';
@Component({
  selector: 'cms-pharmacy-claims-detail-form',
  templateUrl: './pharmacy-claims-detail-form.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PharmacyClaimsDetailFormComponent implements OnInit{

  pharmacyClaimForm!: FormGroup;
  clientTotalPayments = 0
  
  public formUiStyle: UIFormStyle = new UIFormStyle();
  isShownSearchLoader = false;
  claimsListData$ = this.financialPharmacyClaimsFacade.claimsListData$;
  sortValue = this.financialPharmacyClaimsFacade.sortValueClaims;
  sortType = this.financialPharmacyClaimsFacade.sortType;
  pageSizes = this.financialPharmacyClaimsFacade.gridPageSizes;
  gridSkipCount = this.financialPharmacyClaimsFacade.skipCount;
  sort = this.financialPharmacyClaimsFacade.sortClaimsList;
  state!: State;
  brandName =""
  drugName = ""
  

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

  @Output() addPharmacyClaimEvent = new EventEmitter<any>();
  @Output() updatePharmacyClaimEvent = new EventEmitter<any>();
  @Output() getPharmacyClaimEvent = new EventEmitter<any>();
  @Output() searchPharmaciesEvent = new EventEmitter<any>();
  @Output() searchClientsEvent = new EventEmitter<any>();
  @Output() searchDrugEvent = new EventEmitter<any>();
  @Output() getCoPaymentRequestTypeLovEvent = new EventEmitter<any>();
  @Output() modalCloseAddEditClaimsFormModal = new EventEmitter();
  @Output() getDrugUnitTypeLovEvent = new EventEmitter<any>();

  selectedPharmacy! : any
  showServicesListForm = false
  selectedNDCCode! :any
  isSubmitted = false
  groupedPaymentRequestTypes: any;
  
  constructor(
    private readonly financialPharmacyClaimsFacade: FinancialPharmacyClaimsFacade,
    private formBuilder: FormBuilder,private cd: ChangeDetectorRef,
  ) {}
  ngOnInit(): void {   
    this.cd.markForCheck();
   this.initClaimForm()
   this.getCoPaymentRequestTypeLovEvent.emit()
   this.getDrugUnitTypeLovEvent.emit()
   this. mapPaymentRequestTypes()
    this.cd.markForCheck();
  }
  get addClaimServicesForm(): FormArray {
    return this.pharmacyClaimForm.get('prescriptionFillDto') as FormArray;
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
      paymentRequestId :[''] ,
      clientCaseEligibilityId: ['', Validators.required],
      vendorAddressId: new FormControl('', Validators.required),     
      clientId: new FormControl('', Validators.required),     
      prescriptionFillDto: new FormArray([]),      
      paymentMethodCode: ['', Validators.required]
     
    });
  }

  addClaimServiceGroup()
  {    
    const pharmacyClaimService = this.formBuilder.group({
      prescriptionFillId : [''],
      claimNbr  : ['', Validators.required],
      prescriptionFillDate  : ['', Validators.required],
      copayAmountPaid  : [0, Validators.required],
      ndc  : ['', Validators.required],
      qntType  : ['', Validators.required],
      dispensingQty  : [0, Validators.required],
      daySupply  : [0, Validators.required],
      paymentTypeCode : ['' , Validators.required],
      brandName : [''],
      drugName : ['']
    });

    this.addClaimServicesForm.push(pharmacyClaimService)
    this.cd.markForCheck();
    this.cd.markForCheck()
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
      vendorAddressId: this.pharmacyClaimForm.controls["vendorAddressId"].value , 
      clientId: this.pharmacyClaimForm.controls["clientId"].value , 
      paymentMethodCode: this.pharmacyClaimForm.controls["paymentMethodCode"].value , 
      prescriptionFillDto: [{}]     
    };

    for(let prescription  of formValues.prescriptionFillDto)
    {
       const service =
       {
        prescriptionFillId : prescription.prescriptionFillId,
        claimNbr  : prescription.claimNbr,
        prescriptionFillDate  : prescription.prescriptionFillDate,
        copayAmountPaid  : prescription.copayAmountPaid,
        ndc  : prescription.ndc,
        qntType  : prescription.qntType,
        dispensingQty  : prescription.dispensingQty,
        daySupply  : prescription.daySupply ,
        paymentTypeCode : prescription.paymentTypeCode
       }
       pharmacyClaimData.prescriptionFillDto.push(service)
    }
     if(pharmacyClaimData.paymentRequestId)
     {
        //this.updatePharmacyClaimEvent.emit(pharmacyClaimData)
     }
     else
     {
        //this.addPharmacyClaimEvent.emit(pharmacyClaimData)
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
    this.searchClientsEvent.emit(searchText)
  }

  searchcptcode(searchText : any)
  {
    if (!searchText || searchText.length == 0) {
      return;
    }
    this.searchDrugEvent.emit(searchText)
  }

  onNdcCodeValueChange(data : any , index : any)
  {
    this.addClaimServicesForm.at(index).get('brandName')?.enable()
    this.addClaimServicesForm.at(index).get('drugName')?.enable()

    this.addClaimServicesForm.at(index).get('brandName')?.setValue(data?.brandName)
    this.addClaimServicesForm.at(index).get('drugName')?.setValue(data?.drugName)
    this.addClaimServicesForm.at(index).get('brandName')?.setValue(data?.qntType)

    this.addClaimServicesForm.at(index).get('brandName')?.disable()
    this.addClaimServicesForm.at(index).get('drugName')?.disable()
  }
  pharmacySelectionChange(data : any)
  {
    
    this.pharmacyClaimForm.controls['vendorAddressId'].setValue(data?.vendorAddressId);
    this.cd.detectChanges();
  this.showHideServiceList()    
  }


  clientSelectionChange(data : any)
  {
    this.pharmacyClaimForm.controls['clientId'].setValue(data?.clientId);
    this.cd.detectChanges();
  this.clientTotalPayments = data?.TotalPayments ?? 0    
  this.showHideServiceList()
  }

  showHideServiceList()
  {  
    if(this.pharmacyClaimForm.controls["vendorAddressId"].value && this.pharmacyClaimForm.controls["clientId"].value > 0)
    {
    this.addClaimServiceGroup()
    this.showServicesListForm = true
    }
  }
 
}
