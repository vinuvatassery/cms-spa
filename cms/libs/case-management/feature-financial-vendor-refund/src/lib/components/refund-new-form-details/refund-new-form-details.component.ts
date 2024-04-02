import {
  Component,
  Output,
  EventEmitter,
  ViewChild,
  TemplateRef,
  Input,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  ElementRef,
} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import {
  CompositeFilterDescriptor,
  SortDescriptor,
  State,
} from '@progress/kendo-data-query';
import {
  ContactFacade,
  FinancialVendorFacade,
  FinancialVendorRefundFacade,
  GridFilterParam,
  PaymentMethodCode,
  ServiceTypeCode,
} from '@cms/case-management/domain';
import {
  LovFacade,
  UserManagementFacade,
  ScrollFocusValidationfacade,
} from '@cms/system-config/domain';
import { DialogService } from '@progress/kendo-angular-dialog';
import { Subject, Subscription, debounceTime, takeUntil } from 'rxjs';
import { VendorRefundInsurancePremiumListComponent } from '@cms/case-management/feature-financial-vendor-refund';
import { VendorRefundPharmacyPaymentsListComponent } from '../vendor-refund-pharmacy-payments-list/vendor-refund-pharmacy-payments-list.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SnackBarNotificationType } from '@cms/shared/util-core';
import { FilterService } from '@progress/kendo-angular-grid';
@Component({
  selector: 'cms-refund-new-form-details',
  templateUrl: './refund-new-form-details.component.html',
})
export class RefundNewFormDetailsComponent implements OnInit, OnDestroy {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  isShownSearchLoader = false;
  isAddClicked = false;
  selectedRefundType: any;
  public refundType: any[] = [];
  @Input() isEdit = false;
  clientCaseEligibilityId: any = null;
  @Input() clientId: any;

  @Input() clientName: any;
  @Input() vendorId: any;
  @Input() vendorAddressId: any;
  selectedProvider: any;
  isRefundGridClaimShow = false;
  isClientSelected = false;
  isShowReasonForException = false;
  showServicesListForm: boolean = false;
  selectedMedicalProvider: any;
  showGrid: boolean = false;
  tab = 1;
  dataExportParameters!: any;
  providerTin: any;
  selectedClient: any;
  refundClaimForm!: FormGroup;
  @Input() vendorName: any;
  sortType = this.financialVendorRefundFacade.sortType;
  pageSizes = this.financialVendorRefundFacade.gridPageSizes;
  gridSkipCount = this.financialVendorRefundFacade.skipCount;
  /*****   refund INS */
  sortValueRefundInformationGrid =
    this.financialVendorRefundFacade.sortValueRefundInformationGrid;
  sortRefundInformationGrid =
    this.financialVendorRefundFacade.sortRefundInformationGrid;
  state!: State;
  insuranceRefundInformationLoader$ =
    this.financialVendorRefundFacade.insuranceRefundInformationLoader$;
  insuranceRefundInformation$ =
    this.financialVendorRefundFacade.insuranceRefundInformation$;
  providerDetailsDialog: any;
  vendorProfile$ = this.financialVendorFacade.providePanelSubject$;
  updateProviderPanelSubject$ =
    this.financialVendorFacade.updateProviderPanelSubject$;
  ddlStates$ = this.contactFacade.ddlStates$;
  paymentMethodCode$ = this.lovFacade.paymentMethodType$;
  paymentType$ = this.lovFacade.paymentRequestType$;
  serviceTypes$ = this.lovFacade.serviceType$;
  onEditInitiallydontShowPremiumselection = false;
  isconfirmclicked = false;
  @ViewChild('premiumProviderDetailsTemplate', { read: TemplateRef })
  premiumProviderDetailsTemplate!: TemplateRef<any>;
  @ViewChild('pharmacyProviderDetailsTemplate', { read: TemplateRef })
  pharmacyProviderDetailsTemplate!: TemplateRef<any>;

  @ViewChild('tpaProviderDetailsTemplate', { read: TemplateRef })
  tpaProviderDetailsTemplate!: TemplateRef<any>;
  refundForm!: FormGroup;
  private ngUnsubscribe = new Subject<void>();
  /******/
  sortValueClaims = this.financialVendorRefundFacade.sortValueClaims;
  sortClaims = this.financialVendorRefundFacade.sortClaimsList;
  claimsListData$ = this.financialVendorRefundFacade.claimsListData$;

  sortValuePremiums = this.financialVendorRefundFacade.sortValuePremiums;
  sortPremiums = this.financialVendorRefundFacade.sortPremiumsList;
  premiumsListData$ = this.financialVendorRefundFacade.premiumsListData$;

  sortValueClientClaims =
    this.financialVendorRefundFacade.sortValueClientClaims;
  sortClientClaims = this.financialVendorRefundFacade.sortClientClaimsList;
  clientClaimsListData$ =
    this.financialVendorRefundFacade.clientClaimsListData$;

  sortValuePharmacyPayment =
    this.financialVendorRefundFacade.sortValuePharmacyPayment;
  sortPharmacyPayment =
    this.financialVendorRefundFacade.sortValuePharmacyPayment;
  pharmacyPaymentsListData$ =
    this.financialVendorRefundFacade.pharmacyPaymentsListData$;
  isConfirmationClicked = false;

  insuraceAddRefundClickSubject = new Subject<any>();
  insuraceAddRefundClick$ = this.insuraceAddRefundClickSubject.asObservable();

  tpaAddRefundClickSubject = new Subject<any>();
  tpaAddRefundClick$ = this.tpaAddRefundClickSubject.asObservable();

  selectDiffPaymentClicked = new Subject<any>();
  selectDiffPaymentClicked$ = this.selectDiffPaymentClicked.asObservable();

  clientSearchLoaderVisibility$ =
    this.financialVendorRefundFacade.clientSearchLoaderVisibility$;

