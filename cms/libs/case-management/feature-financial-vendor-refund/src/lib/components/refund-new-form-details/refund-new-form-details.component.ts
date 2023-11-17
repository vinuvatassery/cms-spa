import { Component , Output, EventEmitter, Input} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
import { FinancialVendorRefundFacade } from '@cms/case-management/domain';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SnackBarNotificationType } from '@cms/shared/util-core';
@Component({
  selector: 'cms-refund-new-form-details',
  templateUrl: './refund-new-form-details.component.html',
})
export class RefundNewFormDetailsComponent{
  public formUiStyle: UIFormStyle = new UIFormStyle();
  isShownSearchLoader = false;
  selectedRefundType : any;
  public refundType  = [
    "TPA",
    "INS",
    "RX",
  ];
  clientCaseEligibilityId: any = null;
  clientId: any;
  clientName: any;
  vendorId: any;
  isRefundGridClaimShow = false;
  isShowReasonForException = false;
  showServicesListForm: boolean =false;
  selectedMedicalProvider: any;
  showGrid: boolean = false;
  tab = 1;
  dataExportParameters!: any;
  currentFormControl!: FormGroup<any>;
  sortType = this.financialVendorRefundFacade.sortType;
  pageSizes = this.financialVendorRefundFacade.gridPageSizes;
  gridSkipCount = this.financialVendorRefundFacade.skipCount;
  state!: State;
  providerTin: any;
  selectedClient: any;
  refundClaimForm!: FormGroup;
  vendorName: any;
  sortValueClaims = this.financialVendorRefundFacade.sortValueClaims;
  sortClaims = this.financialVendorRefundFacade.sortClaimsList;
  claimsListData$ =   this.financialVendorRefundFacade.claimsListData$;
  sortValuePremiums = this.financialVendorRefundFacade.sortValuePremiums;
  sortPremiums = this.financialVendorRefundFacade.sortPremiumsList;
  premiumsListData$ =   this.financialVendorRefundFacade.premiumsListData$;
  sortValueClientClaims = this.financialVendorRefundFacade.sortValueClientClaims;
  sortClientClaims = this.financialVendorRefundFacade.sortClientClaimsList;
  clientClaimsListData$ =   this.financialVendorRefundFacade.clientClaimsListData$;
  sortValuePharmacyPayment = this.financialVendorRefundFacade.sortValuePharmacyPayment;
  sortPharmacyPayment = this.financialVendorRefundFacade.sortValuePharmacyPayment;
  pharmacyPaymentsListData$ =   this.financialVendorRefundFacade.pharmacyPaymentsListData$;
  clientSearchLoaderVisibility$ =
  this.financialVendorRefundFacade.clientSearchLoaderVisibility$;
  clientSearchResult$ = this.financialVendorRefundFacade.clients$;
  pharmacySearchResult$ = this.financialVendorRefundFacade.pharmacies$;
  isConfirmationClicked = false;
  isSubmitted: boolean = false;
  isRefundRxSubmitted : boolean = false;
  isSpotsPayment!: boolean;
  clientSearchResult =[
    {
      clientId: '12',
      clientFullName: 'Fname Lname',
      ssn: '2434324324234',
      dob: '23/12/2023',
    },
    {
      clientId: '12',
      clientFullName: 'Fname Lname',
      ssn: '2434324324234',
      dob: '23/12/2023',
    },
    {
      clientId: '12',
      clientFullName: 'Fname Lname',
      ssn: '2434324324234',
      dob: '23/12/2023',
    },
    {
      clientId: '12',
      clientFullName: 'Fname Lname',
      ssn: '2434324324234',
      dob: '23/12/2023',
    },
    {
      clientId: '12',
      clientFullName: 'Fname Lname',
      ssn: '2434324324234',
      dob: '23/12/2023',
    },
  ];
  inputConfirmationClicked!: boolean;
  selectedVendorRefundsList: any = [];
  refundNoteValueLength = 0
  @Output() modalCloseAddEditRefundFormModal = new EventEmitter();
  constructor(  private readonly financialVendorRefundFacade: FinancialVendorRefundFacade,
    private formBuilder: FormBuilder,) {
 
    }
    
