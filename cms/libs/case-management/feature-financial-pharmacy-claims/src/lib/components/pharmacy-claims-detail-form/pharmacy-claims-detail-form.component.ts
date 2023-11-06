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
import { IntlService } from '@progress/kendo-angular-intl';
import { ConfigurationProvider } from '@cms/shared/util-core';
import { first } from 'rxjs';
@Component({
  selector: 'cms-pharmacy-claims-detail-form',
  templateUrl: './pharmacy-claims-detail-form.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PharmacyClaimsDetailFormComponent implements OnInit{

  pharmacyClaimForm!: FormGroup;
  clientTotalPayments = 0
  isClientRestricted = false
  isClientInEligible = false
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
  @Output() searchPharmaciesEvent = new EventEmitter<any>();
  @Output() searchClientsEvent = new EventEmitter<any>();
  @Output() searchDrugEvent = new EventEmitter<any>();
  @Output() getCoPaymentRequestTypeLovEvent = new EventEmitter<any>();
  @Output() modalCloseAddEditClaimsFormModal = new EventEmitter();
  @Output() getDrugUnitTypeLovEvent = new EventEmitter<any>();
  selectedVendor! : any   
  selectedClient! : any   
  selectedPharmacy! : any
  showServicesListForm = false
  selectedNDCCode! :any
  isSubmitted = false
  groupedPaymentRequestTypes: any;
  dateFormat = this.configurationProvider.appSettings.dateFormat;
  constructor(
    private readonly financialPharmacyClaimsFacade: FinancialPharmacyClaimsFacade,
    private formBuilder: FormBuilder,private cd: ChangeDetectorRef,
    public readonly intl: IntlService,
    private readonly configurationProvider: ConfigurationProvider,
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
      paymentRequestId :['00000000-0000-0000-0000-000000000000'] ,
      clientCaseEligibilityId: ['', Validators.required],
      vendorId: new FormControl('', Validators.required),     
      pharmacy: [this.selectedVendor, Validators.required],
      client: [this.selectedClient, Validators.required],
      prescriptionFillDto: new FormArray([]),      
      paymentMethodCode: [false]
     
    });
    this.onExistClaimFormLoad()
  }

  addClaimServiceGroup()
  {       
    const pharmacyClaimService = this.formBuilder.group({
      prescriptionFillId : ['00000000-0000-0000-0000-000000000000'],
      claimNbr  : ['', Validators.required],
      prescriptionFillDate  : ['', Validators.required],
      copayAmountPaid  : ['', Validators.required],
      ndc  : ['', Validators.required],
      qntType  : ['', Validators.required],
      dispensingQty  : ['', Validators.required],
      daySupply  : ['', Validators.required],
      paymentTypeCode : ['' , Validators.required],
      brandName : [''],
      drugName : ['']
    });

    this.addClaimServicesForm.push(pharmacyClaimService) 
    this.cd.markForCheck()
    this.isSubmitted = false
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
      paymentMethodCode: this.pharmacyClaimForm.controls["paymentMethodCode"].value ===true ? 'SPOTS' : '' , 
      prescriptionFillDto: [{}]     
    };
    
    for(let prescription  of formValues.prescriptionFillDto)
    {
       const service =
       {
        prescriptionFillId : prescription.prescriptionFillId,
        claimNbr  : prescription.claimNbr,
        prescriptionFillDate  : this.intl.formatDate(prescription.prescriptionFillDate,this.dateFormat) ,
        copayAmountPaid  : prescription.copayAmountPaid,
        ndc  : prescription.ndc,
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
    this.pharmacyClaimForm.controls['vendorId'].setValue(data?.vendorId);    
    this.cd.detectChanges();
 
  }


  clientSelectionChange(data : any)
  {  
    this.pharmacyClaimForm.controls['clientCaseEligibilityId'].setValue(data?.clientCaseEligibilityId);
    this.cd.detectChanges();
  this.clientTotalPayments = data?.TotalPayments ?? 0    
 
  }

  showHideServiceList()
  {      
    if(this.pharmacyClaimForm.controls["pharmacy"].value && this.pharmacyClaimForm.controls["client"].value?.clientId > 0)
    {
    this.addClaimServiceGroup()
    this.showServicesListForm = true
    }
  }


  onExistClaimFormLoad()
  {    
   this.getPharmacyClaim$?.pipe(first((existClaimData: any ) => existClaimData?.paymentRequestId != null))
   .subscribe((existClaimData: any) =>
   {  
       if(existClaimData?.paymentRequestId)
       {   

      const fullVendorCustomName = existClaimData?.vendorName + ' '+ existClaimData?.tin + ' '+ existClaimData?.mailCode + ' '+ existClaimData?.address 
      const fullClientCustomName = existClaimData?.clientFullName + ' '+ existClaimData?.clientId + ' '+ existClaimData?.ssn + ' '+ existClaimData?.dob   
      
        const client =[
          {             
            fullCustomName: fullClientCustomName,
            clientId: existClaimData.clientId                 
          },
        ]; 
        
        const vendor =[
            {             
              fullCustomName : fullVendorCustomName,
              vendorAddressId: existClaimData.vendorAddressId             
            },
        ];           
        
        this.financialPharmacyClaimsFacade.searchClientsDataSubject.next(client)
         this.financialPharmacyClaimsFacade.searchPharmaciesDataSubject.next(vendor)        
         this.selectedClient=client[0]      
         this.selectedVendor=vendor[0]
         this.pharmacyClaimForm.controls['pharmacy'].setValue(vendor[0]);
         this.pharmacyClaimForm.controls['client'].setValue(client[0]);
           this.pharmacyClaimForm.patchValue(
             {     
              paymentRequestId : existClaimData?.paymentRequestId ,
              clientCaseEligibilityId: existClaimData?.clientCaseEligibilityId,                
              vendorId : existClaimData?.vendorId,
              paymentMethodCode : existClaimData?.paymentMethodCode === 'SPOTS'
             }
           )
           
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
      serviceForm.controls['ndc'].setValue(service?.ndc);
      serviceForm.controls['qntType'].setValue(service.qntType);
      serviceForm.controls['dispensingQty'].setValue(service?.dispensingQty);
      serviceForm.controls['daySupply'].setValue(service?.daySupply);
      serviceForm.controls['paymentTypeCode'].setValue(service?.paymentTypeCode);
      serviceForm.controls['brandName'].setValue(service?.brandName);
      serviceForm.controls['drugName'].setValue(service?.drugName);
    }
   
  }
 
}
