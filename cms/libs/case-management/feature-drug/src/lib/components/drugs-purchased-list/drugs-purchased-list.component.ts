import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { CaseFacade, DrugPharmacyFacade } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { ConfigurationProvider } from '@cms/shared/util-core';
import { LovFacade } from '@cms/system-config/domain';
import { FilterService } from '@progress/kendo-angular-grid';
import { IntlService } from '@progress/kendo-angular-intl';
import { CompositeFilterDescriptor } from '@progress/kendo-data-query';

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
  public formUiStyle : UIFormStyle = new UIFormStyle();
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  isReadOnly$=this.caseFacade.isCaseReadOnly$;
  isPermiumWithinLastTwelveMonthsData = true;
  dateFormat = this.configurationProvider.appSettings.dateFormat;


  filters = "";
  sortColumn = "";
  sortDir = "";
  columnsReordered = false;
  filteredBy = "";
  searchValue = "";
  isFiltered = false;
  addRemoveColumns="Default Columns";

  selectedColumn!: any;
  gridColumns : any ={
    pharmacyName : "Pharmacy",
    paymentMethodDesc : "Payment Method",
    rxNumber : "RX Number",
    prescriptionFillDate : "Fill Date",
    ndc: "NDC Code",
    brandName: "Brand Name",
    drugName: "Drug Name",
    payTypeDesc: "Payment Type",
    transType: "Transaction Type",
    amountPaid: "Amount Paid",
    qty: "Rx Quantity",
    reversalDate: "Reversal Date",
    clientGroup: "Client Group",
    rxType: "RX Type",
    rxDaysSupply: "RX Days Supply",
    pcaCode: "PCA Code",
    objectCodeDesc: "Object Code",
    paymentStatusDesc: "Payment Status",
    warrantNo: "Warrant Number",
    entryDate: "Entry Date",
    creatorId: "By",
  }

  //lov filters
  selectedPaymentStatus: string | null = null;
  selectedPaymentMethod: string | null = null;
  selectedPaymentType: string | null = null;
  paymentMethodType$ = this.lovFacade.paymentMethodType$;
  paymentStatus$ = this.lovFacade.paymentStatus$;
  paymentType$ = this.lovFacade.paymentType$;
  paymentTypes: any = [];
  paymentMethodTypes: any = [];
  paymentStauses: any = [];

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
  constructor(private readonly drugPharmacyFacade: DrugPharmacyFacade, private caseFacade: CaseFacade,
    private readonly  cdr :ChangeDetectorRef,
    public readonly  intl: IntlService,
    private readonly configurationProvider: ConfigurationProvider,
    private readonly lovFacade: LovFacade) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.getLovs()
    this.defaultGridState();
    this.loadDrugsPurchased();
  }

  /** Private methods **/

  getLovs(){
    this.getPaymentMethodLov();
    this.getPaymentStatusLov();
    this.getPaymentTypeCodeLov();
  }

  private getPaymentTypeCodeLov() {
    this.lovFacade.getPaymentTypeLov();
    this.paymentType$.subscribe({
      next: (data: any) => {
        data.forEach((item: any) => {
          item.lovDesc = item.lovDesc.toUpperCase();
        });
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
        data.forEach((item: any) => {
          item.lovDesc = item.lovDesc.toUpperCase();
        });
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
        data.forEach((item: any) => {
          item.lovDesc = item.lovDesc.toUpperCase();
        });
        this.paymentStauses = data.sort(
          (value1: any, value2: any) => value1.sequenceNbr - value2.sequenceNbr
        );
      },
    });
  }

  private loadDrugsPurchased(
    ) {
      this.drugPharmacyFacade.getDrugPurchasedList(this.clientId,this.state.skip,this.state.take,this.sortValue,this.sortType,this.filters,this.isPermiumWithinLastTwelveMonthsData);
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
    this.filters = JSON.stringify(stateData.filter?.filters)
    this.state = stateData;
    this.setGridState(stateData);
    this.loadDrugsPurchased();
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

  setToDefault()
  {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
      selectedColumn: 'ALL',
      columnName: '',
      searchValue: ''
      };
    this.sortDir = this.sort[0]?.dir === 'asc'? 'Ascending': "";
    this.sortDir = this.sort[0]?.dir === 'desc'? 'Descending': "";
    this.filters = "";
    this.selectedColumn = "ALL";
    this.searchValue = "";
    this.isFiltered = false;
    this.columnsReordered = false;
    this.loadDrugsPurchased();
  }

  defaultGridState(){
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
      filters:{logic:'and',filters:[]},
      selectedColumn: 'ALL',
      columnName: '',
      searchValue: ''
      };
  }

  public setGridState(stateData: any): void {
    this.state = stateData;

    const filters = stateData.filter?.filters ?? [];

    for (const val of filters) {
      if (val.field === 'prescriptionFillDate' || val.field === 'entryDate' || val.field === 'reversalDate') {
        this.intl.formatDate(val.value, this.dateFormat);
      }
    }
    const filterList = this.state?.filter?.filters ?? [];
    this.filters = JSON.stringify(filterList);
    this.filteredBy = filterList.toString();

    if (filters.length > 0) {
      const filterListData = filters.map((filter:any) => this.gridColumns[filter?.filters[0]?.field]);
      this.isFiltered = true;
      this.filteredBy = filterListData.toString();
      this.cdr.detectChanges();
    }
    else {
      this.isFiltered = false;
    }

    this.sort = stateData.sort;
    this.sortValue = stateData.sort[0]?.field ?? "";
    this.sortType = stateData.sort[0]?.dir ?? "";
    this.state = stateData;
    this.sortColumn = this.gridColumns[stateData.sort[0]?.field];
    this.sortDir = "";
    if(this.sort[0]?.dir === 'asc'){
      this.sortDir = 'Ascending';
    }
    if(this.sort[0]?.dir === 'desc'){
      this.sortDir = 'Descending';
    }
    this.loadDrugsPurchased();
  }
  public onClickLoadDrugsPurchasedData()
  {
    this.loadDrugsPurchased();
  }
}
