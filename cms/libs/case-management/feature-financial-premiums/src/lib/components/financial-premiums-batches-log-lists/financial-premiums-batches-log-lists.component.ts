/** Angular **/
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  OnChanges,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { FilterService, GridDataResult } from '@progress/kendo-angular-grid';
import { DialogService } from '@progress/kendo-angular-dialog';
import {  CompositeFilterDescriptor,  State,} from '@progress/kendo-data-query';
import { Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { LovFacade } from '@cms/system-config/domain';
@Component({
  selector: 'cms-financial-premiums-batches-log-lists',
  templateUrl: './financial-premiums-batches-log-lists.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialPremiumsBatchesLogListsComponent
  implements OnInit, OnChanges
{
  @ViewChild('previewSubmitPaymentDialogTemplate', { read: TemplateRef })
  previewSubmitPaymentDialogTemplate!: TemplateRef<any>;
  @ViewChild('unBatchPaymentPremiumsDialogTemplate', { read: TemplateRef })
  unBatchPaymentPremiumsDialogTemplate!: TemplateRef<any>;
  @ViewChild('removePremiumsConfirmationDialogTemplate', { read: TemplateRef })
  removePremiumsConfirmationDialogTemplate!: TemplateRef<any>;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  yesOrNoLov$ = this.lovFacade.yesOrNoLov$;
  isBatchLogGridLoaderShow = false;
  isRequestPaymentClicked = false;
  isSendReportOpened = false;
  isUnBatchPaymentPremiumsClosed = false;
  isRemoveClaimClosed = false;
  PreviewSubmitPaymentDialog: any;
  UnBatchPaymentDialog: any;
  removePremiumsDialog: any;
  addClientRecentPremiumsDialog: any;
  acceptReportValue = null
  vendorId:any;
  clientId:any;
  clientName:any="";

  yesOrNoLovs:any=[];
  public bulkMore = [
    {
      buttonType: 'btn-h-primary',
      text: 'Send Report',
      icon: 'mail',
      click: (data: any): void => {
        this.isRequestPaymentClicked = false;
        this.isSendReportOpened = true;
      },
    },
    {
      buttonType: 'btn-h-primary',
      text: 'Request Payments',
      icon: 'local_atm',
      click: (data: any): void => {
        this.isRequestPaymentClicked = true;
        this.isSendReportOpened = false;
      },
    },

    {
      buttonType: 'btn-h-primary',
      text: 'Reconcile Payments',
      icon: 'edit',
      click: (data: any): void => {
        this.navToReconcilePayments(data);
      },
    },
  ];

  public batchLogGridActions = [

    {
      buttonType: 'btn-h-primary',
      text: 'UnBatch Payment',
      icon: 'undo',
      click: (data: any): void => {
        if (!this.isUnBatchPaymentPremiumsClosed) {
          this.isUnBatchPaymentPremiumsClosed = true;
          this.onUnBatchPaymentOpenClicked(this.unBatchPaymentPremiumsDialogTemplate);
        }
      },
    },
    {
      buttonType: 'btn-h-danger',
      text: 'Delete Payment',
      icon: 'delete',
      click: (data: any): void => {
        if (!this.isRemoveClaimClosed) {
          this.isRemoveClaimClosed = true;
          this.onRemovePremiumsOpenClicked(
            this.removePremiumsConfirmationDialogTemplate
          );
        }
      },
    },
  ];

  columns : any = {
    itemNbr:"Item #",
    vendorName:"Insurance Vendor",
    serviceCount:"Item Count",
    serviceCost:"Total Amount",
    acceptsReports:"Accepts reports?",
    paymentRequestedDate:"Date Pmt. Requested",
    paymentSentDate:"Date Pmt. Sent",
    paymentMethodCode:"Pmt. Method",
    paymentStatusCode:"Pmt. Status",
    pca:"PCA",
    mailCode:"Mail Code"
  }
  @Input() premiumsType: any;
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() batchLogGridLists$: any;
  @Output() loadBatchLogListEvent = new EventEmitter<any>();
  public state!: State;

  sortColumn = 'Item #';
  sortDir = 'Ascending';
  columnsReordered = false;
  filteredBy = '';
  searchValue = '';
  isFiltered = false;
  filter!: any;
  selectedColumn!: any;
  gridDataResult!: GridDataResult;
  gridPremiumsBatchLogDataSubject = new Subject<any>();
  gridPremiumsBatchLogData$ =
    this.gridPremiumsBatchLogDataSubject.asObservable();
  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  sendReportDialog: any;
  /** Constructor **/
  constructor(private route: Router, private dialogService: DialogService,
     public activeRoute: ActivatedRoute,private readonly lovFacade: LovFacade) {}

  ngOnInit(): void {
    this.loadBatchLogListGrid();
    this.lovFacade.getYesOrNoLovs();
    this.loadYesOrNoLovs();
  }
  ngOnChanges(): void {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };

    this.loadBatchLogListGrid();
  }

  private loadBatchLogListGrid(): void {
    this.isBatchLogGridLoaderShow = true;
    this.loadBatchLog(
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType
    );
  }
  loadBatchLog(
    skipCountValue: number,
    maxResultCountValue: number,
    sortValue: string,
    sortTypeValue: string
  ) {
    this.isBatchLogGridLoaderShow = true;
    const gridDataRefinerValue = {
      skipCount: skipCountValue,
      pagesize: maxResultCountValue,
      sortColumn: sortValue ?? 'itemNbr',
      sortType: sortTypeValue ?? 'asc',
      filter: this.state?.['filter']?.['filters'] ?? [],
    };
    this.loadBatchLogListEvent.emit(gridDataRefinerValue);
    this.gridDataHandle();
  }

  onChange(data: any) {
    this.defaultGridState();

    this.filterData = {
      logic: 'and',
      filters: [
        {
          filters: [
            {
              field: this.selectedColumn ?? 'itemNbr',
              operator: 'startswith',
              value: data,
            },
          ],
          logic: 'and',
        },
      ],
    };
    const stateData = this.state;
    stateData.filter = this.filterData;
    this.dataStateChange(stateData);
  }

  defaultGridState() {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
      filter: { logic: 'and', filters: [] },
    };
  }

  onColumnReorder($event: any) {
    this.columnsReordered = true;
  }

  dataStateChange(stateData: any): void {
    this.sort = stateData.sort;
    this.sortValue = stateData.sort[0]?.field ?? this.sortValue;
    this.sortType = stateData.sort[0]?.dir ?? 'asc';
    this.state = stateData;
    this.sortDir = this.sort[0]?.dir === 'asc' ? 'Ascending' : 'Descending';

    this.sortColumn = this.columns[stateData.sort[0]?.field];

    if (stateData.filter?.filters.length > 0) {
      const stateFilter = stateData.filter?.filters.slice(-1)[0].filters[0];
      this.filter = stateFilter.value;
      this.isFiltered = true;
      const filterList = [];
      for (const filter of stateData.filter.filters) {
        filterList.push(this.columns[filter.filters[0].field]);
      }
      this.filteredBy = filterList.toString();
    } else {
      this.filter = '';
      this.isFiltered = false;
    }
    this.loadBatchLogListGrid();
  }

  // updating the pagination infor based on dropdown selection
  pageSelectionChange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadBatchLogListGrid();
  }

  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
  }

  gridDataHandle() {
    this.batchLogGridLists$.subscribe((data: GridDataResult) => {
      this.gridDataResult = data;
      this.gridPremiumsBatchLogDataSubject.next(this.gridDataResult);
      if (data?.total >= 0 || data?.total === -1) {
        this.isBatchLogGridLoaderShow = false;
      }
      this.isBatchLogGridLoaderShow = false;
    });
    this.isBatchLogGridLoaderShow = false;
  }

  backToBatch(event: any) {
    this.route.navigate(['/financial-management/premiums/' + this.premiumsType] );
  }

  goToBatchItems(event: any) {
    this.route.navigate(['/financial-management/premiums/' + this.premiumsType +'/batch/items'] );
  }

  navToReconcilePayments(event: any) {
    this.route.navigate([
      '/financial-management/premiums/'+ this.premiumsType +'/batch/reconcile-payments',
    ]);
  }
  public onPreviewSubmitPaymentOpenClicked(
    template: TemplateRef<unknown>
  ): void {
    this.PreviewSubmitPaymentDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-lg app-c-modal-np',
    });
  }

  onPreviewSubmitPaymentCloseClicked(result: any) {
    if (result) {
      this.PreviewSubmitPaymentDialog.close();
    }
  }

  onBulkOptionCancelClicked() {
    this.isRequestPaymentClicked = false;
    this.isSendReportOpened = false;
  }

  public onSendReportOpenClicked(template: TemplateRef<unknown>): void {
    this.sendReportDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    });
  }

  onSendReportCloseClicked(result: any) {
    if (result) {
      this.sendReportDialog.close();
    }
  }

  onUnBatchPaymentOpenClicked(template: TemplateRef<unknown>): void {
    this.UnBatchPaymentDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    });
  }

  onUnBatchPaymentCloseClicked(result: any) {
    if (result) {
      this.isUnBatchPaymentPremiumsClosed = false;
      this.UnBatchPaymentDialog.close();
    }
  }

  public onRemovePremiumsOpenClicked(template: TemplateRef<unknown>): void {
    this.removePremiumsDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    });
  }
  onModalRemovePremiumsModalClose(result: any) {
    if (result) {
      this.removePremiumsDialog.close();
    }
  }



  clientRecentPremiumsModalClicked (template: TemplateRef<unknown>, data: any): void {
    this.addClientRecentPremiumsDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal  app-c-modal-bottom-up-modal',
      animation:{
        direction: 'up',
        type:'slide',
        duration: 200
      }
    });
    this.vendorId="3F111CFD-906B-4F56-B7E2-7FCE5A563C36";
    this.clientId=5;
    this.clientName="Jason Biggs";
  }

  closeRecentPremiumsModal(result: any){
    if (result) {
      this.addClientRecentPremiumsDialog.close();
    }
  }

  private loadYesOrNoLovs() {
    this.yesOrNoLov$
    .subscribe({
      next: (data: any) => {
        this.yesOrNoLovs=data;
      }
    });
  }

  dropdownFilterChange(field:string, value: any, filterService: FilterService): void {

    this.acceptReportValue = value
    this.filterData = {
      logic: 'and',
      filters: [
        {
          filters: [
            {
              field: field,
              operator: 'eq',
              value: value?.lovCode,
            },
          ],
          logic: 'and',
        },
      ],
    };
    const stateData = this.state;
    stateData.filter = this.filterData;
    this.dataStateChange(stateData);
  }

  setToDefault() {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };

    this.sortColumn = 'Item #';
    this.sortDir = 'Ascending';
    this.filter = '';
    this.searchValue = '';
    this.isFiltered = false;
    this.columnsReordered = false;

    this.sortValue = 'itemNbr';
    this.sortType = 'asc';
    this.sort = this.sortColumn;

    this.loadBatchLogListGrid();
  }

  onClientClicked(clientId: any) {
    this.route.navigate([`/case-management/cases/case360/${clientId}`]);
    this.closeRecentPremiumsModal(true);
  }
}
