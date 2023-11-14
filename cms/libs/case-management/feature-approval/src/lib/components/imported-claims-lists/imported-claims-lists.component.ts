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

  /** Constructor **/
  constructor(private route: Router, private dialogService: DialogService,private readonly router: Router) {}

  ngOnInit(): void {
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
    return true;
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
    ;
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
  onClientClicked(clientId: any) {
    this.router.navigate([`/case-management/cases/case360/${clientId}`]);

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
