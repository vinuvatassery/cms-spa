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
  ChangeDetectorRef,
  OnDestroy
} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa'; 
import {  GridDataResult } from '@progress/kendo-angular-grid';
import {
  CompositeFilterDescriptor,
  State,
  filterBy,
} from '@progress/kendo-data-query';
import { Subject, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { DialogService } from '@progress/kendo-angular-dialog';
import { UserManagementFacade } from '@cms/system-config/domain';
@Component({
  selector: 'cms-pharmacy-claims-batch-list-detail-items',
  templateUrl: './pharmacy-claims-batch-list-detail-items.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PharmacyClaimsBatchListDetailItemsComponent implements OnInit, OnChanges, OnDestroy {
 
  public formUiStyle: UIFormStyle = new UIFormStyle();
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  isBatchLogItemsGridLoaderShow = false;

  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() batchItemsGridLists$: any;
  @Input() pharmacyBatchListDetailProfilePhoto$!: any;
  @Output() loadBatchItemsListEvent = new EventEmitter<any>();
  @Output() onProviderNameClickEvent = new EventEmitter<any>();
  public state!: State;
  sortColumn = 'batch';
  sortDir = 'Ascending';
  columnsReordered = false;
  filteredBy = '';
  searchValue = '';
  isFiltered = false;
  filter!: any;
  selectedColumn!: any;
  gridDataResult!: GridDataResult;
  providerDetailsDialog: any;
  paymentDetailsDialog: any;
  gridClaimsBatchLogItemsDataSubject = new Subject<any>();
  gridClaimsBatchLogItemsData$ = this.gridClaimsBatchLogItemsDataSubject.asObservable();
  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  pharmacyBatchListDetailProfilePhotoSubject = new Subject();
  pharmacyBatchListDetailListSubscription = new Subscription();
  
  /** Constructor **/
  constructor(private route: Router, private dialogService: DialogService,
    private readonly userManagementFacade: UserManagementFacade,
    private readonly cdr: ChangeDetectorRef) {}
  
  ngOnInit(): void {
    this.loadBatchLogItemsListGrid();
  }
  ngOnChanges(): void {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };

    this.loadBatchLogItemsListGrid();
  }


  private loadBatchLogItemsListGrid(): void {
    this.loadBatchLogItems(
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType
    );
  }
  loadBatchLogItems(
    skipCountValue: number,
    maxResultCountValue: number,
    sortValue: string,
    sortTypeValue: string
  ) {
    this.isBatchLogItemsGridLoaderShow = true;
    const gridDataRefinerValue = {
      skipCount: skipCountValue,
      pagesize: maxResultCountValue,
      sortColumn: sortValue,
      sortType: sortTypeValue,
    };
    this.loadBatchItemsListEvent.emit(gridDataRefinerValue);
    this.gridDataHandle();
  }
 
  ngOnDestroy(): void {
    this.pharmacyBatchListDetailListSubscription?.unsubscribe();
  }
  
  onChange(data: any) {
    this.defaultGridState();

    this.filterData = {
      logic: 'and',
      filters: [
        {
          filters: [
            {
              field: this.selectedColumn ?? 'vendorName',
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
    this.loadBatchLogItemsListGrid();
  }

  // updating the pagination infor based on dropdown selection
  pageSelectionChange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadBatchLogItemsListGrid();
  }

  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
  }

  gridDataHandle() {
    this.pharmacyBatchListDetailListSubscription = this.batchItemsGridLists$.subscribe((data: GridDataResult) => {
      this.gridDataResult = data;
      this.gridDataResult.data = filterBy(
        this.gridDataResult.data,
        this.filterData
      );
      this.gridClaimsBatchLogItemsDataSubject.next(this.gridDataResult);
      if (data?.total >= 0 || data?.total === -1) { 
        this.isBatchLogItemsGridLoaderShow = false;     
      }
    });
    this.isBatchLogItemsGridLoaderShow = false;
  }

  backToBatchLog(event : any){  
    this.route.navigate(['/financial-management/pharmacy-claims/batch'] );
  }
  onCloseViewProviderDetailClicked(result: any){
    if(result){
      this.providerDetailsDialog.close();
    }
  }


  onPaymentDetailFormClicked(  template: TemplateRef<unknown>): void {   
    this.paymentDetailsDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-np app-c-modal-sm',
    });
  }

  onClosePaymentDetailFormClicked(result: any){
    if(result){
      this.paymentDetailsDialog.close();
    }
  }
  onViewProviderDetailClicked(): void {   
    this.onProviderNameClickEvent.emit();
  }
}
