/** Angular **/
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  TemplateRef,
  ChangeDetectorRef,
  ViewChild
} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { RowArgs, GridDataResult, ColumnVisibilityChangeEvent } from '@progress/kendo-angular-grid';
import { Router } from '@angular/router';
import {
  CompositeFilterDescriptor,
  State,
} from '@progress/kendo-data-query';
import { Subject } from 'rxjs';
import { DialogService } from '@progress/kendo-angular-dialog';
import { YesNoFlag } from '@cms/shared/ui-common';
import { ImportedClaimFacade, FinancialClaimsFacade } from '@cms/case-management/domain';
import { IntlService } from '@progress/kendo-angular-intl';
import { ConfigurationProvider } from '@cms/shared/util-core';
import { FilterService } from '@progress/kendo-angular-treelist/filtering/filter.service';

@Component({
  selector: 'productivity-tools-imported-claims-lists',
  templateUrl: './imported-claims-lists.component.html',
})
export class ImportedClaimsListsComponent implements OnInit, OnChanges {
  @ViewChild('submitModalDialog', { read: TemplateRef })
  submitModalDialog!: TemplateRef<any>;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  isImportedClaimsGridLoaderShow = true;
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() approvalsImportedClaimsLists$: any;
  @Input() submitImportedClaims$: any;
  @Input() possibleMatchData$:any;
  @Input() exportButtonShow$: any;
  @Output() loadImportedClaimsGridEvent = new EventEmitter<any>();
  @Output() updateClientPolicyEvent = new EventEmitter<any>();
  @Output() submitImportedClaimsEvent = new EventEmitter<any>();
  @Output() loadPossibleMatchDataEvent = new EventEmitter<any>();
  @Output() saveReviewPossibleMatchesDialogClickedEvent = new EventEmitter<any>();
  @Output() exportGridDataEvent = new EventEmitter<any>();
  importedClaimId:any;
  clientName:any;
  dateOfBirth:any;
  policyId:any;
  entityId:any;
  @Output() addAnExceptionEvent = new EventEmitter<any>();
  public state!: State;
  sortColumn = 'entryDate';
  sortColumnDesc = 'Entry Date';
  sortDir = 'Descending';
  columnsReordered = false;
  filteredBy = '';
  searchValue = '';
  isFiltered = false;
  filter!: any;
  gridDataResult!: GridDataResult;
  showExportLoader = false;
  gridColumns: { [key: string]: string } = {
    ALL: 'All Columns',
    clientName: 'Client Name',
    nameOnPrimaryInsuranceCard: 'Name on Primary Insurance Card',
    claimSource: 'Claim Source',
    policyId: 'Policy ID',
    amountDue: 'Amount Due',
    dateOfService: 'Date of Service',
    policyIdMatch: 'Policy ID match?',
    eligibilityMatch: 'Eligibility match?',
    validInsurance: 'Valid insurance?',
    belowMaxBenefits: 'Below max benefits?',
    entryDate: 'Entry Date'
  };

  dropDownColumns: { columnCode: string; columnDesc: string }[] = [
    {
      columnCode: 'ALL',
      columnDesc: 'All Columns',
    },
    {
      columnCode: 'ClientName',
      columnDesc: 'Client Name',
    },
    {
      columnCode: 'ClaimSource',
      columnDesc: 'Claim Source',
    },
    {
      columnCode: 'PolicyId',
      columnDesc: 'Policy ID',
    },
    {
      columnCode: 'DateOfService',
      columnDesc: 'Date of Service',
    },
  ];

  claimSourceList: { code: string; desc: string }[] = [
    {
      code: 'Kaiser',
      desc: 'Kaiser',
    },
    {
      code: 'Moda',
      desc: 'Moda'
    },
  ];

  selectedColumn = 'ALL';
  filteredByColumnDesc = '';
  showDateSearchWarning = false;
  columnChangeDesc = 'Default Columns';
  claimSourceFilter = '';

