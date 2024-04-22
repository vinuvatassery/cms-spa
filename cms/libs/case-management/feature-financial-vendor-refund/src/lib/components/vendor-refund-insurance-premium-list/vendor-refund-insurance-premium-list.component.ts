/** Angular **/
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  FinancialClaimsFacade,
  FinancialVendorProviderTabCode,
  FinancialVendorRefundFacade,
} from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { LovFacade } from '@cms/system-config/domain';
import { DialogService } from '@progress/kendo-angular-dialog';
import {
  FilterService, 
  GridComponent, 
  GridDataResult, 
  SelectableMode, 
  SelectableSettings
} from '@progress/kendo-angular-grid';
import {
  CompositeFilterDescriptor,
  State,
  filterBy,
} from '@progress/kendo-data-query';
import { Subject, Subscription } from 'rxjs';

@Component({
  selector: 'cms-vendor-refund-insurance-premium-list',
  templateUrl: './vendor-refund-insurance-premium-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VendorRefundInsurancePremiumListComponent
  implements OnInit, OnChanges
{
  @ViewChild('filterResetConfirmationDialogTemplate', { read: TemplateRef })
  filterResetConfirmationDialogTemplate!: TemplateRef<any>;

  @ViewChild(GridComponent) grid!: GridComponent;

  public formUiStyle: UIFormStyle = new UIFormStyle();
  isClientClaimsLoaderShow = false;
  /** Constructor **/
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  public state!: State;
  @Input() vendorAddressId: any;
  @Input() clientId: any;
  @Output() loadVendorRefundProcessListEvent = new EventEmitter<any>();
  @Input() isEdit = false;
  @Input() editPaymentRequestId: any;
  @Input() clientClaimsListData$: any;
  @Output() loadClientClaimsListEvent = new EventEmitter<any>();
  @Output() claimsCount = new EventEmitter<any>();
  @Output() selectedClaimsChangeEvent = new EventEmitter<any>();
  @Output() onProviderNameClickEvent = new EventEmitter<any>();
  paymentStatusType: any;
  paymentMethod: any;
  public selectedClaims: any[] = [];
  paymentStatusCode = null;
  sortColumn = 'clientId';
  sortDir = 'Ascending';
  columnsReordered = false;
  filteredBy = '';
  searchValue = '';
  isFiltered = false;
  filter!: any;
  selectedColumn!: any;
  gridDataResult!: GridDataResult;
  selectedInsuranceClaims: any[] = [];
  gridClientClaimsDataSubject = new Subject<any>();
  gridClientClaimsData$ = this.gridClientClaimsDataSubject.asObservable();
  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  financialPremiumsProcessData$ =
    this.financialVendorRefundFacade.financialPremiumsProcessData$;
  premiumsListData$ = this.financialVendorRefundFacade.premiumsListData$;
  @Input() selectedInsurancePremiumIds: any[] = [];
  filterResetDialog: any;
  paymentMethodCode: any;
  paymentStatusLovSubscription!: Subscription;
  paymentStatuses$ = this.lovFacade.paymentStatus$;
  paymentMethodLov$ = this.lovFacade.paymentMethodType$;
  cliams: any[] = [];
  refundSelectedClaims: any[] = [];
  paymentMethodLovSubscription!: Subscription;
  @Input() vendorId: any;
  private userInitiatedPageChange = false;
  defaultpageSize = 20;
  tempStateData!: any;
  public selectableSettings: SelectableSettings;
  public checkboxOnly = true;
  public mode: SelectableMode = 'multiple';
  public drag = false;
  constructor(
    private readonly financialClaimsFacade: FinancialClaimsFacade,
    private readonly router: Router,
    private readonly financialVendorRefundFacade: FinancialVendorRefundFacade,
    private dialogService: DialogService,
    private readonly lovFacade: LovFacade
  ) {
    this.selectableSettings = {
      checkboxOnly: this.checkboxOnly,
      mode: this.mode,
      drag: this.drag,
    };
  }
  selectedKeysChange(selection: any) {
    this.selectedClaimsChangeEvent.emit(selection);
    const includeClaim = this.cliams.filter((obj) =>
      selection.includes(obj.paymentRequestId)
    );
    const uniqueOriginalWarrants = [
      ...new Set(includeClaim.map((obj) => obj.originalWarrant)),
    ];
    if (uniqueOriginalWarrants.length > 1) {
      this.financialClaimsFacade.errorShowHideSnackBar(
        'Select a claim with Same warrant number'
      );
      this.claimsCount.emit(0);
    }
    if (uniqueOriginalWarrants.length <= 1) {
      this.selectedInsuranceClaims = selection;
      this.claimsCount.emit(this.selectedInsuranceClaims.length);
    }
  }

  ngOnInit(): void {
    this.gridClientClaimsData$.subscribe((res: any) => {
      this.cliams = res.data;
    });
     
    this.state = {
      skip: 0,
      take: this.defaultpageSize,
      sort: this.sort,
    };
    this.selectedInsuranceClaims =
      this.selectedInsurancePremiumIds &&
      this.selectedInsurancePremiumIds.length > 0
        ? this.selectedInsurancePremiumIds
        : this.selectedInsuranceClaims;
    this.lovFacade.getPaymentStatusLov();
    this.paymentStatusSubscription();
    this.loadRefundClaimsListGrid();
    this.paymentMethodSubscription();
    this.lovFacade.getPaymentMethodLov();
  }
  ngOnChanges(): void {
     
    this.state = {
      skip: this.state?.skip ?? 0,
      take: this.defaultpageSize,
      sort: this.sort,
      filter: this.state?.filter
    };
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
          value: value.lovCode,
        },
      ],
      logic: 'or',
    });
    if (field == 'paymentStatusCode') {
      this.paymentStatusCode = value;
    }
  }

  loadRefundClaimsGrid(data: any) {
    if (this.isEdit) {
      this.financialVendorRefundFacade.getInsuranceRefundEditInformation(
        this.vendorAddressId,
        this.clientId,
        data
      );
    } else {
      this.financialVendorRefundFacade.loadMedicalPremiumList(data);
    }
  }


  // updating the pagination infor based on dropdown selection
  pageSelectionChange(data: any) {
     
    this.state.take = data.take;
    this.state.skip = data.skip;
    this.loadRefundClaimsListGrid();
  }

  private loadRefundClaimsListGrid(): void {
     
    this.loadClaimsProcess(
      this.vendorId,
      this.clientId,
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType
    );
  }
  loadClaimsProcess(
    vendorAddressId: string,
    clientId: number,
    skipCountValue: number,
    maxResultCountValue: number,
    sortValue: string,
    sortTypeValue: string
  ) {
    this.isClientClaimsLoaderShow = true;
    const gridDataRefinerValue = {
      vendorId: vendorAddressId,
      clientId: clientId,
      skipCount: skipCountValue,
      maxResultCount: maxResultCountValue,
      sort: sortValue,
      sortType: sortTypeValue,
      filter: this.state?.['filter']?.['filters'] ?? [],
    };
    if (this.isEdit) {
      const param = {
        ...gridDataRefinerValue,
        paymentRequestId: this.editPaymentRequestId,
      };
      this.financialPremiumsProcessData$.subscribe((data: GridDataResult) => {
        let refunded = data.data.filter((x) => x.refundPaymentRequestId);
        this.selectedInsuranceClaims = refunded.map(
          (item) => item.paymentRequestId
        );
      });
      this.loadRefundClaimsGrid(param);
    } else {
      this.loadRefundClaimsGrid(gridDataRefinerValue);
    }
    this.gridDataHandle();
  }
  gridDataHandle() {
    this.financialPremiumsProcessData$.subscribe((data: GridDataResult) => {
      this.gridDataResult = data;
      this.gridDataResult.data = filterBy(
        this.gridDataResult.data,
        this.filterData
      );
      this.gridClientClaimsDataSubject.next(this.gridDataResult);
      if (data?.total >= 0 || data?.total === -1) {
        this.isClientClaimsLoaderShow = false;
      }
    });
    this.isClientClaimsLoaderShow = false;
    this.gridClientClaimsData$.subscribe((res: any) => {
      this.claimsCount.emit(this.selectedInsuranceClaims.length);
      this.selectedClaimsChangeEvent.emit(this.selectedInsuranceClaims);
    });
  }
  filterChange(filter: CompositeFilterDescriptor): void {
 
    this.filterData = filter;
    if(this.selectedInsuranceClaims.length >0){
    this.openResetDialog(this.filterResetConfirmationDialogTemplate);
    return;
    }else{
      this.state.filter =filter
    this.loadRefundClaimsListGrid();
    }

  }
  openResetDialog(template: TemplateRef<unknown>) {
    this.filterResetDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    });
  }
  paymentStatusSubscription() {
    this.paymentStatusLovSubscription = this.paymentStatuses$.subscribe(
      (data) => {
        this.paymentStatusType = data;
      }
    );
  }
  paymentMethodSubscription() {
    this.paymentStatusLovSubscription = this.paymentMethodLov$.subscribe(
      (data) => {
        this.paymentMethod = data;
      }
    );
  }
  resetButtonClosed(result: any) {
    if (result) {
      this.filterResetDialog.close();
    }
  }

  resetFilterClicked(action: any) {
    if (action) {
      this.state.filter =this.filterData
      this.filterResetDialog.close();
      this.selectedClaims = [];
      this.clearSelection();
      this.loadRefundClaimsListGrid();

    
    }
  }
  private clearSelection(): void {
    if (this.grid) {
      this.claimsCount.emit(0)
      this.selectedInsuranceClaims = [];
      this.selectedClaimsChangeEvent.emit(this.selectedInsuranceClaims)

    }
  }
  ngOnDestroy(): void {
    this.paymentStatusLovSubscription.unsubscribe();
  }
  onVendorProfileViewClicked(vendorId: any) {
    const query = {
      queryParams: {
        v_id: vendorId,
        tab_code: FinancialVendorProviderTabCode.InsuranceVendors,
      },
    };
    this.router.navigate(['/financial-management/vendors/profile'], query);
  }
  onProviderNameClick(event: any) {
    this.onProviderNameClickEvent.emit(event.paymentRequestId);
  }
}
