import {
  ChangeDetectionStrategy,
  Component,
  Input,
  SimpleChanges, OnChanges,  ViewEncapsulation,
  ChangeDetectorRef
} from '@angular/core';
import { VendorContactsFacade, ContactResponse } from '@cms/case-management/domain';
import { ConfigurationProvider, LoaderService} from '@cms/shared/util-core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { CompositeFilterDescriptor } from '@progress/kendo-data-query';
import { IntlService } from '@progress/kendo-angular-intl';
@Component({
  selector: 'cms-contact-address-list',
  templateUrl: './contact-address-list.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactAddressListComponent implements OnChanges {
  contactResponse: ContactResponse[] = [];
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  isContactAddressDeactivateShow = false;
  isContactAddressDeleteShow = false;
  isContactAddressDetailShow = false;
  isContactsDetailShow = false;
  public formUiStyle : UIFormStyle = new UIFormStyle(); 
  VendorContactId:any;
  VendorContactAddressId: string="";
  @Input() VendorAddressId: any;
  public state!: any;
  filters = "";
  sortColumn = "";
  sortDir = "";
  columnsReordered = false;
  filteredBy = "";
  searchValue = "";
  isFiltered = false;
  public sortValue = this.vendocontactsFacade.sortValue;
  public sortType = this.vendocontactsFacade.sortType;
  public pageSizes = this.vendocontactsFacade.gridPageSizes;
  public gridSkipCount = this.vendocontactsFacade.skipCount;
  public sort = this.vendocontactsFacade.sort;
  selectedColumn!: any;
  dateFormat = this.configurationProvider.appSettings.dateFormat;
  gridColumns : any ={
    prescriptionFillDate : "Fill Date",
    pharmacyName : "Pharmacy",
    drugName: "Drug",
    brandName: "Brand Name",
    ndc: "NDC",
    qty: "Qty",
    reversalDate: "Reversal Date",
    clientGroup: "Client Group",
    payType: "Pay Type",
    transType: "Trans Type",
    payAmount: "Pay Amount",
    ingrdCost: "Ingrd Cost",
    phmFee: "Pfm Fee",
    totalDrug: "Total Drug",
    pbmFee: "PBM Fee",
    revenue: "Revenue",
    uc: "U & c",
    entryDate: "Entry Date",
    createdId: "By"
  }
  showLoader() {
    this.loaderService.show();
  }
  hideLoader() {
    this.loaderService.hide();
  }

  public contactAddressActions = [
    {
      buttonType: 'btn-h-primary',
      text: 'Edit Contact',
      icon: 'edit',
      click: (data: any): void => {
        if (data?.vendorContactId) {
          this.VendorContactId = data;
          this.clickOpenAddEditContactAddressDetails();
        }
      },
    },
    {
      buttonType: 'btn-h-primary',
      text: 'Deactivate Contact',
      icon: 'block',
      click: (data: any): void => {
        if (data?.vendorContactId) {
          this.VendorContactId = data?.vendorContactId;
          this.clickOpenDeactivateContactAddressDetails();
        }

      },
    },
    {
      buttonType: 'btn-h-danger',
      text: 'Delete Contact',
      icon: 'delete',
      click: (data: any): void => {
        if (data?.vendorContactId) {
          this.VendorContactId = data?.vendorContactId;
          this.clickOpenDeleteContactAddressDetails();
        }
      },
    },
  ];
  contacts$ =this.vendocontactsFacade.contacts$;
  constructor(private readonly vendocontactsFacade: VendorContactsFacade, private cd: ChangeDetectorRef, private readonly loaderService: LoaderService,    public readonly  intl: IntlService,
    private readonly configurationProvider: ConfigurationProvider) { }

  ngOnChanges(changes: SimpleChanges) { 
    this.defaultGridState();
    this.vendocontactsFacade.loadcontacts(this.VendorAddressId,
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType,
      this.filters
      );    
  
  }
  clickOpenAddEditContactAddressDetails() {
    this.isContactsDetailShow = true;
  }

  clickOpenDeactivateContactAddressDetails() {
    this.isContactAddressDeactivateShow = true;
  }

  clickOpenDeleteContactAddressDetails() {
    this.isContactAddressDeleteShow = true;
  }

  clickCloseDeleteContactAddress() {
    this.isContactAddressDeleteShow = false;
  }

  clickCloseDeactivateContactAddress() {
    this.isContactAddressDeactivateShow = false;
  }

  onCancelPopup(isCancel: any) {
    if (isCancel) {
      this.vendocontactsFacade.loadcontacts(this.VendorAddressId,
        this.state?.skip ?? 0,
        this.state?.take ?? 0,
        this.sortValue,
        this.sortType,
        this.filters
        ); 
      this.clickCloseDeleteContactAddress();
    }
  }

  onDeactiveCancel(isCancel: any) {
    if (isCancel) {
      this.vendocontactsFacade.loadcontacts(this.VendorAddressId,
        this.state?.skip ?? 0,
        this.state?.take ?? 0,
        this.sortValue,
        this.sortType,
        this.filters
        ); 
      this.clickCloseDeactivateContactAddress();

    }
  }

  clickCloseAddEditContactsDetails() {
    this.isContactsDetailShow = false;
  }
  pageselectionchange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.vendocontactsFacade.loadcontacts(this.VendorAddressId,
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType,
      this.filters
      ); 
  }

  public dataStateChange(stateData: any): void {
    this.filters = JSON.stringify(stateData.filter?.filters)
    this.state = stateData;
    this.setGridState(stateData);
    this.vendocontactsFacade.loadcontacts(this.VendorAddressId,
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType,
      this.filters
      ); 
  }
   filterChange(filter: CompositeFilterDescriptor): void {
    this.filters = JSON.stringify(filter);
  }
  setToDefault()
  {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
      sortType:this.sortType,
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
  }

  defaultGridState(){
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
      sortType:this.sortType,
      filters:{logic:'and',filters:[]},
      selectedColumn: 'ALL',
      columnName: '',
      searchValue: ''
      };
  }
contactUpdated(res:boolean)
{
  debugger
if(res)
{
  this.vendocontactsFacade.loadcontacts(this.VendorAddressId,
    this.state?.skip ?? 0,
    this.state?.take ?? 0,
    this.sortValue,
    this.sortType,
    this.filters
    );
}
}
  public setGridState(stateData: any): void {
    this.state = stateData;

    const filters = stateData.filter?.filters ?? [];

    for (let val of filters) {
      if (val.field === 'prescriptionFillDate' || val.field === 'entryDate') {
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
      this.cd.detectChanges();
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
  }

}
