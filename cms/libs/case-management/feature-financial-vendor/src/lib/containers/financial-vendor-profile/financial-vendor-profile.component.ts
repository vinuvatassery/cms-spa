import { ChangeDetectionStrategy, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContactFacade, DrugsFacade, FinancialVendorFacade, FinancialVendorProviderTabCode, InvoiceFacade } from '@cms/case-management/domain';
import { TodoFacade } from '@cms/productivity-tools/domain';
import { FinancialVendorTypeCode } from '@cms/shared/ui-common';
import { UIFormStyle, UITabStripScroll } from '@cms/shared/ui-tpa';
import { LovFacade, UserManagementFacade } from '@cms/system-config/domain';
import { DialogService } from '@progress/kendo-angular-dialog';
import { State } from '@progress/kendo-data-query';


@Component({
  selector: 'cms-financial-vendor-profile',
  templateUrl: './financial-vendor-profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialVendorProfileComponent implements OnInit {
  eventAttachmentTypeLov$ = this.lovFacade.eventAttachmentTypeLov$;
  drugDataLoader$ = this.drugsFacade.drugDataLoader$;
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
  removeprovider$ = this.financialVendorFacade.removeprovider$
  addProviderNew$ = this.financialVendorFacade.addProviderNew$
  vendorProfileSpecialHandling$ = this.financialVendorFacade.vendorProfileSpecialHandling$
  providerList$ = this.financialVendorFacade.providerList$
  providerLispageSizes = this.financialVendorFacade.gridPageSizes;
  providerLissortValue = this.financialVendorFacade.sortValue;
  providerLissortType = this.financialVendorFacade.sortType;
  providerLissort = this.financialVendorFacade.sort;
  financialClinicProviderProfile$ = this.financialVendorFacade.financialClinicProviderProfileSubject;
  filter: any = [];
  isClinicalVendor = false;
  vendorName: any;


  @ViewChild('providerDetailsTemplate', { read: TemplateRef })
  providerDetailsTemplate!: TemplateRef<any>;

  providerDetailsDialog: any

 ddlStates$ = this.contactFacade.ddlStates$;
 isEditForm = false
 vendorProfilePanel$ = this.financialVendorFacade.providePanelSubject$;
  paymentMethodCode$ = this.lovFacade.paymentMethodType$;

  updateProviderPanelSubject$ = this.financialVendorFacade.updateProviderPanelSubject$;
  hasDrugCreateUpdatePermission = false;
  vendorProfileId: any;
  alertList$ = this.todoFacade.todoGrid$;

  constructor(
    private activeRoute: ActivatedRoute,
    private financialVendorFacade: FinancialVendorFacade,
    private readonly drugsFacade: DrugsFacade,
    private readonly invoiceFacade: InvoiceFacade,
    private readonly userManagementFacade: UserManagementFacade,
    private readonly contactFacade: ContactFacade,
    private dialogService: DialogService,
    private lovFacade: LovFacade,
    public todoFacade: TodoFacade,
  ) { }

  ngOnInit(): void {
    this.loadQueryParams();
    this.state = {
      skip: this.gridSkipCount,
      take: this.pageSizes[0]?.value
    };
    this.loadDrugsListGrid();
    this.loadVendorDetailList();
    this.setVendorTypeCode('');
    this.lovFacade.getEventAttachmentTypeLov();
    this.hasDrugCreateUpdatePermission = this.userManagementFacade.hasPermission(['Service_Provider_Drug_Create_Update']);

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
    if (this.vendorId && this.tabCode) {
      this.loadFinancialVendorProfile(this.vendorId)
    }
  }

  setVendorTypeCode(vendorProfile: any) {
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
    this.isClinicalVendor = (vendorProfile.vendorTypeCode == FinancialVendorTypeCode.DentalClinic) ||
      (vendorProfile.vendorTypeCode == FinancialVendorTypeCode.MedicalClinic)
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

  loadFinancialVendorProfile(vendorId: string) {
    this.financialVendorFacade.getVendorProfile(vendorId, this.tabCode)
    this.vendorProfile$.subscribe(vendorProfile => {
      this.vendorName = vendorProfile.vendorName
      this.setVendorTypeCode(vendorProfile)
    })
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
      this.filter ?? []
    );
  }

  loadDrugList(event: any) {
    this.state = {
      skip: event.skipCount,
      take: event.pageSize
    };
    this.sortValue = event.sortColumn;
    this.sortType = event.sortType;
    this.filter = event.filters;
    this.loadDrugsListGrid();
  }

  loadVendorDetailList() {
    this.financialVendorFacade.loadVendorList(this.vendorTypeCode);
  }

  loadProviderList(data: any) {
    this.financialVendorFacade.getProviderList(data)
  }
  removeProvider(providerId: any) {
    this.financialVendorFacade.removeProvider(providerId);
  }

  loadInvoiceServices(event: any) {
    this.invoiceFacade.loadPaymentRequestServices(event.dataItem, this.vendorId, this.tabCode)
  }
  onProviderNameClick(event:any){
    this.vendorProfileId = event;
    this.providerDetailsDialog = this.dialogService.open({
      content: this.providerDetailsTemplate,
      animation:{
        direction: 'left',
        type: 'slide',
      },
      cssClass: 'app-c-modal app-c-modal-np app-c-modal-right-side',
    });

  }

  onEditProviderProfileClick() {
    this.contactFacade.loadDdlStates();
    this.lovFacade.getPaymentMethodLov();
  }
  updateProviderProfile(event: any) {
    console.log(event);
    this.financialVendorFacade.updateProviderPanel(event);
  }
  getProviderPanel(event: any) {
    this.financialVendorFacade.getProviderPanelByVendorId(this.vendorProfileId);
  }
  onCloseViewProviderDetailClicked(result: any) {
    if (result) {
      this.providerDetailsDialog.close();
    }
  }

  updateRecentlyViewedEvent(vendorId:any){
    this.financialVendorFacade.addVendorRecentlyViewed(vendorId);
  }

  getVendorAlertList(event:any,alertType:any){
    this.todoFacade.loadAlerts(event.gridDataRefinerValue,alertType.alertType);
  }
  onMarkAlertAsDone(event:any){
    this.todoFacade.markAlertAsDone(event);
  }
  onDeleteAlert(event:any){
    this.todoFacade.deleteAlert(event);
  }
}
