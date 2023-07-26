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
import { GridDataResult } from '@progress/kendo-angular-grid';
import {
  CompositeFilterDescriptor,
  State,
  filterBy,
} from '@progress/kendo-data-query';
import { Subject } from 'rxjs';
@Component({
  selector: 'cms-medical-premiums-process-list',
  templateUrl: './medical-premiums-process-list.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalPremiumsProcessListComponent implements OnInit, OnChanges {
  @ViewChild('batchPremiumsConfirmationDialog', { read: TemplateRef })
  batchPremiumsConfirmationDialog!: TemplateRef<any>;
  @ViewChild('deletePremiumsConfirmationDialog', { read: TemplateRef })
  deletePremiumsConfirmationDialog!: TemplateRef<any>;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  private deletePremiumsDialog: any;
  private batchConfirmPremiumsDialog: any;
  private addEditPremiumsFormDialog: any;
  private addClientRecentPremiumsDialog: any;
  isDeleteBatchClosed = false;
  isBatchPremiumsOption = false;
  isDeletePremiumsOption = false;
  isProcessBatchClosed = false;
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  isProcessGridExpand = true;
  isMedicalPremiumsProcessGridLoaderShow = false;
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() medicalPremiumsProcessGridLists$: any;
  @Output() loadMedicalPremiumsProcessListEvent = new EventEmitter<any>();
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

  gridMedicalPremiumsProcessDataSubject = new Subject<any>();
  gridMedicalPremiumsProcessData$ =
    this.gridMedicalPremiumsProcessDataSubject.asObservable();
  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  public premiumsProcessMore = [
    {
      buttonType: 'btn-h-primary',
      text: 'Batch Premiums',
      icon: 'check',
      click: (data: any): void => {
        if (!this.isProcessBatchClosed) {
          this.isProcessBatchClosed = true; 
          this.onBatchPremiumsGridSelectedClicked();
        }
      },
    },

    {
      buttonType: 'btn-h-danger',
      text: 'Delete Premiums',
      icon: 'delete',
      click: (data: any): void => {
        if (!this.isDeleteBatchClosed) {
          this.isDeleteBatchClosed = true; 
          this.onBatchPremiumsGridSelectedClicked();
        }
      },
    },
  ];
  public processGridActions = [
    {
      buttonType: 'btn-h-primary',
      text: 'Edit Premiums',
      icon: 'edit',
    },
    {
      buttonType: 'btn-h-danger',
      text: 'Delete Premiums',
      icon: 'delete',
    },
  ];


  /** Constructor **/
  constructor(
    private readonly cdr: ChangeDetectorRef,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.loadMedicalPremiumsProcessListGrid();
  }
  ngOnChanges(): void {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };

    this.loadMedicalPremiumsProcessListGrid();
  }

  private loadMedicalPremiumsProcessListGrid(): void {
    this.loadPremiumsProcess(
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType
    );
  }
  loadPremiumsProcess(
    skipCountValue: number,
    maxResultCountValue: number,
    sortValue: string,
    sortTypeValue: string
  ) {
    this.isMedicalPremiumsProcessGridLoaderShow = true;
    const gridDataRefinerValue = {
      skipCount: skipCountValue,
      pagesize: maxResultCountValue,
      sortColumn: sortValue,
      sortType: sortTypeValue,
    };
    this.loadMedicalPremiumsProcessListEvent.emit(gridDataRefinerValue);
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
    this.loadMedicalPremiumsProcessListGrid();
  }

  // updating the pagination infor based on dropdown selection
  pageSelectionChange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadMedicalPremiumsProcessListGrid();
  }

  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
  }

  gridDataHandle() {
    this.medicalPremiumsProcessGridLists$.subscribe((data: GridDataResult) => {
      this.gridDataResult = data;
      this.gridDataResult.data = filterBy(
        this.gridDataResult.data,
        this.filterData
      );
      this.gridMedicalPremiumsProcessDataSubject.next(this.gridDataResult);
      if (data?.total >= 0 || data?.total === -1) {
        this.isMedicalPremiumsProcessGridLoaderShow = false;
      }
    });
    this.isMedicalPremiumsProcessGridLoaderShow = false;
  }

  public onBatchPremiumsClicked(template: TemplateRef<unknown>): void {
    this.batchConfirmPremiumsDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    });
  }
  onModalBatchPremiumsModalClose(result: any) {
    if (result) { 
      this.batchConfirmPremiumsDialog.close();
    }
  }

  public onDeletePremiumsOpenClicked(template: TemplateRef<unknown>): void {
    this.deletePremiumsDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    });
  }
  onModalDeletePremiumsModalClose(result: any) {
    if (result) { 
      this.deletePremiumsDialog.close();
    }
  }

  onClickOpenAddEditPremiumsFromModal(template: TemplateRef<unknown>): void {
    this.addEditPremiumsFormDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-full add_premiums_modal',
    });
  }
  modalCloseAddEditPremiumsFormModal(result: any) {
    if (result) {
      this.addEditPremiumsFormDialog.close();
    }
  }

  onBatchPremiumsGridSelectedClicked() {
    this.isProcessGridExpand = false;
  }

  onBatchPremiumsGridSelectedCancelClicked() {
    this.isProcessGridExpand = true;
    this.isDeleteBatchClosed = false;
    this.isProcessBatchClosed = false;
  
  }

  clientRecentPremiumsModalClicked (template: TemplateRef<unknown>, data:any): void {
    this.addClientRecentPremiumsDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal  app-c-modal-bottom-up-modal',
      animation:{
        direction: 'up',
        type:'slide',
        duration: 200
      }
    });
  }

  closeRecentPremiumsModal(result: any){
    if (result) { 
      this.addClientRecentPremiumsDialog.close();
    }
  }
 
}
