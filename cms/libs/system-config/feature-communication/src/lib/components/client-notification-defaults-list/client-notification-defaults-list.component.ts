import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  ChangeDetectorRef,
} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { FormGroup } from '@angular/forms';
import {
  ColumnVisibilityChangeEvent,
  GridDataResult,
} from '@progress/kendo-angular-grid';
import {
  CompositeFilterDescriptor,
  State,
  filterBy,
} from '@progress/kendo-data-query';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
@Component({
  selector: 'system-config-client-notification-defaults-list',
  templateUrl: './client-notification-defaults-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientNotificationDefaultsListComponent
  implements OnInit, OnChanges
{
  /** Public properties **/
  UpdateDefaultNotificationPopupShow = false;
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  public formUiStyle: UIFormStyle = new UIFormStyle();

  public formGroup: FormGroup | undefined;
  private editedRowIndex: number | undefined;
  /** Constructor **/
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() clientNotificationDataLists$: any;
  @Input() clientNotificationFilterColumn$: any;
  @Output() loadClientNotificationListsEvent = new EventEmitter<any>();
  @Output() clientNotificationFilterColumnEvent = new EventEmitter<any>();
  private emailOptionRemovalDate = new Date('2024-07-05'); 
  public state!: State;
  isGridRowEdit = false;
  sortColumn = 'Scenario';
  sortDir = 'Ascending';
  columnsReordered = false;
  sortColumnDesc = 'Scenario';
  filteredBy = '';
  searchValue = '';
  isFiltered = false;
  optionWidth = 50;
  filter!: any;
  columnChangeDesc = 'Default Columns'
  selectedColumn!: any;
  gridDataResult!: GridDataResult;
  isClientNotificationListGridLoaderShow = false;
  gridClientNotificationDataSubject = new Subject<any>();
  gridClientNotificationData$ =
    this.gridClientNotificationDataSubject.asObservable();
  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  columns: any = {
    scenario: 'Scenrio',
    scenarioDesc: 'Scenario Description',
    defaultMethod: 'Default Method',
    lastModifiedTime: 'Last Modified'
  };
  /** Internal event methods **/
  constructor( private readonly router: Router, private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadClientNotificationList();
  }
  ngOnChanges(): void {
    this.state = {
      skip: 0,
      sort: [{ field: 'scenario', dir: 'asc' }]
    };
  }

  private loadClientNotificationList(): void {
    this.loadClientNotificationLitData(
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType,
    );
  }
  loadClientNotificationLitData(
    skipCountValue: number,
    maxResultCountValue: number,
    sortValue: string,
    sortTypeValue: string,
  ) {
    this.isClientNotificationListGridLoaderShow = true;
    const gridDataRefinerValue = {
      skipCount: skipCountValue,
      pagesize: maxResultCountValue,
      sortColumn: sortValue,
      sortType: sortTypeValue,
      filter :  this.state?.['filter']?.['filters'] ?? []
    };
    this.loadClientNotificationListsEvent.emit(gridDataRefinerValue);
    this.gridDataHandle();
  }
  loadClientNotificationFilterColumn() {
    this.clientNotificationFilterColumnEvent.emit();
  }
  onChange(data: any) {
    this.defaultGridState();
    const operator = 'contains';

    this.filterData = {
      logic: 'and',
      filters: [
        {
          filters: [
            {
              field: this.selectedColumn ?? 'Scenario',
              operator: operator,
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
   this.loadClientNotificationList();
  }
  defaultGridState() {
    this.state = {
      skip: 0,
      sort: this.sort,
      filter: { logic: 'and', filters: [] },
    };
    this.sortColumn = 'Scenario';
    this.sortDir = 'Ascending';
    this.filter = [];
    this.isFiltered = false;
    this.columnsReordered = false;
    this.sortValue = 'Scenario';
    this.sortType = 'asc';
    this.sort = this.sortColumn;
    this.loadClientNotificationList();
  }

  onColumnReorder($event: any) {
    this.columnsReordered = true;
  }

  dataStateChange(stateData: any): void {
    this.sort = stateData.sort;
    this.sortValue = stateData.sort[0]?.field ?? this.sortValue;
    this.sortType = stateData.sort[0]?.dir ?? 'desc';
    this.state = stateData;
    this.filter = stateData?.filter?.filters;
    this.sortDir = this.sort[0]?.dir === 'asc' ? 'Ascending' : 'Descending';
    this.sortColumn = stateData.sort[0]?.field;
    if (stateData.filter?.filters.length > 0) {
      const stateFilter = stateData.filter?.filters.slice(-1)[0].filters[0];
      this.filter = stateFilter.value;
      this.isFiltered = true;
      const filterList = [];
      for (const filter of stateData.filter.filters) {
        filterList.push(this.columns[filter.filters[0].field]);
      }
      this.filteredBy = filterList.toString();
    }
     else {
      this.filter = '';
      this.isFiltered = false;
    }
    this.loadClientNotificationList();
  }

  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
  }

  gridDataHandle() {
    this.clientNotificationDataLists$.subscribe((data: GridDataResult) => {
      this.gridDataResult = data;
      if (data?.total >= 0 || data?.total === -1) {
        this.isClientNotificationListGridLoaderShow = false;
      }
      this.cdr.detectChanges();
    });
    this.isClientNotificationListGridLoaderShow = false;
  }

  public editHandler(data: any): void {
    this.isGridRowEdit = true;

    this.optionWidth = 120;
  }

  public cancelHandler(data: any): void {
    this.isGridRowEdit = false;
    this.optionWidth = 50;

    
  }
  updateButton(){
    this.isGridRowEdit = false;
    this.optionWidth = 50;
    this.UpdateDefaultNotificationPopupShow = false;
  }
  public saveHandler(data: any): void {
    this.UpdateDefaultNotificationPopupShow = true;
  }

  onCloseUpdateDefaultNotificationClicked() {
    this.UpdateDefaultNotificationPopupShow = false;
  }
  emailTemplateNavigate()
  {
    this.router.navigate([`/system-config/communication/email-template`]);
  }

  letterTemplateNavigate()
  {
    this.router.navigate([`/system-config/communication/letter-template`]);
  }
  columnChange(event: ColumnVisibilityChangeEvent) {
    const columnsRemoved = event?.columns.filter(x => x.hidden).length
    this.columnChangeDesc = columnsRemoved > 0 ? 'Columns Removed' : 'Columns Added';
  }
}