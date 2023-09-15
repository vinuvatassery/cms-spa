import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DrugsFacade, FinancialVendorFacade, FinancialVendorProviderTabCode, FinancialVendorTypeCode, ProviderFacade } from '@cms/case-management/domain';
import { UIFormStyle, UITabStripScroll } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';


@Component({
  selector: 'cms-financial-vendor-profile',
  templateUrl: './financial-vendor-profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialVendorProfileComponent implements OnInit {
  drugsData$ = this.drugsFacade.drugsData$;
  pageSizes = this.drugsFacade.gridPageSizes;
  sortValue = this.drugsFacade.sortValue;
  sortType = this.drugsFacade.sortType;
  sort = this.drugsFacade.sort;
  gridSkipCount = this.drugsFacade.skipCount;
  vendorDetails$ = this.financialVendorFacade.vendorDetails$;
  public state!: State;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  public uiTabStripScroll: UITabStripScroll = new UITabStripScroll();
  isShownEventLog = false;
  vendorId!: string;
  providerId!: string;
  tabCode!: string;
  vendorTypeCode!: string;
  profileInfoTitle = "info";
  addressGridView = [];
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  selectedVendorInfo$ = this.financialVendorFacade.selectedVendor$;
  vendorProfile$ = this.financialVendorFacade.vendorProfile$
  vendorProfileSpecialHandling$ = this.financialVendorFacade.vendorProfileSpecialHandling$
  filters:any=[];
   providerList$ = this.financialVendorFacade.providerList$
   providerLispageSizes = this.financialVendorFacade.gridPageSizes;
   providerLissortValue = this.financialVendorFacade.sortValue;
   providerLissortType = this.financialVendorFacade.sortType;
   providerLissort = this.financialVendorFacade.sort;
  
  constructor(private activeRoute: ActivatedRoute, private providerFacade: ProviderFacade,private financialVendorFacade : FinancialVendorFacade,
              private readonly drugsFacade: DrugsFacade) {}

  ngOnInit(): void {
    this.loadQueryParams();
    this.state = {
      skip: this.gridSkipCount,
      take: this.pageSizes[0]?.value
    };
    this.loadDrugsListGrid();
    this.loadVendorDetailList();
  }

  get financeManagementTabs(): typeof FinancialVendorProviderTabCode {
    return FinancialVendorProviderTabCode;
  }

  public get vendorTypes(): typeof FinancialVendorTypeCode {
    return FinancialVendorTypeCode;
  }

  /** Private properties **/
  loadQueryParams() {
    this.vendorId = this.activeRoute.snapshot.queryParams['v_id'];
    this.providerId = this.activeRoute.snapshot.queryParams['prv_id'];
    this.tabCode = this.activeRoute.snapshot.queryParams['tab_code'];

    this.loadVendorInfo();
    if(this.vendorId && this.tabCode)
    {
      this.loadFinancialVendorProfile(this.vendorId)
    }

    switch (this.tabCode) {
      case FinancialVendorProviderTabCode.Manufacturers:
        this.vendorTypeCode = FinancialVendorTypeCode.Manufacturers
        this.profileInfoTitle = 'Manufacturer Info';
        break;
      case FinancialVendorProviderTabCode.InsuranceVendors:
        this.vendorTypeCode = FinancialVendorTypeCode.InsuranceVendors
        this.profileInfoTitle = 'Vendor Info';
        break;
      case FinancialVendorProviderTabCode.MedicalProvider:
        this.vendorTypeCode = FinancialVendorTypeCode.MedicalProviders
        this.profileInfoTitle = 'Provider Info';
        break;
      case FinancialVendorProviderTabCode.DentalProvider:
        this.vendorTypeCode = FinancialVendorTypeCode.DentalProviders
        this.profileInfoTitle = 'Provider Info';
        break;
      case FinancialVendorProviderTabCode.Pharmacy:
        this.vendorTypeCode = FinancialVendorTypeCode.Pharmacy
        this.profileInfoTitle = 'Pharmacy Info';
        break;
    }
  }

  loadVendorInfo() {
    this.financialVendorFacade.getVendorDetails(this.vendorId);
  }

  handleShowEventLogClicked() {
    this.isShownEventLog = !this.isShownEventLog;

  }
  loadSpecialHandling() {
    this.financialVendorFacade.getVendorProfileSpecialHandling(this.vendorId);
  }
  loadFinancialVendorProfile(vendorId : string)
  {
    this.financialVendorFacade.getVendorProfile(vendorId,this.tabCode)
  }

  onVendorEditSuccess(status: boolean) {
    if (status) {
      this.loadVendorInfo();
      this.loadFinancialVendorProfile(this.vendorId);
    }
  }

  loadDrugsListGrid() {
    this.drugsFacade.loadDrugsListGrid(
      this.vendorId ?? "",
      this.state.skip ?? 0,
      this.state.take ?? 0,
      this.sortValue,
      this.sortType,
      this.filters ?? []
    );
  }

  loadDrugList(event: any) {
    this.state = {
      skip: event.skipCount,
      take: event.pageSize
    };
    this.sortValue = event.sortColumn;
    this.sortType = event.sortType;
    this.filters = event.filters;
    this.loadDrugsListGrid();
  }

  loadVendorDetailList(){
    this.financialVendorFacade.loadVendorList(this.vendorTypeCode);
  }

  loadProviderList(data :any){
    this.financialVendorFacade.getProviderList(data)
  }
  removeProvider(providerId: any) {
    debugger;
   this.providerFacade.removeProvider(providerId);
  }
}