  medicalProviderSearchLoaderVisibility$ =
    this.financialVendorRefundFacade.medicalProviderSearchLoaderVisibility$;

  clientSearchResult$ = this.financialVendorRefundFacade.clients$;
  pharmacySearchResult$ = this.financialVendorRefundFacade.pharmacies$;
  existingRxRefundClaim$ =
    this.financialVendorRefundFacade.existingRxRefundClaim$;
  insurancevendors$ = this.financialVendorRefundFacade.insurancevendors$;
  tpavendors$ = this.financialVendorRefundFacade.tpavendors$;
  tpaRefundInformation$ =
    this.financialVendorRefundFacade.tpaRefundInformation$;
  // tpaEditRefundInformation$ = this.financialVendorRefundFacade.tpaEditRefundInformation$
  @ViewChild('insClaims', { static: false })
  insClaims!: VendorRefundInsurancePremiumListComponent;

  @ViewChild('rxClaims', { static: false })
  rxClaims!: VendorRefundPharmacyPaymentsListComponent;
  showNoDataMessage: boolean = false;
  insurancePremiumPaymentReqIds: any[] = [];
  pharmacyClaimsPaymentReqIds: any[] = [];
  tpaClaimsPaymentReqIds: any[] = [];
  tpaPaymentReqIds: any[] = [];
  rxPaymentReqIds: any[] = [];
  selectedVendorRefundsList: any[] = [];
  allSelectedVendorRefundsList: any[] = [];
  rxstate!: State;
  creditMaskFormat: string = '000000-000';

  @Input() serviceType = '';
  @Input() inspaymentRequestId: any;
  @Output() modalCloseAddEditRefundFormModal = new EventEmitter<boolean>();
  sortValue: string | undefined;
  financialPremiumsRefundGridLists: any;
  tpaRefundInformation: any;
  filterData: any;
  paymentRequestId: any;
  insurancePremiumsRequestIds: any;
  disableFeildsOnConfirmSelection = false;
  selectedVendor: any;
  claimsCount: number = 0;
  diffclaims: any[] = [];
  inputConfirmationClicked!: boolean;
  isRefundRxSubmitted!: boolean;
  refundNoteValueLength: any;
  pharmaciesList: any;
  isSpotsPayment: boolean = true;
  selectedInsRequests: any[] = [];
  selectedTpaRequests: any[] = [];
  selectedRxVendorRefundList: any;
  tpaRefundGridLists: any[] = [];
  vendorRefundProfileSubject = new Subject();
  pharmacySearchResultSubscription = new Subscription();
  vendorRefundFormProfile$ =
    this.financialVendorRefundFacade.vendorRefundFormProfileSubject;
  rxfilterData: any;
  rxRefundInfoSort: SortDescriptor[] = [{ field: 'PcaCode', dir: 'asc' }];
  rxRefundInfoSortValue = 'prescriptionFillDate';
  rxRefundInfoSortType = 'desc';
  rxRefundInfoFilter: any[] = [];
  filter!: any;
  paymentTypeData: any[] = [];
  selectedPaymentType: any = '';

  constructor(
    private readonly financialVendorRefundFacade: FinancialVendorRefundFacade,
    private lovFacade: LovFacade,
    public contactFacade: ContactFacade,
    public financialVendorFacade: FinancialVendorFacade,
    private dialogService: DialogService,
    private formBuilder: FormBuilder,
    private readonly userManagementFacade: UserManagementFacade,
    private readonly cdr: ChangeDetectorRef,
    private readonly elementRef: ElementRef,
    private scrollFocusValidationfacade: ScrollFocusValidationfacade
  ) {}
  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  rxRefundInformationfilterChange(filter: CompositeFilterDescriptor): void {
    this.rxfilterData = filter;
  }

  rxRefundInfoDataStateChange(stateData: any, index: any): void {
    this.rxRefundInfoSort = stateData.sort;
    this.rxRefundInfoSortValue = stateData.sort[0]?.field ?? this.sortValue;
    this.rxRefundInfoSortType = stateData.sort[0]?.dir ?? 'asc';
    this.rxstate = stateData;
    this.rxRefundInfoFilter = stateData?.filter?.filters;
    if (this.rxRefundInfoFilter) {
      if (this.rxRefundInfoFilter?.length == 0) {
        this.selectedVendorRefundsList[index].prescriptionFillItems =
          this.allSelectedVendorRefundsList[index].prescriptionFillItems;
        this.selectedVendorRefundsList[index].prescriptionFillItems =
          this.sortPrescriptions(
            this.selectedVendorRefundsList[index].prescriptionFillItems
          );
        return;
      }
      this.rxRefundInfoFilter.forEach((element, ind) => {
        let rowNum = 0;
        element.filters.forEach((fil: any) => {
          if (ind == 0 && rowNum == 0) {
            this.selectedVendorRefundsList[index].prescriptionFillItems =
              this.filterWithOperators(
                fil,
                this.allSelectedVendorRefundsList[index].prescriptionFillItems,
                this.selectedVendorRefundsList[index].prescriptionFillItems
              );
          } else {
            if (this.selectedVendorRefundsList[index].prescriptionFillItems) {
              this.selectedVendorRefundsList[index].prescriptionFillItems =
                this.filterWithOperators(
                  fil,
                  this.selectedVendorRefundsList[index].prescriptionFillItems,
                  this.selectedVendorRefundsList[index].prescriptionFillItems
                );
            }
          }
          rowNum++;
        });
      });
    }
    this.selectedVendorRefundsList[index].prescriptionFillItems =
      this.sortPrescriptions(
        this.selectedVendorRefundsList[index].prescriptionFillItems
      );
  }

  sortPrescriptions(source: any[]) {
    if (this.rxRefundInfoSortType == 'asc') {
      return source.sort((a, b) =>
        a[this.rxRefundInfoSortValue] < b[this.rxRefundInfoSortValue] ? -1 : 1
      );
    } else {
      return source.sort((a, b) =>
        a[this.rxRefundInfoSortValue] > b[this.rxRefundInfoSortValue] ? -1 : 1
      );
    }
  }

