/** Angular **/
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { DialogService } from '@progress/kendo-angular-dialog';
import { GridDataResult, SelectableMode, SelectableSettings } from '@progress/kendo-angular-grid';
import {
  CompositeFilterDescriptor,
  State,
  filterBy,
} from '@progress/kendo-data-query';
import { Subject } from 'rxjs';

import { BatchClaim, VendorClaimsFacade } from '@cms/case-management/domain';
import { SnackBarNotificationType } from '@cms/shared/util-core';
@Component({
  selector: 'cms-medical-claims-process-list',
  templateUrl: './medical-claims-process-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalClaimsProcessListComponent implements OnInit, OnChanges {
  @ViewChild('batchClaimsConfirmationDialog', { read: TemplateRef })
  batchClaimsConfirmationDialog!: TemplateRef<any>;
  @ViewChild('deleteClaimsConfirmationDialog', { read: TemplateRef })
  deleteClaimsConfirmationDialog!: TemplateRef<any>;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  private deleteClaimsDialog: any;
  private batchConfirmClaimsDialog: any;
  private addEditClaimsFormDialog: any;
  private addClientRecentClaimsDialog: any;
  isDeleteBatchClosed = false;
  isBatchClaimsOption = false;
  isDeleteClaimsOption = false;
  isProcessBatchClosed = false;
  public selectedProcessClaims: string[] = [];
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  isProcessGridExpand = true;
  isMedicalClaimsProcessGridLoaderShow = false;
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() medicalClaimsProcessGridLists$: any;
  @Output() loadMedicalClaimsProcessListEvent = new EventEmitter<any>();
  public state!: State;
  sortColumn = 'vendorName';
  sortDir = 'Ascending';
  columnsReordered = false;
  filteredBy = '';
  searchValue = '';
  isFiltered = false;
  filter!: any;
  selectedColumn!: any;
  gridDataResult!: GridDataResult;
  gridMedicalClaimsProcessDataSubject = new Subject<any>();
  gridMedicalClaimsProcessData$ =
    this.gridMedicalClaimsProcessDataSubject.asObservable();
  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  public checkboxOnly = true;
  public mode: SelectableMode = "multiple";
  public drag = false;
  public selectableSettings: SelectableSettings;
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  public claimsProcessMore = [
    {
      buttonType: 'btn-h-primary',
      text: 'Batch Claims',
      icon: 'check',
      click: (data: any): void => {
        if (!this.isProcessBatchClosed) {
          this.isProcessBatchClosed = true;
          this.onBatchClaimsGridSelectedClicked();
        }
      },
    },

    {
      buttonType: 'btn-h-danger',
      text: 'Delete Claims',
      icon: 'delete',
      click: (data: any): void => {
        if (!this.isDeleteBatchClosed) {
          this.isDeleteBatchClosed = true;
          this.onBatchClaimsDeleteGridSelectedClicked();
        }
      },
    },
  ];
  public processGridActions = [
    {
      buttonType: 'btn-h-primary',
      text: 'Edit Claims',
      icon: 'edit',
    },
    {
      buttonType: 'btn-h-danger',
      text: 'Delete Claims',
      icon: 'delete',
    },
  ];


  /** Constructor **/
  constructor(
    private readonly cdr: ChangeDetectorRef,
    private dialogService: DialogService,
    private vendorClaimsFacade: VendorClaimsFacade
  ) {
    this.selectableSettings = {
      checkboxOnly: this.checkboxOnly,
      mode: this.mode,
      drag: this.drag,
    };
  }

  ngOnInit(): void {
    this.loadMedicalClaimsProcessListGrid();
  }
  ngOnChanges(): void {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };

    this.loadMedicalClaimsProcessListGrid();
  }

  private loadMedicalClaimsProcessListGrid(): void {
    this.loadClaimsProcess(
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType
    );
  }
  loadClaimsProcess(
    skipCountValue: number,
    maxResultCountValue: number,
    sortValue: string,
    sortTypeValue: string
  ) {
    this.isMedicalClaimsProcessGridLoaderShow = true;
    const gridDataRefinerValue = {
      skipCount: skipCountValue,
      pagesize: maxResultCountValue,
      sortColumn: sortValue,
      sortType: sortTypeValue,
    };
    this.loadMedicalClaimsProcessListEvent.emit(gridDataRefinerValue);
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
    this.loadMedicalClaimsProcessListGrid();
  }

  // updating the pagination infor based on dropdown selection
  pageSelectionChange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadMedicalClaimsProcessListGrid();
  }

  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
  }

  gridDataHandle() {
    this.medicalClaimsProcessGridLists$.subscribe((data: GridDataResult) => {
      this.gridDataResult = {"total":1,"data":[
        {
        "invoiceID":"34343",
        "providerName":"providerName",
        "taxID":"taxID",
        "paymentMethod":"paymentMethod",
        "clientName":"clientName",
        "nameOnPrimaryInsuranceCard":"nameOnPrimaryInsuranceCard",
        "memberID":"providerName",
        "serviceCount":"serviceCount",
        "totalCost":"totalCost",
        "totalDue":"totalDue",
        "paymentStatus":"paymentStatus",
        "by":"by"
        },
        {
          "invoiceID":"2222122",
          "providerName":"providerName",
          "taxID":"taxID",
          "paymentMethod":"paymentMethod",
          "clientName":"clientName",
          "nameOnPrimaryInsuranceCard":"nameOnPrimaryInsuranceCard",
          "memberID":"providerName",
          "serviceCount":"serviceCount",
          "totalCost":"totalCost",
          "totalDue":"totalDue",
          "paymentStatus":"paymentStatus",
          "by":"by"
          }
      ]};//data;
      this.gridDataResult.data = filterBy(
        this.gridDataResult.data,
        this.filterData
      );
      this.gridMedicalClaimsProcessDataSubject.next(this.gridDataResult);
      if (data?.total >= 0 || data?.total === -1) {
        this.isMedicalClaimsProcessGridLoaderShow = false;
      }
    });
    this.isMedicalClaimsProcessGridLoaderShow = false;
  }

  public onBatchClaimsClicked(template: TemplateRef<unknown>): void {
    this.batchConfirmClaimsDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    });
  }
  onModalBatchClaimsModalClose() {
    this.batchConfirmClaimsDialog.close();
  }
  onModalBatchClaimsButtonClicked(managerId: string) {
    if (managerId) {
      const input: BatchClaim = {
        managerId: managerId,
        invoiceNumbers: this.selectedProcessClaims
      }
      this.vendorClaimsFacade.batchClaims(input).subscribe(res =>{
        if(res)
        this.vendorClaimsFacade.showHideSnackBar(
          SnackBarNotificationType.SUCCESS,
          'Claim(s) batched!'
        );
        this.batchConfirmClaimsDialog.close();
      })
    }
  }

  public onDeleteClaimsOpenClicked(template: TemplateRef<unknown>): void {
    this.deleteClaimsDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    });
  }
  onModalDeleteClaimsModalClose(result: any) {
    if (result) {
      this.deleteClaimsDialog.close();
    }
  }

  onClickOpenAddEditClaimsFromModal(template: TemplateRef<unknown>): void {
    this.addEditClaimsFormDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-full add_claims_modal',
    });
  }
  modalCloseAddEditClaimsFormModal(result: any) {
    if (result) {
      this.addEditClaimsFormDialog.close();
    }
  }

  onBatchClaimsGridSelectedClicked() {
    this.isProcessGridExpand = false;
    console.log("selectedProcessClaims",this.selectedProcessClaims)
  }
  onBatchClaimsDeleteGridSelectedClicked(){
    this.isProcessGridExpand = false;
  }
  selectedKeysChange(selection:any){
    this.selectedProcessClaims = selection;
  }
  onBatchClaimsGridSelectedCancelClicked() {
    this.isProcessGridExpand = true;
    this.isDeleteBatchClosed = false;
    this.isProcessBatchClosed = false;
    this.selectedProcessClaims = [];
  }

  clientRecentClaimsModalClicked (template: TemplateRef<unknown>, data:any): void {
    this.addClientRecentClaimsDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal  app-c-modal-bottom-up-modal',
      animation:{
        direction: 'up',
        type:'slide',
        duration: 200
      }
    });
  }

  closeRecentClaimsModal(result: any){
    if (result) {
      this.addClientRecentClaimsDialog.close();
    }
  }

}
