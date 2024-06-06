import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  EventEmitter,
  Input,
  Output,
  OnChanges,
} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { FormGroup } from '@angular/forms';
import {
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
  public state!: State;
  isGridRowEdit = false;
  sortColumn = 'vendorName';
  sortDir = 'Ascending';
  columnsReordered = false;
  filteredBy = '';
  searchValue = '';
  isFiltered = false;
  optionWidth = 50;
  filter!: any;
  selectedColumn!: any;
  gridDataResult!: GridDataResult;
  isClientNotificationListGridLoaderShow = false;
  gridClientNotificationDataSubject = new Subject<any>();
  gridClientNotificationData$ =
    this.gridClientNotificationDataSubject.asObservable();
  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  /** Internal event methods **/
  constructor( private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.loadClientNotificationList();
  }
  ngOnChanges(): void {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };

    this.loadClientNotificationList();
  }

  private loadClientNotificationList(): void {
    this.loadClientNotificationLitData(
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType
    );
  }
  loadClientNotificationLitData(
    skipCountValue: number,
    maxResultCountValue: number,
    sortValue: string,
    sortTypeValue: string
  ) {
    this.isClientNotificationListGridLoaderShow = true;
    const gridDataRefinerValue = {
      skipCount: skipCountValue,
      pagesize: maxResultCountValue,
      sortColumn: sortValue,
      sortType: sortTypeValue,
    };
    this.loadClientNotificationListsEvent.emit(gridDataRefinerValue);
    this.gridDataHandle();
  }
  loadClientNotificationFilterColumn() {
    this.clientNotificationFilterColumnEvent.emit();
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
    this.loadClientNotificationList();
  }

  // updating the pagination infor based on dropdown selection
  pageSelectionChange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadClientNotificationList();
  }

  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
  }

  gridDataHandle() {
    this.clientNotificationDataLists$.subscribe((data: GridDataResult) => {
      this.gridDataResult = data;
      this.gridDataResult.data = filterBy(
        this.gridDataResult.data,
        this.filterData
      );
      this.gridClientNotificationDataSubject.next(this.gridDataResult);
      if (data?.total >= 0 || data?.total === -1) {
        this.isClientNotificationListGridLoaderShow = false;
      }
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
}