  filterWithOperators(fil: any, source: any[], destination: any[]) {
    switch (fil.operator) {
      case 'startswith':
        destination = source.filter((x: any) =>
          x[fil.field]?.toLowerCase().startsWith(fil.value?.toLowerCase())
        );
        break;
      case 'eq':
        destination = source.filter(
          (x: any) =>
            x[fil.field]?.toString().toLowerCase() ==
            fil.value?.toString().toLowerCase()
        );
        break;
      case 'endswith':
        destination = source.filter((x: any) =>
          x[fil.field]?.toLowerCase().endsWith(fil.value?.toLowerCase())
        );
        break;
      case 'contains':
        destination = source.filter((x: any) =>
          x[fil.field]
            ?.toString()
            ?.toLowerCase()
            .includes(fil.value?.toLowerCase())
        );
        break;
      case 'gte':
        if (fil.field == 'prescriptionFillDate') {
          destination = source.filter(
            (x) => new Date(x.prescriptionFillDate) >= fil.value
          );
        } else {
          destination = source.filter(
            (x: any) => x[fil.field]?.toString() >= fil.value
          );
        }
        break;
      case 'gt':
        if (fil.field == 'prescriptionFillDate') {
          destination = source.filter(
            (x: any) => new Date([fil.field]?.toString()) > new Date(fil.value)
          );
        } else {
          destination = source.filter(
            (x: any) => x[fil.field]?.toString() > fil.value
          );
        }
        break;
      case 'lte':
        if (fil.field == 'prescriptionFillDate') {
          destination = source.filter(
            (x) => new Date(x.prescriptionFillDate) <= fil.value
          );
        } else {
          destination = source.filter(
            (x: any) => x[fil.field]?.toString() <= fil.value
          );
        }
        break;
      case 'lt':
        if (fil.field == 'prescriptionFillDate') {
          destination = source.filter(
            (x: any) => new Date(x[fil.field]?.toString()) < new Date(fil.value)
          );
        } else {
          destination = source.filter(
            (x: any) => x[fil.field]?.toString() < fil.value
          );
        }
        break;
    }
    return destination;
  }
  ngOnInit(): void {
    this.rxstate = {
      skip: 0,
      sort: this.rxRefundInfoSort,
    };

    this.subscribeLoadRefundClaimDataForRx();
    this.financialVendorRefundFacade.premiumsListData$.subscribe((res: any) => {
      this.diffclaims = res.item;
    });
    this.lovFacade.getRefundTypeLov();
    this.lovFacade.getServiceTypeLov();
    this.lovFacade.getCoPaymentRequestTypeLov();
    this.getPaymentTypeLov();
    this.initForm();
    this.lovFacade.refundType$.subscribe((res: any[]) => {
      this.refundType = res.filter((x) => x.lovCode !== 'TAX');
    });
    if (this.isEdit) {
      console.log(this.tpaRefundGridLists);
      this.disableFeildsOnConfirmSelection = true;
      this.selectedRefundType = this.serviceType;
      this.onEditInitiallydontShowPremiumselection = true;
      this.isClientSelected = true;
      this.selectedClient = {
        clientId: this.clientId,
        clientNames: this.clientName,
      };
      const vendors = [
        {
          vendorAddressId: this.vendorAddressId,
          providerFullName: this.vendorName,
          vendorName: this.vendorName,
          tin: '',
        },
      ];
      this.selectedVendor = vendors;

      this.financialVendorRefundFacade.clientSubject.next([
        this.selectedClient,
      ]);
      this.initForm();
      if (this.selectedRefundType === ServiceTypeCode.insurancePremium) {
        this.refundForm.controls['insVendor'].disable();
        this.refundForm.patchValue({
          insVendor: this.selectedVendor,
        });
        this.insurancevendors$.subscribe((res: any[]) => {
          const vendors = res.filter((x) => {
            return x.vendorAddressId == this.vendorAddressId;
          });
          this.selectedVendor = vendors && vendors[0];
          this.vendorId = vendors[0].vendorId;
          this.initForm();
        });
        this.onInputChange(this.vendorName);

        this.financialVendorRefundFacade.insurancevendorsSubject.next([
          this.selectedVendor,
        ]);
      }

      if (
        this.selectedRefundType === ServiceTypeCode.pharmacy ||
        this.serviceType == 'PHARMACY'
      ) {
        this.refundForm.patchValue({
          rxVendor: this.selectedVendor,
        });
        this.refundForm.controls['rxVendor'].disable();
        this.financialVendorRefundFacade.pharmaciesSubject.next([
          this.selectedVendor,
        ]);
        this.searchPharmacy(this.vendorName);
        this.isConfirmationClicked = true;
        this.financialVendorRefundFacade.pharmaciesSubject.next(vendors);
        this.selectedMedicalProvider = vendors[0];
        this.loadPaymentRequestData();
      }

      if (this.selectedRefundType === ServiceTypeCode.tpa) {
        this.refundForm.patchValue({
          tpaVendor: this.selectedVendor,
        });

        this.tpavendors$.subscribe((res: any[]) => {
          const vendors = res.filter((x) => {
            return x.vendorAddressId == this.vendorAddressId;
          });
          this.selectedVendor = vendors && vendors[0];
          this.vendorId = vendors[0].vendorId;
          this.initForm();
        });
        this.debouncedtpaVendors(this.vendorName);

        this.financialVendorRefundFacade.tpaVendorsSubject.next([
          this.selectedVendor,
        ]);
        this.isConfirmationClicked = true;

        this.getTpaRefundInformation(this.inspaymentRequestId);
        this.refundForm.controls['tpaVendor'].disable();
        this.searchTpaVendors(this.vendorName);
      }
    }
  }

