import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';
import { CaseFacade, DrugPharmacyFacade, DrugsFacade, FinancialPharmacyClaimsFacade, FinancialVendorFacade } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { ConfigurationProvider } from '@cms/shared/util-core';
import { LovFacade } from '@cms/system-config/domain';
import { DialogService } from '@progress/kendo-angular-dialog';
import { FilterService } from '@progress/kendo-angular-grid';
import { IntlService } from '@progress/kendo-angular-intl';
import { CompositeFilterDescriptor } from '@progress/kendo-data-query';
import { Subscription, first } from 'rxjs';

@Component({
  selector: 'case-management-drugs-purchased-list',
  templateUrl: './drugs-purchased-list.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class DrugsPurchasedListComponent implements OnInit {

  @Input() clientId: any;
  
  /** Public properties **/
  drugPurchases$ = this.drugPharmacyFacade.drugPurchases$;
  isOpenChangePriorityClicked = false;
  isOpenPharmacyClicked = false;
  isEditPharmacyListClicked = false;
  selectedPharmacy!: any;
  public sortValue = this.drugPharmacyFacade.sortValue;
  public sortType = this.drugPharmacyFacade.sortType;
  public pageSizes = this.drugPharmacyFacade.gridPageSizes;
  public gridSkipCount = this.drugPharmacyFacade.skipCount;
  public sort = this.drugPharmacyFacade.sort;
  public state!: any;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  isReadOnly$ = this.caseFacade.isCaseReadOnly$;
  isPermiumWithinLastTwelveMonthsData = true;
  dateFormat = this.configurationProvider.appSettings.dateFormat;

  filters = '';
  sortColumn = '';
  sortDir = '';
  columnsReordered = false;
  filteredBy = '';
  searchValue = '';
  isFiltered = false;
  addRemoveColumns = 'Default Columns';

  selectedColumn!: any;
  gridColumns: any = {
    pharmacyName: 'Pharmacy Name',
    paymentMethodDesc: 'Payment Method',
    rxNumber: 'RX Number',
    prescriptionFillDate: 'Fill Date',
    ndc: 'NDC Code',
    brandName: 'Brand Name',
    drugName: 'Drug Name',
    payTypeDesc: 'Payment Type',
    transTypeDesc: 'Transaction Type',
    amountPaid: 'Amount Paid',
    qty: 'Rx Quantity',
    clientGroup: 'Client Group',
    rxType: 'RX Type',
    rxDaysSupply: 'RX Days Supply',
    pcaCode: 'PCA Code',
    objectCode: 'Object Code',
    paymentStatusDesc: 'Payment Status',
    warrantNo: 'Warrant Number',
    reversalDate: 'Reversal Date',
    entryDate: 'Entry Date',
    creatorId: 'By',
  };

  //lov filters
  selectedPaymentStatus: string | null = null;
  selectedPaymentMethod: string | null = null;
  selectedPaymentType: string | null = null;
  selectedPaymentRequestType: string | null = null;
  paymentMethodType$ = this.lovFacade.paymentMethodType$;
  paymentStatus$ = this.lovFacade.paymentStatus$;
  paymentType$ = this.lovFacade.paymentRequestType$;
  paymentRequestType$ = this.lovFacade.paymentRequestsType$;
  paymentMethodTypes: any = [];
  paymentStauses: any = [];
  paymentTypes: any = [];
  paymentRequestTypes: any = [];
  deliveryMethodLov$ = this.lovFacade.deliveryMethodLov$;

  addPharmacyClaim$ = this.financialPharmacyClaimsFacade.addPharmacyClaim$;
  editPharmacyClaim$ = this.financialPharmacyClaimsFacade.editPharmacyClaim$;
  getPharmacyClaim$ = this.financialPharmacyClaimsFacade.getPharmacyClaim$;
  searchPharmacies$ = this.financialPharmacyClaimsFacade.searchPharmacies$;
  searchClients$ = this.financialPharmacyClaimsFacade.searchClients$;
  searchDrugs$ = this.financialPharmacyClaimsFacade.searchDrugs$;
  searchPharmaciesLoader$ = this.financialPharmacyClaimsFacade.searchPharmaciesLoader$;
  searchClientLoader$ = this.financialPharmacyClaimsFacade.searchClientLoader$;
  searchDrugsLoader$ = this.financialPharmacyClaimsFacade.searchDrugsLoader$;

  addDrug$ = this.drugsFacade.addDrug$
  manufacturersLov$ = this.financialVendorFacade.manufacturerList$;
  sortValueRecentClaimList = this.financialPharmacyClaimsFacade.sortValueRecentClaimList;
  sortRecentClaimList = this.financialPharmacyClaimsFacade.sortRecentClaimList;
  recentClaimsGridLists$ = this.financialPharmacyClaimsFacade.recentClaimsGridLists$;

  /** Input Properties**/
  @Input() clientCaseEligibilityId:any

    /** Output Properties**/
  @Output() addPharmacyClaimEvent = new EventEmitter<any>();
  @Output() updatePharmacyClaimEvent = new EventEmitter<any>();
  @Output() getPharmacyClaimEvent = new EventEmitter<any>();
  @Output() searchPharmaciesEvent = new EventEmitter<any>();
  @Output() searchClientsEvent = new EventEmitter<any>();
  @Output() searchDrugEvent = new EventEmitter<any>();
  @Output() getCoPaymentRequestTypeLovEvent = new EventEmitter<any>();
  @Output() getDrugUnitTypeLovEvent = new EventEmitter<any>();
  
  isAddEditClaimMoreClose = false;

  private addEditClaimsFormDialog: any;
  pharmacyPurchaseProfilePhotoSubscription = new Subscription();
  pharmacyPurchaseProfile$ = this.drugPharmacyFacade.pharmacyPurchaseProfileSubject;
  pharmacyRecentClaimsProfilePhoto$ = this.financialPharmacyClaimsFacade.pharmacyRecentClaimsProfilePhoto$;
  clientCustomName : any
  fromDrugPurchased:any ;

  public actions = [
    {
      buttonType: 'btn-h-primary',
      text: 'Edit  ',
      icon: 'edit',
      click: (): void => {
        this.onEditPharmacyClicked(this.actions);
      },
    },
    {
      buttonType: 'btn-h-primary',
      text: 'Change Priority',
      icon: 'format_line_spacing',
      click: (): void => {
        this.onOpenChangePriorityClicked();
      },
    },

    {
      buttonType: 'btn-h-danger',
      text: 'Remove  ',
      icon: 'delete',
      click: (): void => {
        console.log('Remove Pharmacy');
      },
    },
  ];

  /** Constructor **/
  constructor(
    private readonly drugPharmacyFacade: DrugPharmacyFacade,
    private caseFacade: CaseFacade,
    private readonly cdr: ChangeDetectorRef,
    public readonly intl: IntlService,
    private readonly configurationProvider: ConfigurationProvider,
    private readonly lovFacade: LovFacade,
    private readonly financialPharmacyClaimsFacade: FinancialPharmacyClaimsFacade,
    private readonly drugsFacade: DrugsFacade,
    private readonly financialVendorFacade: FinancialVendorFacade,
    private dialogService: DialogService,
  ) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.clientCustomName = this.caseFacade.clientCustomName;
    this.fromDrugPurchased = true;
    this.getLovs();
    this.defaultGridState();
    this.loadDrugsPurchased();
  }

  /** Private methods **/

  getLovs() {
    this.getPaymentMethodLov();
    this.getPaymentStatusLov();
    this.getPaymentTypeCodeLov();
    this.getPaymentRequestTypeCodeLov();
    this.lovFacade.getDeliveryMethodLovs();
  }

  private getPaymentTypeCodeLov() {
    this.lovFacade.getCoPaymentRequestTypeLov();
    this.paymentType$.subscribe({
      next: (data: any) => {
        this.paymentTypes = data.sort(
          (value1: any, value2: any) => value1.sequenceNbr - value2.sequenceNbr
        );
      },
    });
  }

  private getPaymentMethodLov() {
    this.lovFacade.getPaymentMethodLov();
    this.paymentMethodType$.subscribe({
      next: (data: any) => {
        this.paymentMethodTypes = data.sort(
          (value1: any, value2: any) => value1.sequenceNbr - value2.sequenceNbr
        );
      },
    });
  }

  private getPaymentStatusLov() {
    this.lovFacade.getPaymentStatusLov();
    this.paymentStatus$.subscribe({
      next: (data: any) => {
        this.paymentStauses = data.sort(
          (value1: any, value2: any) => value1.sequenceNbr - value2.sequenceNbr
        );
      },
    });
  }

  private getPaymentRequestTypeCodeLov() {
    this.lovFacade.getPaymentRequestTypeLov();
    this.paymentRequestType$.subscribe({
      next: (data: any) => {
        this.paymentRequestTypes = data.sort(
          (value1: any, value2: any) => value1.sequenceNbr - value2.sequenceNbr
        );
      },
    });
  }

  private loadDrugsPurchased() {
    this.drugPharmacyFacade.getDrugPurchasedList(
      this.clientId,
      this.state.skip,
      this.state.take,
      this.sortValue,
      this.sortType,
      this.filters,
      this.isPermiumWithinLastTwelveMonthsData
    );
  }

  /** Internal event methods **/
  onOpenPharmacyClicked() {
    this.isOpenPharmacyClicked = true;
  }

  onEditPharmacyClicked(pharmacy: any) {
    this.isEditPharmacyListClicked = true;
    this.isOpenPharmacyClicked = true;
    this.selectedPharmacy = pharmacy;
  }

  onOpenChangePriorityClicked() {
    this.isOpenChangePriorityClicked = true;
  }

  /** External event methods **/
  handleCloseChangePriorityClikced() {
    this.isOpenChangePriorityClicked = false;
  }

  handleClosePharmacyClicked() {
    this.isOpenPharmacyClicked = false;
    this.isEditPharmacyListClicked = false;
  }
  pageselectionchange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadDrugsPurchased();
  }

  public dataStateChange(stateData: any): void {
    this.filters = JSON.stringify(stateData.filter?.filters);
    this.state = stateData;
    this.setGridState(stateData);
  }

  filterChange(filter: CompositeFilterDescriptor): void {
    this.filters = JSON.stringify(filter);
  }

  dropdownFilterChange(
    field: string,
    value: any,
    filterService: FilterService
  ): void {
    filterService.filter({
      filters: [
        {
          field: field,
          operator: 'eq',
          value: value,
        },
      ],
      logic: 'and',
    });
  }

  setToDefault() {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
      selectedColumn: 'ALL',
      columnName: '',
      searchValue: '',
    };
    this.sortDir = this.sort[0]?.dir === 'asc' ? 'Ascending' : '';
    this.sortDir = this.sort[0]?.dir === 'desc' ? 'Descending' : '';
    this.filters = '';
    this.selectedColumn = 'ALL';
    this.searchValue = '';
    this.isFiltered = false;
    this.columnsReordered = false;
    this.loadDrugsPurchased();
  }

  defaultGridState() {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
      filters: { logic: 'and', filters: [] },
      selectedColumn: 'ALL',
      columnName: '',
      searchValue: '',
    };
  }

  public setGridState(stateData: any): void {
    this.state = stateData;

    const filters = stateData.filter?.filters ?? [];

    for (const val of filters) {
      if (
        val.field === 'prescriptionFillDate' ||
        val.field === 'entryDate' ||
        val.field === 'reversalDate'
      ) {
        this.intl.formatDate(val.value, this.dateFormat);
      }
    }
    const filterList = this.state?.filter?.filters ?? [];
    this.filters = JSON.stringify(filterList);
    this.filteredBy = filterList.toString();

    if (filters.length > 0) {
      const filterListData = filters.map(
        (filter: any) => this.gridColumns[filter?.filters[0]?.field]
      );
      this.isFiltered = true;
      this.filteredBy = filterListData.toString();
      this.cdr.detectChanges();
    } else {
      this.isFiltered = false;
    }

    this.sort = stateData.sort;
    this.sortValue = stateData.sort[0]?.field ?? '';
    this.sortType = stateData.sort[0]?.dir ?? '';
    this.state = stateData;
    this.sortColumn = this.gridColumns[stateData.sort[0]?.field];
    this.sortDir = '';
    if (this.sort[0]?.dir === 'asc') {
      this.sortDir = 'Ascending';
    }
    if (this.sort[0]?.dir === 'desc') {
      this.sortDir = 'Descending';
    }
    this.loadDrugsPurchased();
  }
  public onClickLoadDrugsPurchasedData() {
    this.loadDrugsPurchased();
  }

  addPharmacyClaim(data: any) {
    this.addPharmacyClaimEvent.emit(data);
    this.addPharmacyClaim$.pipe(first((addResponse: any) => addResponse != null))
      .subscribe((addResponse: any) => {
        if (addResponse) {

          this.loadDrugsPurchased()
          this.modalCloseAddEditClaimsFormModal(true)
        }
      })
  }
  
  updatePharmacyClaim(data: any) {
    this.updatePharmacyClaimEvent.emit(data);
    this.editPharmacyClaim$.pipe(first((editResponse: any ) => editResponse != null))
    .subscribe((editResponse: any) =>
    {
      if(editResponse)
      {    
        this.loadDrugsPurchased();
        this.modalCloseAddEditClaimsFormModal(true)
      }

    })
  }

  searchPharmacies(searchText: any) {
    this.searchPharmaciesEvent.emit(searchText);
  }

  searchClients(searchText: any) {
    this.searchClientsEvent.emit(searchText);
  }
  searchDrug(searchText: string) {
    this.searchDrugEvent.emit(searchText);
  }

  getCoPaymentRequestTypeLov()
  {
    this.getCoPaymentRequestTypeLovEvent.emit();
  }

  getDrugUnitTypeLov()
  {
    this.getDrugUnitTypeLovEvent.emit();
  }

  onClickOpenAddEditClaimsFromModal(template: TemplateRef<unknown>,paymentRequestId : any): void {  
    if(paymentRequestId !== '00000000-0000-0000-0000-000000000000')  
    {
    this.getPharmacyClaimEvent.emit(paymentRequestId);
    }
    this.addEditClaimsFormDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-96full add_claims_modal',
    });
  }
  
  modalCloseAddEditClaimsFormModal(result: any) {
    if (result) {
      this.isAddEditClaimMoreClose = false;
      this.addEditClaimsFormDialog.close();
    }
  }

  addDrugEventHandler(event:any){
    this.drugsFacade.addDrugData(event);
  }

  searchClientsDataEventHandler(client:any){
    this.financialPharmacyClaimsFacade.searchClientsDataSubject.next(client);
  }

  searchPharmacyDataEventHandler(vendor:any){
    this.financialPharmacyClaimsFacade.searchPharmaciesDataSubject.next(vendor)
  }

  loadRecentClaimListEventHandler(data : any){
    this.financialPharmacyClaimsFacade.loadRecentClaimListGrid(data);
  }

}
