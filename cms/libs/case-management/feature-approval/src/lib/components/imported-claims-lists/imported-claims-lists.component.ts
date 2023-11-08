/** Angular **/
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  TemplateRef,
} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { RowArgs, GridDataResult } from '@progress/kendo-angular-grid';
import { Router } from '@angular/router';
import {
  CompositeFilterDescriptor,
  State,
  filterBy,
} from '@progress/kendo-data-query';
import { Subject } from 'rxjs';
import { DialogService } from '@progress/kendo-angular-dialog';

@Component({
  selector: 'productivity-tools-imported-claims-lists',
  templateUrl: './imported-claims-lists.component.html',
})
export class ImportedClaimsListsComponent implements OnInit, OnChanges {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  isImportedClaimsGridLoaderShow = true;
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() approvalsImportedClaimsLists$: any;
  @Output() loadImportedClaimsGridEvent = new EventEmitter<any>();
  public state!: State;
  sortColumn = 'clientName';
  sortDir = 'Ascending';
  columnsReordered = false;
  filteredBy = '';
  searchValue = '';
  isFiltered = false;
  filter!: any;
  selectedColumn!: any;
  gridDataResult!: GridDataResult;

  gridImportedClaimsDataSubject = new Subject<any>();
  gridImportedClaimsBatchData$ =
    this.gridImportedClaimsDataSubject.asObservable();
  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  private searchCaseDialog: any;
  private expectationDialog: any;
  private reviewPossibleMatchesDialog: any;

  // Note to Developer: Please remove below when implementing API call and use this variable in data grid "approvalsImportedClaimsLists$""
  claimsGridLists = [
    {
      id: 1,
      clientName: 'Attention data change',
      namePrimaryInsuranceCard: 'Attention',
      claimSource: 'Attention',
      policyID: 'xxxx',
      amountDue: 'xxxx',
      dateService: 'xxx',
      policyIDMatch: 'xx/xx/xxxx',
      eligibilityMatch: '12/2019',
      validInsurance: 'Immediate',
      belowMaxBenefits: 'Expense',
      entryDate: 'Rent Deposit',
      isDelete: 'Y',
      subRow: {
        type: '01',
        expand: 1,
      },
    },
    {
      id: 2,
      clientName: 'Attention',
      namePrimaryInsuranceCard: 'Attention',
      claimSource: 'Attention',
      policyID: 'xxxx',
      amountDue: 'xxxx',
      dateService: 'xxx',
      policyIDMatch: 'xx/xx/xxxx',
      eligibilityMatch: '12/2019',
      validInsurance: 'Immediate',
      belowMaxBenefits: 'Expense',
      entryDate: 'Rent Deposit',
      isDelete: 'N',
      subRow: {
        type: '02',
        expand: 1,
      },
    },
    {
      id: 3,
      clientName: 'Attention',
      namePrimaryInsuranceCard: 'Attention',
      claimSource: 'Attention',
      policyID: 'xxxx',
      amountDue: 'xxxx',
      dateService: 'xxx',
      policyIDMatch: 'xx/xx/xxxx',
      eligibilityMatch: '12/2019',
      validInsurance: 'Immediate',
      belowMaxBenefits: 'Expense',
      entryDate: 'Rent Deposit',
      isDelete: 'N',
      subRow: {
        type: '03',
        expand: 1,
      },
    },
    {
      id: 4,
      clientName: 'Attention',
      namePrimaryInsuranceCard: 'Attention',
      claimSource: 'Attention',
      policyID: 'xxxx',
      amountDue: 'xxxx',
      dateService: 'xxx',
      policyIDMatch: 'xx/xx/xxxx',
      eligibilityMatch: '12/2019',
      validInsurance: 'Immediate',
      belowMaxBenefits: 'Expense',
      entryDate: 'Rent Deposit',
      isDelete: 'N',
      subRow: {
        type: '04',
        expand: 1,
      },
    },
  ];
  /** Constructor **/
  constructor(private route: Router, private dialogService: DialogService) {}

  ngOnInit(): void {
    this.loadImportedClaimsListGrid();
  }
  ngOnChanges(): void {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };

    this.loadImportedClaimsListGrid();
  }
  public expandInClaimException({ dataItem }: RowArgs): boolean {
    debugger;
    //return dataItem.subRow.expand === 1;
    return true;
  }

  private loadImportedClaimsListGrid(): void {
    debugger;
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
    };
    this.loadImportedClaimsGridEvent.emit(gridDataRefinerValue);
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
              field: this.selectedColumn ?? 'batch',
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
    this.loadImportedClaimsListGrid();
  }

  // updating the pagination infor based on dropdown selection
  pageSelectionChange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadImportedClaimsListGrid();
  }

  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
  }

  gridDataHandle() {
    debugger;
    this.approvalsImportedClaimsLists$.subscribe((data: GridDataResult) => {
      this.gridDataResult = data;
      this.gridDataResult.data = filterBy(
        this.gridDataResult.data,
        this.filterData
      );
      this.gridImportedClaimsDataSubject.next(this.gridDataResult);
      if (data?.total >= 0 || data?.total === -1) {
        this.isImportedClaimsGridLoaderShow = false;
      } else {
        this.isImportedClaimsGridLoaderShow = false;
      }
    }); 
  }

  onSearchClientsDialogClicked(template: TemplateRef<unknown>): void {
    this.searchCaseDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-md app-c-modal-np',
    });
  }
  onCloseSearchClientsDialogClicked() {
    this.searchCaseDialog.close();
  }

  onMakeExpectationClicked(template: TemplateRef<unknown>): void {
    this.expectationDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    });
  }
  onCloseMakeExpectationDialogClicked() {
    this.expectationDialog.close();
  }

  onReviewPossibleMatchesDialogClicked(template: TemplateRef<unknown>): void {
    this.reviewPossibleMatchesDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-md app-c-modal-np',
    });
  }
  onCloseReviewPossibleMatchesDialogClicked() {
    this.reviewPossibleMatchesDialog.close();
  }
}