  subscribeLoadRefundClaimDataForRx() {
    this.pharmacySearchResultSubscription =
      this.pharmacySearchResult$.subscribe((res: any) => {
        this.pharmaciesList = res;
        const vendors = res.filter((x: any) => {
          return x.vendorAddressId == this.vendorAddressId;
        });
        this.selectedVendor = vendors && vendors[0];
        this.vendorId = vendors[0].vendorId;
        this.initForm();
      });
    this.existingRxRefundClaim$.subscribe((res: any) => {
      this.rxPaymentReqIds = [
        res.prescriptionFillItems
          .map((x: any) => x.refundedPrescriptionFillId)
          .join(','),
      ];

      this.getSelectedVendorRefundsList(res, 'EDIT');
    });
  }

  loadPaymentRequestData() {
    this.financialVendorRefundFacade.loadPharmacyRefundEditList(
      this.inspaymentRequestId
    );
  }
  initForm() {
    if (this.selectedRefundType === ServiceTypeCode.insurancePremium) {
      this.refundForm = this.formBuilder.group({
        insVendor: this.selectedVendor,
      });
      if (this.isEdit) {
        this.refundForm.controls['insVendor'].disable();
      }
    }
    if (this.selectedRefundType === ServiceTypeCode.pharmacy) {
      this.refundForm = this.formBuilder.group({
        rxVendor: this.selectedVendor,
      });
      if (this.isEdit) {
        this.refundForm.controls['rxVendor'].disable();
      }
    }

    if (this.selectedRefundType === ServiceTypeCode.tpa) {
      this.refundForm = this.formBuilder.group({
        tpaVendor: this.selectedVendor,
      });
      if (this.isEdit) {
        this.refundForm.controls['tpaVendor'].disable();
      }
    }
  }

  addInsuranceRefundClaim(event: any) {
    this.financialVendorRefundFacade.addUpdateInsuranceRefundClaim$.subscribe(
      (res) => {
        this.closeAddEditRefundFormModalClicked(true);
      }
    );
    if (this.isEdit) {
      this.financialVendorRefundFacade.updateInsuranceRefundEditInformation(
        event.data
      );
    } else {
      this.financialVendorRefundFacade.addInsuranceRefundClaim(event.data);
    }
  }

  selectionChange(event: any) {
    this.isConfirmationClicked = false;
    this.claimsCount = 0;
    this.pharmacyClaimsPaymentReqIds = [];
    this.vendorId = null;
    this.vendorAddressId = null;
    this.selectedProvider = null;
  }
  confirmationClicked() {
    this.isconfirmclicked = true;
    if (this.claimsCount != 0) {
      this.inputConfirmationClicked = true;
      this.disableFeildsOnConfirmSelection = true;
      if (
        this.selectedRefundType === ServiceTypeCode.insurancePremium &&
        this.insClaims.selectedInsuranceClaims &&
        this.insClaims.selectedInsuranceClaims.length > 0
      ) {
        this.refundForm.controls['insVendor'].disable();
        this.insurancePremiumPaymentReqIds = [
          ...this.insClaims.selectedInsuranceClaims,
        ];
      }

      if (this.selectedRefundType === ServiceTypeCode.tpa) {
        this.refundForm.controls['tpaVendor'].disable();
        const param = {
          paymentRequestIds: this.selectedTpaRequests,
        };
        this.financialVendorRefundFacade.getTpaRefundInformation(param);
      }
      if (
        this.selectedRefundType === ServiceTypeCode.pharmacy ||
        this.selectedRefundType === 'RX' ||
        this.selectedRefundType === 'PHARMACY'
      ) {
        this.refundForm.controls['rxVendor'].disable();
        if (!this.isEdit) {
          this.getSelectedVendorRefundsList(
            this.rxClaims.selectedPharmacyClaims
          );
        } else {
          this.rxClaims.selectedPharmacyClaims.forEach((element) => {
            const data =
              this.selectedVendorRefundsList[0].prescriptionFillItems.find(
                (obj: any) => {
                  return (
                    obj.refundedPrescriptionFillId == element.perscriptionFillId
                  );
                }
              );
            if (data) {
              element.daySupplyRefunded = data.daySupplyRefunded;
              element.qtyRefunded = data.qtyRefunded;
              element.qtyRefundedValid = data.qtyRefunded;
              element.refundedAmount = data.refundedAmount;
              element.refundedAmountValid = data.refundedAmountValid;
              element.refundedPrescriptionFillId =
                data.refundedPrescriptionFillId;
            }
          });
          this.getSelectedVendorRefundsList(
            this.rxClaims.selectedPharmacyClaims
          );
        }
      }
      this.onEditInitiallydontShowPremiumselection = true;
      this.isConfirmationClicked = true;
    }
  }

  onSelectedClaimsChangeEvent(event: any[]) {
    this.selectedInsRequests = event;
    this.insurancePremiumPaymentReqIds = event;
    if (
      this.isEdit &&
      this.selectedRefundType === ServiceTypeCode.insurancePremium &&
      this.onEditInitiallydontShowPremiumselection
    ) {
      this.confirmationClicked();
    }
  }

  onSelectedTpaClaimsChangeEvent(event: any[]) {
    this.selectedTpaRequests = event;
    this.tpaPaymentReqIds = event;
  }

  onSelectedRxClaimsChangeEvent(event: any) {
    this.rxPaymentReqIds = event;
  }
  /*** refund INS */
  getInsuranceRefundInformation(data: any) {
    const param = {
      ...data,
      paymentRequestsId: this.selectedInsRequests,
      type: this.isEdit ? 'REFUND' : 'PAID',
    };
    this.financialVendorRefundFacade.getInsuranceRefundInformation(param);
    this.financialVendorRefundFacade.insuranceRefundInformation$.subscribe(
      (res) => {
        this.financialPremiumsRefundGridLists = res;
      }
    );
  }

