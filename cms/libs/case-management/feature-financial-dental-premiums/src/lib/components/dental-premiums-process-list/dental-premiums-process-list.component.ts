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
  selector: 'cms-dental-premiums-process-list',
  templateUrl: './dental-premiums-process-list.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DentalPremiumsProcessListComponent implements OnInit, OnChanges {
  @ViewChild('batchPremiumsConfirmationDialogTemplate', { read: TemplateRef })
  batchPremiumsConfirmationDialogTemplate!: TemplateRef<any>;
  @ViewChild('removePremiumsConfirmationDialogTemplate', { read: TemplateRef })
  removePremiumsConfirmationDialogTemplate!: TemplateRef<any>;
  @ViewChild('editPremiumsDialogTemplate', { read: TemplateRef })
  editPremiumsDialogTemplate!: TemplateRef<any>;
  @ViewChild('addPremiumsDialogTemplate', { read: TemplateRef })
  addPremiumsDialogTemplate!: TemplateRef<any>;
  
  public formUiStyle: UIFormStyle = new UIFormStyle();
  private removePremiumsDialog: any;
  private batchConfirmPremiumsDialog: any;
  private editPremiumsFormDialog: any;
  private addPremiumsFormDialog: any;
  private addClientRecentPremiumsDialog: any;
  isRemoveBatchClosed = false;
  isBatchPremiumsClicked = false;
  isRemovePremiumsOption = false;
  isEditBatchClosed = false; 
  isAddPremiumClosed = false;
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  isProcessGridExpand = true;
  isDentalPremiumsProcessGridLoaderShow = false;
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() dentalPremiumsProcessGridLists$: any;
  @Output() loadDentalPremiumsProcessListEvent = new EventEmitter<any>();
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
  isRemovePremiumGridOptionClosed = false;
  gridDentalPremiumsProcessDataSubject = new Subject<any>();
  gridDentalPremiumsProcessData$ =
    this.gridDentalPremiumsProcessDataSubject.asObservable();
  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  public premiumsProcessMore = [
    {
      buttonType: 'btn-h-primary',
      text: 'Add Premiums',
      icon: 'add',
      click: (data: any): void => {
        if (!this.isAddPremiumClosed) {
          this.isAddPremiumClosed = true; 
          this.onClickOpenAddPremiumsFromModal(this.addPremiumsDialogTemplate);
        }
      },
    },

    {
      buttonType: 'btn-h-danger',
      text: 'Remove Premiums',
      icon: 'delete',
      click: (data: any): void => {
        if (!this.isRemoveBatchClosed) {
          this.isRemoveBatchClosed = true; 
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
      click: (data: any): void => {
        if (!this.isEditBatchClosed) {
          this.isEditBatchClosed = true; 
          this.onClickOpenEditPremiumsFromModal(this.editPremiumsDialogTemplate);
        }
      },
    },
    {
      buttonType: 'btn-h-danger',
      text: 'Remove Premiums',
      icon: 'delete',
      click: (data: any): void => {
        if (!this.isRemovePremiumGridOptionClosed) {
          this.isRemovePremiumGridOptionClosed = true; 
          this.onRemovePremiumsOpenClicked(this.removePremiumsConfirmationDialogTemplate);
        }
      },
    },
  ];


  /** Constructor **/
  constructor(
    private readonly cdr: ChangeDetectorRef,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.loadDentalPremiumsProcessListGrid();
  }
  ngOnChanges(): void {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };

    this.loadDentalPremiumsProcessListGrid();
  }

  private loadDentalPremiumsProcessListGrid(): void {
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
    this.isDentalPremiumsProcessGridLoaderShow = true;
    const gridDataRefinerValue = {
      skipCount: skipCountValue,
      pagesize: maxResultCountValue,
      sortColumn: sortValue,
      sortType: sortTypeValue,
    };
    this.loadDentalPremiumsProcessListEvent.emit(gridDataRefinerValue);
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
    this.loadDentalPremiumsProcessListGrid();
  }

  // updating the pagination infor based on dropdown selection
  pageSelectionChange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadDentalPremiumsProcessListGrid();
  }

  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
  }

  gridDataHandle() {
    this.dentalPremiumsProcessGridLists$.subscribe((data: GridDataResult) => {
      this.gridDataResult = data;
      this.gridDataResult.data = filterBy(
        this.gridDataResult.data,
        this.filterData
      );
      this.gridDentalPremiumsProcessDataSubject.next(this.gridDataResult);
      if (data?.total >= 0 || data?.total === -1) {
        this.isDentalPremiumsProcessGridLoaderShow = false;
      }
    });
    this.isDentalPremiumsProcessGridLoaderShow = false;
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

  public onRemovePremiumsOpenClicked(template: TemplateRef<unknown>): void {
    this.removePremiumsDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    });
  }
  onModalRemovePremiumsModalClose(result: any) {
    if (result) { 
      this.isRemovePremiumGridOptionClosed = false;
      this.removePremiumsDialog.close();
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
      this.editPremiumsFormDialog.close();
    }
  }


  onClickOpenAddPremiumsFromModal(template: TemplateRef<unknown>): void {
    this.addPremiumsFormDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-lg app-c-modal-np',
    });
  }
  modalCloseAddPremiumsFormModal(result: any) {
    if (result) {
      this.isAddPremiumClosed = false;
      this.addPremiumsFormDialog.close();
    }
  }
  onSplitBatchPremiumsClicked(){
        this.isBatchPremiumsClicked = true;
        this.onBatchPremiumsGridSelectedClicked();
  }
  onBatchPremiumsGridSelectedClicked() {
    this.isProcessGridExpand = false;
  }

  onBatchPremiumsGridSelectedCancelClicked() {
    this.isProcessGridExpand = true;
    this.isRemoveBatchClosed = false;
    this.isAddPremiumClosed = false; 
    this.isBatchPremiumsClicked = false;
  
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
