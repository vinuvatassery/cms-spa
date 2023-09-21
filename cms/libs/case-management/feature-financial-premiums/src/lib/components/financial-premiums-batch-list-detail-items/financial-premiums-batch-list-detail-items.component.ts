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
  ChangeDetectorRef
} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa'; 
import {  GridDataResult } from '@progress/kendo-angular-grid';
import {
  CompositeFilterDescriptor,
  State,
  filterBy,
} from '@progress/kendo-data-query';
import { Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from '@progress/kendo-angular-dialog';
@Component({
  selector: 'cms-financial-premiums-batch-list-detail-items',
  templateUrl: './financial-premiums-batch-list-detail-items.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialPremiumsBatchListDetailItemsComponent implements OnInit, OnChanges {
 
  public formUiStyle: UIFormStyle = new UIFormStyle();
  @ViewChild('editPremiumsDialogTemplate', { read: TemplateRef })
  editPremiumsDialogTemplate!: TemplateRef<any>;
  @ViewChild('unbatchPremiumFromTemplate', { read: TemplateRef })
  unbatchPremiumFromTemplate!: TemplateRef<any>;
  @ViewChild('removePremiumFromTemplate', { read: TemplateRef })
  removePremiumFromTemplate!: TemplateRef<any>;
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  isBatchLogItemsGridLoaderShow = false;
  @Input() paymentData$:any;
  @Input() premiumsType: any;
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() batchItemsGridLists$: any;
  @Output() loadBatchItemsListEvent = new EventEmitter<any>();
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
  premiumPaymentDetails: any;
  providerDetailsDialog: any;
  paymentDetailsDialog: any;
  editPremiumsFormDialog: any;
  unBatchPremiumDialog: any;
  removePremiumDialog: any;
  isEditPremiumsOpened = false;
  unBatchPremiumsOpened = false;
  removePremiumsOpened = false;
  gridClaimsBatchLogItemsDataSubject = new Subject<any>();
  gridClaimsBatchLogItemsData$ = this.gridClaimsBatchLogItemsDataSubject.asObservable();
  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
 
  public batchItemGridActions = [
    {
      buttonType: 'btn-h-primary',
      text: 'Edit Premium',
      icon: 'edit',
      click: (data: any): void => {
        
        if (!this.isEditPremiumsOpened) {
          this.isEditPremiumsOpened = true;
          this.onClickOpenEditPremiumsFromModal(this.editPremiumsDialogTemplate);
        }
      },
    },
    {
      buttonType: 'btn-h-primary',
      text: 'Unbatch Premium',
      icon: 'undo',
      click: (data: any): void => {
        if (!this.unBatchPremiumsOpened) {
          this.unBatchPremiumsOpened = true;
          this.onClickOpenUnbatchPremiumModal(this.unbatchPremiumFromTemplate);
        }
      },
    },
    {
      buttonType: 'btn-h-danger',
      text: 'Remove Premium',
      icon: 'delete',
      click: (data: any): void => {
        if (!this.removePremiumsOpened) {
          this.removePremiumsOpened = true;
          this.onClickOpenRemovePremiumModal(this.removePremiumFromTemplate);
        }
      },
    },
  ];
  /** Constructor **/
  constructor(private route: Router, 
    private dialogService: DialogService,
    public activeRoute: ActivatedRoute,
    private readonly cd: ChangeDetectorRef) {}
  
  ngOnInit(): void {   
    this.loadBatchLogItemsListGrid();
  }
  ngOnChanges(): void {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };
    this.paymentData$.subscribe((data: any)=>{
      this.premiumPaymentDetails = data;
      this.cd.detectChanges();
    })
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
    this.batchItemsGridLists$.subscribe((data: GridDataResult) => {
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
    this.route.navigate(['/financial-management/premiums/' + this.premiumsType +'/batch'] ); 
  }


  onViewProviderDetailClicked(  template: TemplateRef<unknown>): void {   
    this.providerDetailsDialog = this.dialogService.open({
      content: template,
      animation:{
        direction: 'left',
        type: 'slide',  
      }, 
      cssClass: 'app-c-modal app-c-modal-np app-c-modal-right-side',
    });
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


  onClickOpenEditPremiumsFromModal(template: TemplateRef<unknown>): void {
    this.editPremiumsFormDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-full add_premiums_modal',
    });
  }
  modalCloseEditPremiumsFormModal(result: any) {
    if (result) {
      this.isEditPremiumsOpened = false;
      this.editPremiumsFormDialog.close();
    }
  }


  onClickOpenUnbatchPremiumModal(template: TemplateRef<unknown>): void {
    this.unBatchPremiumDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    });
  }
  modalCloseUnbatchPremiumModal(result: any) {
    if (result) {
      this.unBatchPremiumsOpened = false;
      this.unBatchPremiumDialog.close();
    }
  }


  onClickOpenRemovePremiumModal(template: TemplateRef<unknown>): void {
    this.removePremiumDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    });
  }
  modalCloseRemovePremiumModal(result: any) {
    if (result) {
      this.removePremiumsOpened = false;
      this.removePremiumDialog.close();
    }
  }

}