  gridImportedClaimsDataSubject = new Subject<any>();
  gridImportedClaimsBatchData$ =
    this.gridImportedClaimsDataSubject.asObservable();
  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  selectedPolicyId: any
  private searchCaseDialog: any;
  private expectationDialog: any;
  private reviewPossibleMatchesDialog: any;
  clientSearchResult$ = this.financialClaimsFacade.clients$;
  selectedClaim: any;
  importedClaimsGridUpdatedResult: any = [];
  selectedDeletedDeniedDataRows: any = [];
  deniedStatus = 'DENIED';
  deletedStatus = 'DELETED';
  disableSubmit = true;
  deniedCount = 0;
  deletedCount = 0;
  private submitDialogService: any;
  yesNoFlag: any = YesNoFlag;
  claimData: any;
  rowData: any;
  updateExceptionModalSubject$ = this.importedClaimFacade.updateExceptionModalSubject$;
  /** Constructor **/
  constructor(private route: Router,
              private dialogService: DialogService,
              private readonly router: Router,
              private readonly cd: ChangeDetectorRef,
              private financialClaimsFacade: FinancialClaimsFacade,
              private importedClaimFacade: ImportedClaimFacade,
    		private readonly intl: IntlService,
    		private readonly configProvider: ConfigurationProvider)
              {}

  ngOnInit(): void {
    this.subscribeToSubmitImportedClaims();
  }
  ngOnChanges(): void {
    this.state = {
      skip: 0,
      take: this.pageSizes[1]?.value,
      sort: this.sort,
      filter: { logic: 'and', filters: [] },
    };
    this.loadImportedClaimsListGrid();
  }
  public expandInClaimException({ dataItem }: RowArgs): boolean {
    return true;
  }

  subscribeToSubmitImportedClaims(){
    this.submitImportedClaims$.subscribe((response: any) => {
      if (response !== undefined && response !== null) {
        this.importedClaimsGridUpdatedResult = [];
        this.denyAndDeleteCount();
        this.enableSubmitButtonMain();
        this.onCloseSubmitClicked();
        this.loadImportedClaimsListGrid();
      }
    });
  }

  private loadImportedClaimsListGrid(): void {
    this.loadImportedClaims(
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType
    );
  }
  loadImportedClaims(
    skipCountValue: number,
    maxResultCountValue: number,
    sortValue: string,
    sortTypeValue: string
  ) {
    this.isImportedClaimsGridLoaderShow = true;
    const gridDataRefinerValue = {
      skipCount: skipCountValue,
      pageSize: maxResultCountValue,
      sort: sortValue,
      sortType: sortTypeValue,
      filter: this.state?.['filter']?.['filters'] ?? [],
    };
    this.loadImportedClaimsGridEvent.emit(gridDataRefinerValue);
    this.gridDataHandle();
  }

  searchColumnChangeHandler(value: string) {    
    this.filter = [];
    this.showDateSearchWarning = value === 'DateOfService';
    if (this.searchValue) {
      this.onApprovalSearch(this.searchValue);
    }
  }

  onApprovalSearch(searchValue: any) {
    const isDateSearch = searchValue.includes('/');
    this.showDateSearchWarning = isDateSearch || this.selectedColumn === 'DateOfService';
    searchValue = this.formatSearchValue(searchValue, isDateSearch);
    if (isDateSearch && !searchValue) return;
    this.onChange(searchValue);
  }