  getTpaRefundInformation(data: any) {
    this.tpaRefundInformation$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((res: any) => {
        let data: any[] = [];
        let response: any[] = [];
        response = res.data;
        if (this.tpaRefundGridLists && this.tpaRefundGridLists.length > 0) {
          const tpaList = [...this.tpaRefundGridLists];
          tpaList.forEach((element, ind) => {
            let index = response.findIndex(
              (x) => x.paymentRequestId == element.paymentRequestId
            );
            if (index <= 0) this.tpaRefundGridLists.splice(index);
          });
          this.tpaRefundGridLists = this.tpaRefundGridLists.concat(response);
        } else {
          this.tpaRefundGridLists = res.data;
        }
        this.tpaRefundGridLists = [...this.tpaRefundGridLists];
        this.tpaRefundGridLists.forEach((x) => {
          x.serviceStartDate = x.serviceStartDate
            ? new Date(x.serviceStartDate)
            : null;
          x.serviceEndDate = x.serviceEndDate
            ? new Date(x.serviceEndDate)
            : null;
          x.reconciledDate = x.reconciledDate
            ? new Date(x.reconciledDate)
            : null;
          x.totalAmount = x.tpaInvoice.reduce(
            (accumulator: number, obj: any) => accumulator + obj.serviceCost,
            0
          );
        });
        this.claimsCount = this.tpaRefundGridLists.length;
      });
    if (this.isEdit) {
      this.financialVendorRefundFacade.getTpaEditRefundInformation(data);
    } else {
      const param = {
        paymentRequestIds: this.selectedTpaRequests,
      };
      this.financialVendorRefundFacade.getTpaRefundInformation(param);
      this.financialVendorRefundFacade.tpaRefundInformation$.subscribe(
        (res) => {
          this.tpaRefundInformation = res;
        }
      );
    }
  }

  onCloseViewProviderDetailClicked(result: any) {
    if (result) {
      this.providerDetailsDialog.close();
    }
  }

  getProviderPanel(event: any) {
    this.financialVendorFacade.getProviderPanel(event);
  }

  onInsurancePremiumProviderCick(event: any) {
    this.paymentRequestId = event;
    this.providerDetailsDialog = this.dialogService.open({
      content: this.premiumProviderDetailsTemplate,
      animation: {
        direction: 'left',
        type: 'slide',
      },
      cssClass: 'app-c-modal app-c-modal-np app-c-modal-right-side',
    });
  }

  onPharmacyPremiumProviderCick(event: any) {
    this.paymentRequestId = event;
    this.providerDetailsDialog = this.dialogService.open({
      content: this.pharmacyProviderDetailsTemplate,
      animation: {
        direction: 'left',
        type: 'slide',
      },
      cssClass: 'app-c-modal app-c-modal-np app-c-modal-right-side',
    });
  }

  onTpaProviderClick(event: any) {
    this.paymentRequestId = event;
    this.providerDetailsDialog = this.dialogService.open({
      content: this.tpaProviderDetailsTemplate,
      animation: {
        direction: 'left',
        type: 'slide',
      },
      cssClass: 'app-c-modal app-c-modal-np app-c-modal-right-side',
    });
  }
  updateProviderProfile(event: any) {
    this.financialVendorFacade.updateProviderPanel(event);
  }

  OnEditProviderProfileClick() {
    this.contactFacade.loadDdlStates();
    this.lovFacade.getPaymentMethodLov();
  }

  onAddRefundClick() {
    this.isAddClicked = true;
    if (this.selectedRefundType === 'PHARMACY') {
      this.addNewRefundRx();
    }
    if (this.selectedRefundType === ServiceTypeCode.insurancePremium) {
      if (this.refundRXForm.invalid) {
        this.scrollToValidationError();
        return;
      }
      this.insuraceAddRefundClickSubject.next(true);
    }
     
    if (this.selectedRefundType === ServiceTypeCode.tpa) {
      if (this.refundRXForm.invalid) {
        this.scrollToValidationError();
        return;
      }
      this.tpaAddRefundClickSubject.next(true)
    } 
  }

  addTpa(event: any) {
    this.financialVendorRefundFacade.addUpdateInsuranceRefundClaim$.subscribe(
      (res) => {
        this.closeAddEditRefundFormModalClicked(true);
      }
    );
    const param = {
      tpaRefundInformation: event,
    };
    if (!this.isEdit) {
      this.financialVendorRefundFacade.addTpaRefundClaim(param);
    } else {
      this.financialVendorRefundFacade.updateTpaRefundClaim(param);
    }
  }

  /******  */
  selectDiffPayments() {
    this.isConfirmationClicked = false;
    this.disableFeildsOnConfirmSelection = true;
    if (this.selectedRefundType == ServiceTypeCode.insurancePremium) {
      this.refundForm.controls['insVendor'].disable();
    }
    this.onEditInitiallydontShowPremiumselection = false;
    this.inputConfirmationClicked = false;
    this.isRefundGridClaimShow = true;
    if (this.selectedRefundType == ServiceTypeCode.pharmacy) {
      this.claimsCount = this.pharmacyClaimsPaymentReqIds.length;
      this.pharmacyClaimsPaymentReqIds = this.rxPaymentReqIds;
    }
  }

