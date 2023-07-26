
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa'; 
import { Router } from '@angular/router';
import {  GridDataResult } from '@progress/kendo-angular-grid';
import {
  CompositeFilterDescriptor,
  State,
  filterBy,
} from '@progress/kendo-data-query';
import { Subject } from 'rxjs';
import { DialogService } from '@progress/kendo-angular-dialog';

@Component({
  selector: 'cms-medical-premiums-all-payments-list',
  templateUrl: './medical-premiums-all-payments-list.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalPremiumsAllPaymentsListComponent implements OnInit, OnChanges{
  @ViewChild('previewSubmitPaymentDialogTemplate', { read: TemplateRef })
  previewSubmitPaymentDialogTemplate!: TemplateRef<any>;
  @ViewChild('unBatchPaymentDialogTemplate', { read: TemplateRef })
  unBatchPaymentDialogTemplate!: TemplateRef<any>;
  @ViewChild('deletePaymentDialogTemplate', { read: TemplateRef })
  deletePaymentDialogTemplate!: TemplateRef<any>;

  public formUiStyle: UIFormStyle = new UIFormStyle();
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  isMedicalPremiumsAllPaymentsGridLoaderShow = false;
  
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() medicalPremiumsAllPaymentsGridLists$: any;
  @Output() loadMedicalPremiumsAllPaymentsListEvent = new EventEmitter<any>();

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

  gridMedicalPremiumsAllPaymentsDataSubject = new Subject<any>();
  gridMedicalPremiumsAllPaymentsData$ = this.gridMedicalPremiumsAllPaymentsDataSubject.asObservable();
  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  PreviewSubmitPaymentDialog: any;
  printAuthorizationDialog: any;
  deletePaymentDialog: any;
  unBatchPaymentDialog: any;
  isRequestPaymentClicked = false;
  isPrintAuthorizationClicked = false;
  isUnBatchPaymentOpen = false;
  isDeletePaymentOpen = false;

  public allPaymentsGridActions = [
 
    {
      buttonType: 'btn-h-primary',
      text: 'Unbatch Payment',
      icon: 'undo', 
      click: (data: any): void => {
            if(!this.isUnBatchPaymentOpen){
              this.isUnBatchPaymentOpen = true;
              this.onUnBatchPaymentOpenClicked(this.unBatchPaymentDialogTemplate);
            }
       
      }
    },
    {
      buttonType: 'btn-h-danger',
      text: 'Delete Payment',
      icon: 'delete', 
      click: (data: any): void => {
        if(!this.isDeletePaymentOpen){
          this.isDeletePaymentOpen = true;
          this.onDeletePaymentOpenClicked(this.deletePaymentDialogTemplate);
        }
       
      }
    },
  ];


  public bulkMore = [
    {
      buttonType: 'btn-h-primary',
      text: 'Request Payments',
      icon: 'local_atm',
      click: (data: any): void => {
      this.isRequestPaymentClicked = true;
      this.isPrintAuthorizationClicked = false;
        
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

    {
      buttonType: 'btn-h-primary',
      text: 'Print Authorizations',
      icon: 'print',
      click: (data: any): void => {
        this.isRequestPaymentClicked = false;
        this.isPrintAuthorizationClicked = true;
          
        },
    },
  ];
  
  constructor(private route: Router,private dialogService: DialogService ) {}

  ngOnInit(): void {
    this.loadMedicalPremiumsAllPaymentsListGrid();
  }
  ngOnChanges(): void {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };

    this.loadMedicalPremiumsAllPaymentsListGrid();
  }


  private loadMedicalPremiumsAllPaymentsListGrid(): void {
    this.loadRefundAllPayments(
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType
    );
  }
  loadRefundAllPayments(
    skipCountValue: number,
    maxResultCountValue: number,
    sortValue: string,
    sortTypeValue: string
  ) {
    this.isMedicalPremiumsAllPaymentsGridLoaderShow = true;
    const gridDataRefinerValue = {
      skipCount: skipCountValue,
      pagesize: maxResultCountValue,
      sortColumn: sortValue,
      sortType: sortTypeValue,
    };
    this.loadMedicalPremiumsAllPaymentsListEvent.emit(gridDataRefinerValue);
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
    this.loadMedicalPremiumsAllPaymentsListGrid();
  }

  // updating the pagination infor based on dropdown selection
  pageSelectionChange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadMedicalPremiumsAllPaymentsListGrid();
  }

  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
  }

  gridDataHandle() {
    this.medicalPremiumsAllPaymentsGridLists$.subscribe((data: GridDataResult) => {
      this.gridDataResult = data;
      this.gridDataResult.data = filterBy(
        this.gridDataResult.data,
        this.filterData
      );
      this.gridMedicalPremiumsAllPaymentsDataSubject.next(this.gridDataResult);
      if (data?.total >= 0 || data?.total === -1) { 
        this.isMedicalPremiumsAllPaymentsGridLoaderShow = false;
      }
    });
    this.isMedicalPremiumsAllPaymentsGridLoaderShow = false;
  }
  navToReconcilePayments(event : any){  
    this.route.navigate(['/financial-management/insurance-premiums/payments/reconcile-payments'] );
  }
  
 
  public onPreviewSubmitPaymentOpenClicked(template: TemplateRef<unknown>): void {
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

  onBulkOptionCancelClicked(){
    this.isRequestPaymentClicked = false;
    this.isPrintAuthorizationClicked = false;
  }

  public onPrintAuthorizationOpenClicked(template: TemplateRef<unknown>): void {
    this.printAuthorizationDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-lg app-c-modal-np',
    });
  }

 
  onPrintAuthorizationCloseClicked(result: any) {
    if (result) { 
      this.printAuthorizationDialog.close();
    }
  }

  onUnBatchPaymentOpenClicked(template: TemplateRef<unknown>): void {
    this.unBatchPaymentDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    });
  }

  onUnBatchPaymentCloseClicked(result: any){
    if (result) { 
      this.isUnBatchPaymentOpen = false;
      this.unBatchPaymentDialog.close();
    }
  }
  onDeletePaymentOpenClicked(template: TemplateRef<unknown>): void {
    this.deletePaymentDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    });
  }
  onDeletePaymentCloseClicked(result: any){

    if (result) { 
      this.isDeletePaymentOpen = false;
      this.deletePaymentDialog.close();
    }
  }

  
}