  onChange(data: any) {
    this.defaultGridState();debugger;

    if (this.selectedColumn === 'DateOfService' && (!this.isValidDate(data) && data !== '')) {
      return;
    }
    this.filterData = {
      logic: 'and',
      filters: [
        {
          filters: [
            {
              field: this.selectedColumn ?? 'clientName',
              operator: 
                this.selectedColumn === 'DateOfService'
                ? 'eq'
                : 'startswith',
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
      take: this.pageSizes[1]?.value,
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
    this.sortType = stateData.sort[0]?.dir ?? 'desc';
    this.state = stateData;
    this.sortDir = this.sort[0]?.dir === 'asc' ? 'Ascending' : 'Descending';
    this.sortColumn = this.columns[stateData.sort[0]?.field];
    this.filter = stateData?.filter?.filters;    
    this.sortColumnDesc = this.gridColumns[this.sortValue];
    if(stateData.filter?.filters.length > 0)
    {
      let stateFilter = stateData.filter?.filters.slice(-1)[0].filters[0];
      this.filter = stateFilter.value;
      this.isFiltered = true;
      const filterList = []
      for(const filter of stateData.filter.filters)
      {
        filterList.push(this.columns[filter.filters[0].field]);
      }
      this.filteredBy =  filterList.toString();
    }
    else
    {
      this.filter = "";
      this.isFiltered = false
    }

    if (!this.filteredBy.includes('Claim Source'))
    this.claimSourceFilter = '';
    this.loadImportedClaimsListGrid();
  }

  resetImportedClaimsGrid(){
    this.sortValue = 'entryDate';
    this.sortType = 'desc';
    this.defaultGridState();
    this.sortColumn = 'entryDate';
    this.sortDir = this.sortType === 'asc' ? 'Ascending' : "Descending";
    this.filter = [];
    this.searchValue = '';
    this.selectedColumn = 'ALL';
    this.filteredByColumnDesc = '';
    this.sortColumnDesc = this.gridColumns[this.sortValue];
    this.columnChangeDesc = 'Default Columns';
    this.loadImportedClaimsListGrid();
  }

  columnChange(event: ColumnVisibilityChangeEvent) {
    const columnsRemoved = event?.columns.filter(x => x.hidden).length
    this.columnChangeDesc = columnsRemoved > 0 ? 'Columns Removed' : 'Default Columns';
  }

  dropdownFilterChange(
    field: string,
    value: any,
    filterService: FilterService
  ): void {
    if (field === 'claimSource') {
      this.claimSourceFilter = value;
    }
    filterService.filter({
      filters: [
        {
          field: field,
          operator: 'eq',
          value: value,
        },
      ],
      logic: 'or',
    });
  }

  // updating the pagination info based on dropdown selection
  pageSelectionChange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadImportedClaimsListGrid();
  }

  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
  }

  gridDataHandle() {
    this.approvalsImportedClaimsLists$.subscribe((response: GridDataResult) => {
      let gridData = {
        data: response.data,
        total: response.total,
      };
      this.gridDataResult = gridData;
      if(response.data.length > 0)
      {
        this.assignDataFromUpdatedResultToPagedResult(response);
      }
      this.gridImportedClaimsDataSubject.next(this.gridDataResult);
      if (response?.total >= 0 || response?.total === -1) {
        this.isImportedClaimsGridLoaderShow = false;
      }
    });
  }
  onClientClicked(clientId: any) {
    this.router.navigate([`/case-management/cases/case360/${clientId}`]);

  }

  onSearchClientsDialogClicked(template: TemplateRef<unknown>, selectedClaim: any): void {
    this.selectedClaim = selectedClaim
    this.searchCaseDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-md app-c-modal-np',
    });
  }
  onCloseSearchClientsDialogClicked() {
    this.searchCaseDialog.close();
  }

  onMakeExpectationClicked(template: TemplateRef<unknown>,dataItem:any): void {
    this.expectationDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    });
    this.rowData = dataItem;
  }
  onCloseMakeExpectationDialogClicked() {
    this.expectationDialog.close();
  }

  onReviewPossibleMatchesDialogClicked(template: TemplateRef<unknown>,dataItem:any): void {
    this.reviewPossibleMatchesDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-md app-c-modal-np',
    });
    this.claimData=dataItem;
  }

  onCloseReviewPossibleMatchesDialogClicked() {
    this.reviewPossibleMatchesDialog.close();
  }

  loadPossibleMatch(data?: any) {
    this.loadPossibleMatchDataEvent.emit(data);
  }

  savePossibleMatch(data?:any)
  {
    this.saveReviewPossibleMatchesDialogClickedEvent.emit(data);
    this.closePossibleMatchModal();
  }

  private closePossibleMatchModal() {
    this.possibleMatchData$.subscribe((value: any) => {
      if (value) {
        this.onCloseReviewPossibleMatchesDialogClicked();
        this.cd.detectChanges();
        this.loadImportedClaimsListGrid();
      }
    });
  }

  assignDataFromUpdatedResultToPagedResult(itemResponse: any) {
    itemResponse.data.forEach((item: any, index: number) => {
      itemResponse.data[index].claimStatus = '';
      let ifExist = this.importedClaimsGridUpdatedResult.find(
        (x: any) => x.importedClaimId === item.importedClaimId
      );
      if (ifExist !== undefined && item.importedClaimId === ifExist.importedClaimId) {
        itemResponse.data[index].claimStatus = ifExist?.claimStatus;
      }
    });
  }

  onRowLevelDeleteClicked(
    dataItem: any,
  ) {
    if (
      dataItem.claimStatus === undefined ||
      dataItem.claimStatus === '' ||
      dataItem.claimStatus === null
    ) {
      dataItem.claimStatus = this.deletedStatus;
    } else if (dataItem.claimStatus == this.deletedStatus) {
      dataItem.claimStatus = '';
    }
    this.assignRowDataToMainList(dataItem);
    this.denyAndDeleteCount();
    this.enableSubmitButtonMain();
  }

  onRowLevelDenyClicked(
    dataItem: any
  ) {
    if (
      dataItem.claimStatus === undefined ||
      dataItem.claimStatus === '' ||
      dataItem.claimStatus === null
    ) {
      dataItem.claimStatus = this.deniedStatus;
    } else if (dataItem.claimStatus == this.deniedStatus) {
      dataItem.claimStatus = '';
    }
    this.assignRowDataToMainList(dataItem);
    this.denyAndDeleteCount();
    this.enableSubmitButtonMain();
  }

  assignRowDataToMainList(dataItem: any) {
    let ifExist = this.importedClaimsGridUpdatedResult.find(
      (x: any) => x.importedClaimId === dataItem.importedClaimId
    );
    if (ifExist !== undefined) {
      this.importedClaimsGridUpdatedResult.forEach(
        (item: any, index: number) => {
          if (item.importedClaimId === ifExist.importedClaimId) {
            this.importedClaimsGridUpdatedResult[index].claimStatus =
              dataItem?.claimStatus;
          }
        }
      );
    } else {
      this.importedClaimsGridUpdatedResult.push(dataItem);
    }
  }

  denyAndDeleteCount() {
    this.deniedCount = 0;
    this.deletedCount = 0;
    this.deniedCount = this.importedClaimsGridUpdatedResult.filter((x: any) => x.claimStatus == this.deniedStatus).length;
    this.deletedCount = this.importedClaimsGridUpdatedResult.filter((x: any) => x.claimStatus == this.deletedStatus).length;
  }

  enableSubmitButtonMain()
  {
    const totalCount = this.importedClaimsGridUpdatedResult.filter((x: any) => x.claimStatus == this.deletedStatus || x.claimStatus == this.deniedStatus).length;
    this.disableSubmit = (totalCount <= 0);
    this.cd.detectChanges();
  }

  onCloseSubmitClicked() {
    this.submitDialogService.close();
  }

  onSubmitImportedClaimsClicked() {
    this.selectedDeletedDeniedDataRows =  this.importedClaimsGridUpdatedResult.filter(
      (x: any) =>
        x.claimStatus == this.deniedStatus ||
        x.claimStatus == this.deletedStatus
    );
    this.onSubmitClicked(this.submitModalDialog);
  }

  onSubmitClicked(template: TemplateRef<unknown>): void {
    this.submitDialogService = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    });
  }

  makeRequestData()
  {
    let claims = [{}];
    for (let element of this.selectedDeletedDeniedDataRows) {
      let claim = {
        importedClaimId: element.importedClaimId,
        claimStatus: element.claimStatus,
        entityTypeCode: element.entityTypeCode
      };
      claims.push(claim);
    }
    claims.splice(0, 1);
    this.submit(claims);
  }

  submit(data: any) {
    this.submitImportedClaimsEvent.emit(data);
  }


  onClientValueChange(importedclaimDto: any){
    this.updateClientPolicyEvent.emit(importedclaimDto);
  }

  addAnException(exceptionText: any){
    const exceptionObject = {
      InvoiceExceptionId : this.rowData.invoiceExceptionId,
      ReasonDesc : exceptionText,
      ClaimId: this.rowData.importedClaimId,
      EntityTypeCode: this.rowData.entityTypeCode
    }
    this.addAnExceptionEvent.emit(exceptionObject);
    this.closeExceptionModal();
  }

  private closeExceptionModal() {
    this.updateExceptionModalSubject$.subscribe((value: any) => {
      if (value) {
        this.onCloseMakeExpectationDialogClicked();
        this.cd.detectChanges();
        this.loadImportedClaimsListGrid();
      }
    });
  }

  columns: any = {};

  private isValidDate = (searchValue: any) =>
    isNaN(searchValue) && !isNaN(Date.parse(searchValue));

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

  onClickedExport() {
    this.showExportLoader = true;
    this.exportGridDataEvent.emit();

    this.exportButtonShow$.subscribe((response: any) => {
      if (response) {
        this.showExportLoader = false;
      }
    });
  }

}