  closeAddEditRefundFormModalClicked(event: boolean) {
    this.modalCloseAddEditRefundFormModal.emit(event);
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
      return;
    }
    clientSearchText = clientSearchText.replace('/', '-');
    clientSearchText = clientSearchText.replace('/', '-');
    this.financialVendorRefundFacade.loadClientBySearchText(clientSearchText);
  }
  onClientValueChange(client: any) {
    this.isClientSelected = false;
    this.selectedRefundType = null;
    if (client != undefined) {
      this.isClientSelected = true;
      this.clientCaseEligibilityId = client.clientCaseEligibilityId;
      this.clientId = client.clientId;
      this.financialVendorRefundFacade.loadInsurancevendorBySearchText(
        '',
        this.clientId
      );
      this.clientName = client.clientFullName;
      if (this.clientId != null && this.vendorAddressId != null) {
        this.isRefundGridClaimShow = true;
      }
    } else {
      this.clientId = null;
      this.claimsCount = 0;
      this.pharmacyClaimsPaymentReqIds = [];
    }
  }
  searchPharmacy(searchText: any) {
    if (!searchText || searchText.length == 0) {
      return;
    }
    this.financialVendorRefundFacade.loadPharmacyBySearchText(
      searchText,
      this.clientId
    );
  }
  onProviderValueChange($event: any) {
    this.isClientSelected = true;
    this.vendorAddressId = null;
    if ($event == undefined) {
      this.vendorAddressId = null;
      this.claimsCount = 0;
      this.pharmacyClaimsPaymentReqIds = [];
    }
    this.isConfirmationClicked = false;
    this.vendorId = $event?.vendorId;
    this.vendorAddressId = $event?.vendorAddressId;
    this.vendorName = $event?.vendorName;
    this.providerTin = $event;
    if (this.clientId != null && this.vendorAddressId != null) {
      this.isRefundGridClaimShow = true;
    }
    this.selectedMedicalProvider = $event;
  }
  initRefundForm() {
    this.refundClaimForm = this.formBuilder.group({
      medicalProvider: [this.selectedMedicalProvider, Validators.required],
      client: [this.selectedClient, Validators.required],
    });
    this.refundRXForm = this.formBuilder.group({
      voucherPayable: [''],
      creditNumber: [''],
      warantNumber: ['', Validators.required],
      depositDate: [''],
      refundNote: [''],
    });
  }
  showHideServicesListForm() {
    if (
      this.refundClaimForm.controls['medicalProvider'].value &&
      this.refundClaimForm.controls['selectedClient'].value
    ) {
      this.showServicesListForm = true;
    } else {
      this.showServicesListForm = false;
    }
  }
  debounce<T>(
    func: (arg: T) => void,
    debounceTimeMs: number
  ): (arg: T) => void {
    const subject = new Subject<T>();

    subject.pipe(debounceTime(debounceTimeMs)).subscribe((arg) => func(arg));

    return (arg: T) => subject.next(arg);
  }
  debouncedSearchInsuranceVendors = this.debounce((searchText: any) => {
    this.searchInsuranceVendors(searchText);
  }, 300); // Adjust the debounce time (in milliseconds) according to your needs

  debouncedtpaVendors = this.debounce((searchText: any) => {
    this.searchTpaVendors(searchText);
  }, 300); // Adjust the debounce time (in milliseconds) according to your needs

  onInputChange(searchText: any) {
    this.debouncedSearchInsuranceVendors(searchText);
  }
  searchInsuranceVendors(searchText: any) {
    if (!searchText || searchText.length == 0) {
      return;
    }

    this.financialVendorRefundFacade.loadInsurancevendorBySearchText(
      searchText,
      this.clientId
    );
  }
  searchTpaVendors(searchText: any) {
    if (!searchText || searchText.length == 0) {
      return;
    }
    this.financialVendorRefundFacade.loadTpavendorBySearchText(
      searchText,
      this.clientId
    );
  }
  claimsCountEvent(data: any) {
    this.claimsCount = data;
  }

  onTpaClaimsDelete(data: any) {
    this.claimsCount = data.length;
    this.tpaPaymentReqIds = data;
    if (data.length <= 0) {
      this.isConfirmationClicked = false;
    }
  }

  onDeleteSelectedPharmacyClick(index: any) {
    this.selectedVendorRefundsList.splice(index, 1);
    if (this.selectedVendorRefundsList.length <= 0) {
      this.selectDiffPayments();
      this.pharmacyClaimsPaymentReqIds = [];
    }
  }

  getSelectedVendorRefundsList(listData: any, operation: string = 'ADD') {
    if (operation === 'ADD') {
      this.selectedVendorRefundsList = Array.from(
        new Set(
          listData.map((item: any) =>
            JSON.stringify({
              indexCode: item.indexCode,
              pcaCode: item.pcaCode,
              grantNo: item.grantNo,
              warrantNbr: item.warrantNbr,
              paymentStatusCode: item.paymentStatusCode,
              paymentMethodCode: item.paymentMethodCode,
              prescriptionFillItems: [],
            })
          )
        )
      ).map((str: any) => JSON.parse(str));
      listData = listData.map((obj: any) => ({
        ...obj,
        qtyRefunded: obj.qtyRefunded ?? null,
        qtyRefundedValid: false,
        daySupplyRefunded: obj.daySupplyRefunded ?? null,
        daySupplyRefundedValid: false,
        refundedAmount: obj.refundedAmount ?? null,
        refundedAmountValid: false,
        paymentType: obj?.paymentType,
      }));
      this.selectedVendorRefundsList.forEach((element: any) => {
        element.prescriptionFillItems = listData.filter(
          (x: any) =>
            x.indexCode == element.indexCode &&
            x.pcaCode == element.pcaCode &&
            x.warrantNbr == element.warrantNbr &&
            x.paymentStatusCode == element.paymentStatusCode
        );
      });
    } else {
      this.isConfirmationClicked = true;
      this.inputConfirmationClicked = true;
      this.disableFeildsOnConfirmSelection = true;
      this.vendorId = listData.vendorId;
      const formValues: {
        voucherPayable: string | null;
        creditNumber: string | null;
        warantNumber: string | null;
        depositDate: Date | null;
        refundNote: string | null;
      } = {
        voucherPayable: listData.voucherPayable ?? '',
        creditNumber: listData.creditNo ?? '',
        warantNumber: listData.warrantNumber ?? '',
        depositDate: listData.depositDate
          ? new Date(listData.depositDate)
          : null,
        refundNote: listData.refundNote ?? '',
      };
      this.refundRXForm.setValue(formValues as any);
      listData = [listData].map((obj: any) => ({
        ...obj,
        warrantNbr: obj.warrantNumber,
        paymentStatusCode: obj.paymentStatus,
      }));
      this.clientId = this.selectedClient.clientId;
      this.pharmacyClaimsPaymentReqIds = [];
      this.selectedVendorRefundsList = listData;
      if (this.selectedVendorRefundsList) {
        this.selectedVendorRefundsList.forEach((vl: any) => {
          vl &&
            vl.prescriptionFillItems.forEach((y: any) => {
              this.pharmacyClaimsPaymentReqIds.push(
                y.refundedPrescriptionFillId
              );
            });
        });
      }
    }
    this.allSelectedVendorRefundsList = JSON.parse(
      JSON.stringify(this.selectedVendorRefundsList)
    );

    this.isConfirmationClicked = true;
  }

  ngDirtyInValid(dataItem: any, control: any, tblIndex: any, rowIndex: any) {
    let isTouched = document
      .getElementById(`${control}${tblIndex}-${rowIndex}`)
      ?.classList.contains('ng-touched');
    let inValid = false;
    if (control === 'qtyRefunded') {
      inValid =
        isTouched && !(dataItem.qtyRefunded != null && dataItem.qtyRefunded > 0)
          ? true
          : false;
      dataItem.qtyRefundedValid = !inValid;
      dataItem.qtyRefundedGtRxQty = inValid =
        dataItem.qtyRefunded > dataItem.rxqty;
    }
    if (control === 'daySupplyRefunded') {
      inValid =
        isTouched &&
        !(dataItem.daySupplyRefunded != null && dataItem.daySupplyRefunded > 0)
          ? true
          : false;
      dataItem.daySupplyRefundedValid = !inValid;
      let rxRatio = dataItem.rxqty / dataItem.daySupply;
      let refundRatio = dataItem.qtyRefunded / dataItem.daySupplyRefunded;

      if (dataItem.daySupplyRefunded > dataItem.daySupply) {
        dataItem.daySpyRfdGtDaySpy = inValid = true;
        dataItem.daySupplyRefundedRatioValid = false;
      } else {
        dataItem.daySpyRfdGtDaySpy = false;
        if (!isNaN(refundRatio) && isFinite(refundRatio) && refundRatio > 0) {
          inValid = !(rxRatio >= refundRatio);
          dataItem.daySupplyRefundedRatioValid = inValid;
        } else {
          dataItem.daySupplyRefundedRatioValid = false;
        }
      }
    }
    if (control === 'refundedAmount') {
      inValid =
        isTouched &&
        !(dataItem.refundedAmount != null && dataItem.refundedAmount > 0)
          ? true
          : false;
      dataItem.refundedAmountValid = !inValid;
    }
    if (inValid) {
      document
        .getElementById(`${control}${tblIndex}-${rowIndex}`)
        ?.classList.remove('ng-valid');
      document
        .getElementById(`${control}${tblIndex}-${rowIndex}`)
        ?.classList.add('ng-invalid');
      document
        .getElementById(`${control}${tblIndex}-${rowIndex}`)
        ?.classList.add('ng-dirty');
    } else {
      document
        .getElementById(`${control}${tblIndex}-${rowIndex}`)
        ?.classList.remove('ng-invalid');
      document
        .getElementById(`${control}${tblIndex}-${rowIndex}`)
        ?.classList.remove('ng-dirty');
      document
        .getElementById(`${control}${tblIndex}-${rowIndex}`)
        ?.classList.add('ng-valid');
    }
    return 'ng-dirty ng-invalid grid-input';
  }
  getSumOfColumn(list: any, property: string): string {
    let sum = 0;
    if (property === 'amountPaid')
      sum = list.reduce(
        (accumulator: number, obj: any) => accumulator + obj.amountPaid,
        0
      );
    if (property === 'refundedAmount')
      sum = list.reduce(
        (accumulator: number, obj: any) => accumulator + obj.refundedAmount,
        0
      );
    return sum.toFixed(2);
  }
  refundRXForm = this.formBuilder.group({
    voucherPayable: [''],
    creditNumber: [''],
    warantNumber: ['', Validators.required],
    depositDate: [''],
    refundNote: [''],
  });
  markGridFormTouched() {
    for (
      let index = 0;
      index < document.getElementsByClassName(`grid-input`).length;
      index++
    ) {
      document
        .getElementsByClassName(`grid-input`)
        [index].classList.add('ng-touched');
    }
  }
  addNewRefundRx() {
    this.isRefundRxSubmitted = true;
    this.refundRXForm.markAllAsTouched();
    this.refundRXForm.markAsDirty();
    this.markGridFormTouched();

    this.selectedVendorRefundsList
      .reduce(
        (result: any, obj: any) => result.concat(obj.prescriptionFillItems),
        []
      )
      .forEach((x: any) => {
        if (!x.qtyRefunded) {
          x.qtyRefundedValid = false;
          return;
        } else {
          x.qtyRefundedValid = true;
        }

        if (!x.daySupplyRefunded) {
          x.daySupplyRefundedValid = false;
          return;
        } else {
          x.daySupplyRefundedValid = true;
        }
        if (!x.refundedAmount) {
          x.refundedAmountValid = false;
          return;
        } else {
          x.refundedAmountValid = true;
        }
      });
    this.cdr.detectChanges();

    let selectedpharmacyClaims = this.selectedVendorRefundsList.reduce(
      (result: any, obj: any) => result.concat(obj.prescriptionFillItems),
      []
    );

    let InValidSelectedRefundPharmacyClaimInput = selectedpharmacyClaims.filter((x:any)=> x.qtyRefundedValid == false || x.daySupplyRefundedValid == false || x.refundedAmountValid == false)
    if ((this.refundRXForm.invalid) || InValidSelectedRefundPharmacyClaimInput.length >0) {
      this.scrollToValidationError();
      return;
    } else {
      let selectedpharmacyClaimsDto = selectedpharmacyClaims.map(
        (obj: any) => ({
          paymentRequestId:
            obj.paymentRequestId ??
            this.selectedVendorRefundsList[0].paymentRequestId,
          refundedPaymentRequestId:
            this.selectedVendorRefundsList[0].refundedPaymentRequestId ??
            obj.paymentRequestId ??
            this.selectedVendorRefundsList[0].paymentRequestId,
          prescriptionFillId: obj.perscriptionFillId ?? obj.prescriptionFillId,
          refundedPrescriptionFillId:
            obj.refundedPrescriptionFillId ??
            obj.perscriptionFillId ??
            obj.prescriptionFillId,
          refundedQty: obj.qtyRefunded,
          daySupplyRefunded: obj.daySupplyRefunded,
          refundedAmount: obj.refundedAmount,
          grantNo: obj.grantNo,
          pcaCode: obj.pcaCode,
          creditNumber: obj.creditNumber,
          rxqtype: obj.rxqtype,
          pharmacyNpi: obj.PharmacyNpi,
          ndc: obj.ndc,
          paymentTypeCode: obj.paymentTypeCode,
          batchId: obj.batchId ?? this.selectedVendorRefundsList[0].batchId,
        })
      );
      let refundRxData = {
        ...this.refundRXForm.value,
        vendorId: this.vendorId,
        clientId: this.clientId,
        clientCaseEligibilityId:
          this.clientCaseEligibilityId ??
          selectedpharmacyClaims[0].clientCaseEligibilityId,
        refundType: this.selectedRefundType,
        isSpotsPaymentCheck:
          selectedpharmacyClaims[0].paymentMethodCode == PaymentMethodCode.SPOTS
            ? true
            : false,
        pharmacyRefundedItems: selectedpharmacyClaimsDto,
        vendorAddressId: this.vendorAddressId,
      };
      if (this.isEdit == false) {
        this.financialVendorRefundFacade.showLoader();
        this.financialVendorRefundFacade
          .addNewRefundRx(refundRxData)
          .subscribe({
            next: (data: any) => {
              this.financialVendorRefundFacade.hideLoader();
              this.closeAddEditRefundFormModalClicked(true);
              this.financialVendorRefundFacade.showHideSnackBar(
                SnackBarNotificationType.SUCCESS,
                'Refund added! An event has been logged'
              );
            },
            error: (error: any) => {
              if (error) {
                this.financialVendorRefundFacade.showHideSnackBar(
                  SnackBarNotificationType.ERROR,
                  error
                );
                this.financialVendorRefundFacade.hideLoader();
              }
            },
          });
      } else {
        this.financialVendorRefundFacade.showLoader();
        this.financialVendorRefundFacade
          .editNewRefundRx(refundRxData)
          .subscribe({
            next: (data: any) => {
              this.financialVendorRefundFacade.hideLoader();
              this.closeAddEditRefundFormModalClicked(true);
              this.financialVendorRefundFacade.showHideSnackBar(
                SnackBarNotificationType.SUCCESS,
                'Pharmacy Refund Updated Successfuly'
              );
            },
            error: (error: any) => {
              if (error) {
                this.financialVendorRefundFacade.showHideSnackBar(
                  SnackBarNotificationType.ERROR,
                  error
                );
                this.financialVendorRefundFacade.hideLoader();
              }
            },
          });
      }
    }
  }
  scrollToValidationError(){
    const invalidControl = this.scrollFocusValidationfacade.findInvalidControl(this.refundRXForm, this.elementRef.nativeElement,null);
    if (invalidControl) {
      invalidControl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      invalidControl.focus();
    }
  validateFormat(cardnumber: any): string {
    const sanitizedValue = cardnumber.replace(/[^\d]/g, '');
    const regex = /^(\d{0,6})(\d{0,3})/;
    const matches = sanitizedValue.match(regex);

    if (matches) {
      return `${matches[1]}${matches[1] && matches[2] ? '-' : ''}${matches[2]}`;
    }

    return sanitizedValue;
  }
  validateCreditNumber(event: any): void {
    const inputValue = event.target.value;
    const formattedValue = this.validateFormat(inputValue);
    event.target.value = formattedValue;
  }
  onRefundNoteValueChange(event: any) {
    this.refundNoteValueLength = event.length;
  }
  onSpotsPaymentChange(check: any) {
    this.isSpotsPayment = check.currentTarget.checked;
  }

  selectedRxClaimsChangeEvent(event: any) {
    if (this.claimsCount != 0) {
      if (event != null) {
        this.claimsCount = event.length;
        this.rxPaymentReqIds = event;
      }
    }
  }
  validatePayable(validatePayable: any): string {
    const sanitizedValue = validatePayable.replace(/[^a-zA-Z\d]/g, '');
    const regex = /^([a-zA-Z]{2,3}\d{0,6})(\d{0,3})/;
    const matches = sanitizedValue.match(regex);

    if (matches) {
      return `${matches[1]}${matches[1] && matches[2] ? '-' : ''}${matches[2]}`;
    }

    return sanitizedValue;
  }

  validateVoucherPayable(event: any): void {
    const inputValue = event.target.value;
    const formattedValue = this.validatePayable(inputValue);
    event.target.value = formattedValue;
  }

  getPaymentTypeLov() {
    this.paymentType$.subscribe({
      next: (data: any) => {
        this.paymentTypeData = data;
      },
    });
  }

  dropdownFilterChange(
    field: string,
    value: any,
    filterService: FilterService
  ): void {
    this.selectedPaymentType = value;
    filterService.filter({
      filters: [
        {
          field: field,
          operator: 'eq',
          value: value.lovDesc,
        },
      ],
      logic: 'or',
    });
  }
}