    refundRXForm = this.formBuilder.group({
      //vp: [''],
     // VPSuffix: [''],
      warantNumber: ['', Validators.required],
      depositDate: ['', Validators.required],
      refundNote:[''],
    })
    ngOnInit(){
      this.initRefundForm()
    }
  addNewRefundRx() {
    debugger
    if (this.selectedRefundType == 'RX') {
      this.isRefundRxSubmitted = true;
      this.refundRXForm.markAsTouched();
      this.refundRXForm.markAsDirty();

      if (this.refundRXForm.invalid) {
        return;
      } else {
        const refundRxData = this.refundRXForm.value;
        this.financialVendorRefundFacade.addNewRefundRx(refundRxData).subscribe({
          next: (data: any) => {
            this.financialVendorRefundFacade.showLoader();
            this.financialVendorRefundFacade.showHideSnackBar(SnackBarNotificationType.SUCCESS,
              'Pharmacy Refund Added Successfuly')
          },
          error: (error: any) => {
            if (error) {
              this.financialVendorRefundFacade.showHideSnackBar(SnackBarNotificationType.ERROR, error);
              this.financialVendorRefundFacade.hideLoader();
            }
          }
        })

      }

    }

  }
  selectionChange(event: any){
    this.isConfirmationClicked = false
  }
  confirmationClicked (){
    this.inputConfirmationClicked = true;
  }
  selectDiffPayments(){
    this.isRefundGridClaimShow = true
    this.isConfirmationClicked = false;
    this.showHideServicesListForm();
  }
  closeAddEditRefundFormModalClicked(){
    this.modalCloseAddEditRefundFormModal.emit(true);  
  }
  loadVendorRefundProcessListGrid(event: any) {
    this.financialVendorRefundFacade.loadVendorRefundProcessListGrid();
  }
  loadClaimsListGrid(event: any) {
    this.financialVendorRefundFacade.loadClaimsListGrid();
  }
  loadPremiumsListGrid(event: any) {
    this.financialVendorRefundFacade.loadPremiumsListGrid();
  }
  loadClientClaimsListGrid(event: any) {
    this.financialVendorRefundFacade.loadClientClaimsListGrid();
  }
  loadPharmacyPaymentsListGrid(event: any) {
    this.financialVendorRefundFacade.loadPharmacyPaymentsListGrid();
  }
  loadClientBySearchText(clientSearchText: any) {
    if (!clientSearchText || clientSearchText.length == 0) {
      return
    }
    clientSearchText = clientSearchText.replace("/", "-");
    clientSearchText = clientSearchText.replace("/", "-");
    this.financialVendorRefundFacade.loadClientBySearchText(clientSearchText)
  }
  onClientValueChange(client: any) {
    if (client != undefined) {
      this.clientCaseEligibilityId = client.clientCaseEligibilityId;
      this.clientId = client.clientId;
      this.clientName = client.clientFullName;
      if (this.clientId != null && this.vendorId != null) {
        this.isRefundGridClaimShow = true;
      } 
        
      else{
        this.isRefundGridClaimShow = false;
      }
    }
  }
  showHideServicesListForm(){
    if(this.refundClaimForm.controls['selectedMedicalProvider'].value &&  this.refundClaimForm.controls['client'].value)
    {
      
      this.showServicesListForm = true;
    
    }
    else
    {
      
      this.showServicesListForm = false;
      this.isRefundGridClaimShow = false;
   
    }
  }
  searchPharmacy(searchText: any) {
    if (!searchText || searchText.length == 0) {
      return;
    }
    this.financialVendorRefundFacade.loadPharmacyBySearchText(searchText);
  }
  onProviderValueChange($event: any) {
    this.vendorId = $event.vendorId;
    this.vendorName = $event.vendorName;
    this.providerTin = $event;
    if (this.clientId != null && this.vendorId != null){
      this.isRefundGridClaimShow = true;
    } 
    else{
      this.isRefundGridClaimShow = false;
    }
  }
  initRefundForm() {
    this.refundClaimForm = this.formBuilder.group({
      medicalProvider: [this.selectedMedicalProvider, Validators.required],
      client: [this.selectedClient, Validators.required],
    });
  }

  getSelectedVendorRefundsList(listData : any){
     this.selectedVendorRefundsList = Array.from(new Set(listData.map((item:any)=> 
    JSON.stringify(
      {
        indexCode : item.indexCode, 
        pcaCode : item.pcaCode,
        grantNo:"xx-xxxxx", 
        warrantNbr : item.warrantNbr, 
        paymentStatusCode : item.paymentStatusCode,
        prescriptionsDetail : []
      })))).map((str:any) => JSON.parse(str));
      listData = listData.map((obj : any) => 
        ({
          ...obj,
          qtyRefunded : null,
          qtyRefundedValid : false,
          daySupplyRefunded : null,
          daySupplyRefundedValid : false,
          refundedAmount : null,
          refundedAmountValid : false
        }));
      this.selectedVendorRefundsList.forEach((element : any) => {
        element.prescriptionsDetail = listData.filter(
          (x : any)=> 
          x.indexCode == element.indexCode 
          && x.pcaCode == element.pcaCode
          && x.warrantNbr == element.warrantNbr
          && x.paymentStatusCode == element.paymentStatusCode
          )
      });
    this.isConfirmationClicked = true;
  }
  
  ngDirtyInValid(dataItem: any, control: any, tblIndex: any, rowIndex: any) {
    let isTouched = document.getElementById(`${control}${tblIndex}-${rowIndex}`)?.classList.contains('ng-touched')
    let inValid = false;
    if (control === 'qtyRefunded') {
      inValid = isTouched == true && !(dataItem.qtyRefunded != null && dataItem.qtyRefunded > 0);
      dataItem.qtyRefundedValid = !inValid;
    }
    if (control === 'daySupplyRefunded') {
      inValid = isTouched == true && !(dataItem.daySupplyRefunded != null && dataItem.daySupplyRefunded > 0);
      dataItem.daySupplyRefundedValid = !inValid;
    }
    if (control === 'refundedAmount') {
      inValid = isTouched == true && !(dataItem.refundedAmount != null && dataItem.refundedAmount > 0);
      dataItem.refundedAmountValid = !inValid;
    }
    if (inValid) {
      document.getElementById(`${control}${tblIndex}-${rowIndex}`)?.classList.remove('ng-valid');
      document.getElementById(`${control}${tblIndex}-${rowIndex}`)?.classList.add('ng-invalid');
      document.getElementById(`${control}${tblIndex}-${rowIndex}`)?.classList.add('ng-dirty');
    }
    else {
      document.getElementById(`${control}${tblIndex}-${rowIndex}`)?.classList.remove('ng-invalid');
      document.getElementById(`${control}${tblIndex}-${rowIndex}`)?.classList.remove('ng-dirty');
      document.getElementById(`${control}${tblIndex}-${rowIndex}`)?.classList.add('ng-valid');
    }
    return 'ng-dirty ng-invalid';
  }
  onRefundNoteValueChange(event: any) {
    this.refundNoteValueLength = event.length
  }
  onSpotsPaymentChange(check: any) {
    this.isSpotsPayment = check.currentTarget.checked;
  }

}