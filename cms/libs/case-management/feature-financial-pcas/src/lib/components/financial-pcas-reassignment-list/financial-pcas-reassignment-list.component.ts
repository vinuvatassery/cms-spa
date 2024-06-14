/** Angular **/
import {
  AfterViewInit,
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
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { DialogService } from '@progress/kendo-angular-dialog';
import { GridDataResult , ColumnVisibilityChangeEvent, ColumnBase} from '@progress/kendo-angular-grid';
import {
  CompositeFilterDescriptor,
  State
} from '@progress/kendo-data-query';
import { Subject } from 'rxjs';
import { FinancialPcaFacade, PcaAssignmentsFacade } from '@cms/case-management/domain';
import { NavigationMenuFacade } from '@cms/system-config/domain';
import { FormGroup } from '@angular/forms';
import { IntlService } from '@progress/kendo-angular-intl';
import { ConfigurationProvider } from '@cms/shared/util-core';

@Component({
  selector: 'cms-financial-pcas-reassignment-list',
  templateUrl: './financial-pcas-reassignment-list.component.html',
  styleUrls: ['./financial-pcas-reassignment-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialPcasReassignmentListComponent
  implements OnInit, OnChanges, AfterViewInit
{
  @ViewChild('addEditPcaReassignmentDialogTemplate', { read: TemplateRef })
  addEditPcaReassignmentDialogTemplate!: TemplateRef<any>;

  @ViewChild('confirmationPcaReassignmentDialogTemplate', { read: TemplateRef })
  confirmationPcaReassignmentDialogTemplate!: TemplateRef<any>;

  @ViewChild('reassignPcaReassignmentDialogTemplate', { read: TemplateRef })
  reassignPcaReassignmentDialogTemplate!: TemplateRef<any>;

  public formUiStyle: UIFormStyle = new UIFormStyle();
  pcaReassignmentConfirmationDialogService: any;
  pcaReassignmentAddEditDialogService: any;
  reassignmentDialogService: any;
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  isFinancialPcaReassignmentGridLoaderShow = false;
  isViewGridOptionClicked = false;
  isEditGridOptionClicked = false;
  isreAssignGridOptionClicked = false;
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() financialPcaReassignmentGridLists$: any;
  @Output() loadFinancialPcaReassignmentListEvent = new EventEmitter<any>();
  public state!: State;
  sortColumn = 'vendorName';
  sortDir = 'Ascending';
  columnsReordered = false;
  filteredBy = '';
  searchValue = '';
  isFiltered = false;
  filter!: any;
  selectedColumn = 'ALL';
  gridDataResult!: GridDataResult;

  gridFinancialPcaReassignmentDataSubject = new Subject<any>();
  gridFinancialPcaReassignmentData$ =
    this.gridFinancialPcaReassignmentDataSubject.asObservable();
  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  editPcaReassignmentItem: any;
  @Output() getPcaAssignmentByIdEvent = new EventEmitter<any>();
  @Output() updatePcaAssignmentByEvent = new EventEmitter<any>();
  @Input() getPcaAssignmentById$: any;
  @Output() loadPcaReassignmentListEvent = new EventEmitter();
  @Input() notAssignPcaLists$: any;
  inputvalue!: string;
  reAssignPcaS: any[] = [];
  allNotAssignedPcaSList: any;
  notSelectedPcaS: any;
  selectedPcaData: any;
  filteredByColumnDesc = '';
  sortColumnDesc = 'PCA #';
  columnChangeDesc = 'Default Columns';
  defaultColumnState: ColumnBase[] = [];
  @ViewChild('pcaReassignmentGrid') pcaReassinmentGrid: any;

  public gridMoreActions = [
    {
      buttonType: 'btn-h-primary',
      text: 'View',
      icon: 'visibility',
      click: (data: any): void => {
        if (!this.isViewGridOptionClicked) {
          this.isViewGridOptionClicked = true;
          this.isEditGridOptionClicked = false;
          this.isreAssignGridOptionClicked = false;
          this.onOpenViewEditPcaReassignmentClicked(
            this.addEditPcaReassignmentDialogTemplate,
            data
          );
        }
      },
    },
    {
      buttonType: 'btn-h-danger',
      text: 'Edit',
      icon: 'edit',
      click: (data: any): void => {
        if (!this.isEditGridOptionClicked) {
          this.isEditGridOptionClicked = true;
          this.isViewGridOptionClicked = false;
          this.isreAssignGridOptionClicked = false;
          this.onOpenViewEditPcaReassignmentClicked(
            this.addEditPcaReassignmentDialogTemplate,
            data
          );
        }
      },
    },
    {
      buttonType: 'btn-h-danger',
      text: 'Reassign PCA',
      icon: 'edit',
      click: (data: any): void => {
        if (!this.isEditGridOptionClicked) {
          this.isEditGridOptionClicked = false;
          this.isViewGridOptionClicked = false;
          this.isreAssignGridOptionClicked = true;
          this.onOpenReassignPcaReassignmentClicked(
            this.reassignPcaReassignmentDialogTemplate,
            data
          );
        }
      },
    },
  ];
  isEditAssignmentClosed = false;
  isRemoveAssignmentClosed = false;
  pcaAssignmentFormData: any;
  @Input() objectCodeIdValue: any;
  @Input() groupCodeIdsdValue: any = [];
  @Input() groupCodesData$: any;
  @Input() objectCodesData$: any;
  @Input() pcaCodesData$: any;
  @Input() pcaAssignOpenDatesList$: any;
  @Input() pcaAssignCloseDatesList$: any;
  @Input() pcaAssignmentData$: any;
  @Input() pcaAssignmentFormDataModel$: any;
  @Input() newForm: any;
  @Input() pcaCodesInfoData$: any;
  @Output() addPcaDataEvent = new EventEmitter<any>();
  @Output() reassignpcaEvent = new EventEmitter<any>();
  @Input() groupCodesDataFilter: any;
  @Output() loadPcaEvent = new EventEmitter<any>();
  @Input() assignPcaResponseData$: any;
  @Output() getPcaAssignmentEvent = new EventEmitter<any>();
  @Output() pcaChangeEvent = new EventEmitter<any>();
  @Output() loadObjectCodesEvent = new EventEmitter<any>();
  @Output() loadGroupCodesEvent = new EventEmitter<any>();
  dropDownColumns: { columnCode: string; columnDesc: string }[] = [
    {
      columnCode: 'ALL',
      columnDesc: 'All Columns',
    },
    {
      columnCode: 'PcaCode',
      columnDesc: 'PCA',
    },
    {
      columnCode: 'ObjectName',
      columnDesc: 'Object',
    },
    {
      columnCode: 'Group',
      columnDesc: 'Group',
    },
  ];

  gridColumns: { [key: string]: string } = {
    ALL: 'All Columns',
    pcaCode: 'PCA #',
    objectName: 'Object',
    group: 'Group',
    closeDate: 'Close Date',
    originalAmount: 'Orignal Amount',
    amountSpendAfterExpiration: 'Amount Spend After Expiration',
    overSpendAmount: 'Overspend Amount',
    totalOverSpendAmount: 'Total Overspend Amount',
    unlimitedFlag: 'Unlimited',
  };

  /** Constructor **/
  constructor(
    private dialogService: DialogService,
    private financialPcaFacade: FinancialPcaFacade,
    private readonly navigationMenuFacade: NavigationMenuFacade,
    private readonly pcaAssignmentsFacade: PcaAssignmentsFacade,
    private readonly intl: IntlService,
    private readonly configProvider: ConfigurationProvider
  ) {}
  reassignPcaData(pcaAssignmentData: any) {
    this.pcaAssignmentsFacade.reassignPca(pcaAssignmentData);
    this.pcaAssignmentsFacade.reassignPcaResponseData$.subscribe((res: any) => {
      this.onClosePcaReAssignmentFormClicked();
      this.loadPcaReassignment();
      this.navigationMenuFacade.pcaReassignmentCount();
      this.groupChange(true);
    });

    this.reassignpcaEvent.emit(pcaAssignmentData);
  }
  objectCodeValid = true;
  groupCodesValid = true;
  isFinancialPcaAssignmentGridLoaderShow = false;
  pcaAssignmentGroupForm!: FormGroup;
  @Output() loadFinancialPcaAssignmentEvent = new EventEmitter<any>();
  editButtonClicked = false;
  pcaAssignmentAddEditDialogService: any;
  groupChange($event: any) {
    this.groupCodeIdsdValue =
      this.pcaAssignmentGroupForm.controls['groupCodes']?.value;
    let groupCodeIdsdValueData = [];

    for (const key in this.groupCodeIdsdValue) {
      groupCodeIdsdValueData.push(this.groupCodeIdsdValue[key]?.groupCodeId);
    }

    if (this.objectCodeIdValue) {
      this.objectCodeValid = true;
    }
    if (this.groupCodeIdsdValue.length > 0) {
      this.groupCodesValid = true;
    } else {
      this.groupCodesValid = false;
    }
    if (this.groupCodeIdsdValue.length > 0 && this.objectCodeIdValue) {
      this.isFinancialPcaAssignmentGridLoaderShow = true;
      const pcaAssignmentGridArguments = {
        objectId: this.objectCodeIdValue,
        groupIds: groupCodeIdsdValueData,
      };

      this.loadFinancialPcaAssignmentEvent.emit(pcaAssignmentGridArguments);
      this.gridDataHandle();
    }
  }
  onClosePcaReAssignmentFormClicked() {
    this.isEditAssignmentClosed = false;
    this.editButtonClicked = false;
    this.reassignmentDialogService.close();
  }
  onLoadPcaEvent($event: any) {
    this.loadPcaEvent.emit();
  }
  ngOnInit(): void {
    this.pcaChangeEvent.emit();
    this.loadObjectCodesEvent.emit();
    this.loadGroupCodesEvent.emit();
    this.defaultGridState();
    this.notAssignPcaLists$.subscribe((res: any) => {
      this.allNotAssignedPcaSList = res;
      this.notSelectedPcaS = this.allNotAssignedPcaSList;
      this.loadPcaReassignment();
    });
    this.financialPcaFacade.pcaActionIsSuccess$.subscribe((res: string) => {
      if (res == 'reassignment') {
        this.navigationMenuFacade.pcaReassignmentCount();
        this.loadPcaReassignment();
      }
    });
  }

  ngOnChanges(): void {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };
    this.loadPcaReassignment();
  }

  ngAfterViewInit() {
    this.defaultColumnState = this.pcaReassinmentGrid.columns.toArray();
  }

  loadPcaReassignment() {
    this.isFinancialPcaReassignmentGridLoaderShow = true;
    const gridDataRefinerValue = {
      skipCount: this.state?.skip ?? 0,
      maxResultCount: this.state?.take ?? 0,
      sorting: this.sortValue,
      sortType: this.sortType,
      columnname: this.selectedColumn,
      filter: JSON.stringify(this.filter),
    };
    this.loadFinancialPcaReassignmentListEvent.emit(gridDataRefinerValue);
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
              field: this.selectedColumn ?? 'ALL',
              operator: "contains",
              value: data,
            },
          ],
          logic: 'and',
        },
      ],
    };
    const stateData = this.state;
    stateData.filter = this.filterData;
    this.setFilterBy(false, data, null);
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
    this.sortColumnDesc = this.gridColumns[this.sortValue];
    this.filter = stateData?.filter?.filters;
    if (this.filter) {
      this.setFilterBy(true, '', this.filter);

      let filterData = this.filter[0]?.filters[0];
      if (filterData?.field == 'unlimitedFlag') {
        if (filterData.value) {
          filterData.value = 'Y';
        } else {
          filterData.value = 'N';
        }
      }
    }
    this.loadPcaReassignment();
  }

  private setFilterBy(isFromGrid: boolean, searchValue: any = '', filter: any = []) {
    if (isFromGrid && filter.length > 0) {
        const filteredColumns = this.filter?.map((f: any) => {
          const filteredColumns = f.filters?.filter((fld:any)=> fld.value)?.map((fld: any) =>
            this.gridColumns[fld.field])
          return ([...new Set(filteredColumns)]);
        });
        if (filteredColumns && filteredColumns.length > 0 && filteredColumns[0].toString() != '') {
          this.filteredByColumnDesc = ([...new Set(filteredColumns)])?.sort()?.join(', ') ?? '';
        }        
      return;
    }

    if (searchValue !== '') {
      this.filteredByColumnDesc = this.dropDownColumns?.find(i => i.columnCode === this.selectedColumn)?.columnDesc ?? '';
    }
  }

  pageSelectionChange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadPcaReassignment();
  }

  public filterChange(filter: any): void {
    this.filterData = filter;
  }

  gridDataHandle() {
    this.financialPcaReassignmentGridLists$.subscribe(
      (data: GridDataResult) => {
        this.gridFinancialPcaReassignmentDataSubject.next(this.gridDataResult);
        if (data?.total >= 0 || data?.total === -1) {
          this.isFinancialPcaReassignmentGridLoaderShow = false;
        }
      },
      (error: any) => {
        this.isFinancialPcaReassignmentGridLoaderShow = false;
      }
    );
  }

  onOpenViewEditPcaReassignmentClicked(
    template: TemplateRef<unknown>,
    data: any
  ): void {
    this.pcaReassignmentAddEditDialogService = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-md app-c-modal-np',
    });
    this.editPcaReassignmentItem = data;
  }

  onOpenReassignPcaReassignmentClicked(
    template: TemplateRef<unknown>,
    data: any
  ): void {
    this.groupCodesData$ = this.groupCodesData$.filter(
      (x: any) => x.groupCodeId == data.groupId[0]
    );
    this.objectCodesData$ = this.objectCodesData$.filter(
      (x: any) => x.objectCodeId == data.objectId
    );

    this.reassignmentDialogService = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-md app-c-modal-np',
    });
    this.newForm = false;
    this.getPcaAssignmentEvent.emit(data.pcaAssignmentId);
    this.pcaAssignmentFormData = data;
  }

  onCloseEditPcaReassignmentClicked(result: any) {
    if (result) {
      this.isViewGridOptionClicked = false;
      this.isEditGridOptionClicked = false;
      this.pcaReassignmentAddEditDialogService.close();
    }
  }

  onConfirmationPcaReassignmentClicked(template: TemplateRef<unknown>): void {
    this.pcaReassignmentConfirmationDialogService = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    });
  }

  onCloseConfirmationPcaReassignmentClicked(result: any) {
    if (result) {
      this.pcaReassignmentConfirmationDialogService.close();
    }
  }

  getPcaAssignmentById(pcaAssignmentId: any) {
    this.getPcaAssignmentByIdEvent.emit(pcaAssignmentId);
  }

  saveEditPcaReassignmentClicked(updateReassignmentValue: any) {
    this.updatePcaAssignmentByEvent.emit(updateReassignmentValue);
    this.isViewGridOptionClicked = false;
    this.isEditGridOptionClicked = false;
    this.isreAssignGridOptionClicked = false;
    this.pcaReassignmentAddEditDialogService.close();
    this.loadPcaReassignmentListEvent.emit(true);
  }

  onSearchTextChange(text: any, data: any) {
    let pcaCodes = this.reAssignPcaS.find(
      (x: any) => x.pcaAssignmentId == data.pcaAssignmentId
    );
    if (text != pcaCodes.pcaCode) {
      let idx = this.reAssignPcaS.findIndex(
        (x: any) => x.pcaCode == pcaCodes.pcaCode
      );
      if (idx !== -1) {
        this.reAssignPcaS.splice(idx, 1);
      }
      this.allNotAssignedPcaSList = this.notSelectedPcaS;
    }
    this.allNotAssignedPcaSList = this.notSelectedPcaS.filter(
      (obj: any) =>
        String(obj.pcaCode).includes(text) ||
        String(obj.fundingSourceCode).includes(text)
    );
  }

  onClientSelected(event: any, data: any) {
    let isPcAalreadySelected = this.reAssignPcaS.findIndex(
      (x: any) => x.pcaAssignmentId == data.pcaAssignmentId
    );
    if (isPcAalreadySelected !== -1) {
      this.reAssignPcaS.splice(isPcAalreadySelected, 1);
    }
    let obj = {
      pcaId: event.pcaId,
      pcaAssignmentId: data.pcaAssignmentId,
      pcaCode: event.pcaCode,
    };
    this.reAssignPcaS.push(obj);
  }
  onPcaReassignmentClicked(action: any) {
    this.pcaReassignmentConfirmationDialogService.close();
    this.financialPcaFacade.pcaReassignment(this.reAssignPcaS);
  }

  onclick(data: any) {
    this.selectedPcaData = data;
  }

  public itemDisabled(itemArgs: any) {
    if (this.selectedPcaData == undefined) return false;
    else if (this.selectedPcaData.unlimitedFlag == 'Y') return false;
    else if (
      itemArgs.dataItem.pcaRemainingAmount < this.selectedPcaData.originalAmount
    ) {
      return true;
    } else if (
      this.reAssignPcaS.findIndex(
        (x: any) => x.pcaCode == itemArgs.dataItem.pcaCode
      ) !== -1
    ) {
      return true;
    } else {
      return false;
    }
  }

  isUnlimitedFlag(flag: string) {
    return flag == 'Y';
  }

  searchColumnChangeHandler(value: string) {
    if (this.searchValue) {
      this.onChange(this.searchValue);
    }
  }
  onPcaReassignmentSearch(searchValue: any) {
    this.onChange(searchValue);
  }

  restPcaReassignmentGrid() {
    this.sortValue = 'pcaCode';
    this.sortType = 'asc';
    this.initializePCAReassignmentGrid();
    this.sortColumn = 'pcaCode';
    this.sortDir = this.sort[0]?.dir === 'asc' ? 'Ascending' : '';
    this.sortDir = this.sort[0]?.dir === 'desc' ? 'Descending' : '';
    this.filter = [];
    this.searchValue = '';
    this.selectedColumn = 'ALL';
    this.filteredByColumnDesc = '';
    this.sortColumnDesc = this.gridColumns[this.sortValue];
    this.columnChangeDesc = 'Default Columns';
    this.defaultColumnState.forEach((item) => {
      item.hidden = false;
    });
    this.pcaReassinmentGrid.columns = this.defaultColumnState;
    this.loadPcaReassignment();
  }

  private initializePCAReassignmentGrid() {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };
  }

  columnChange(event: ColumnVisibilityChangeEvent) {
    const columnsRemoved = event?.columns.filter((x) => x.hidden).length;
    this.columnChangeDesc =
      columnsRemoved > 0 ? 'Columns Removed' : 'Default Columns';
  }

  private formatSearchValue(searchValue: any, isDateSearch: boolean) {
    if (isDateSearch) {
      if (this.isValidDate(searchValue)) {
        return this.intl.formatDate(
          new Date(searchValue),
          this.configProvider?.appSettings?.dateFormat
        );
      } else {
        return '';
      }
    }
    return searchValue;
  }

  private isValidDate = (searchValue: any) =>
    isNaN(searchValue) && !isNaN(Date.parse(searchValue));
}
