import {
  Component,
  OnInit, 
  ChangeDetectionStrategy,
  Input,
  EventEmitter,
  Output,
  OnChanges,
} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa'; 
import { GridDataResult } from '@progress/kendo-angular-grid';
import { CompositeFilterDescriptor, State, filterBy } from '@progress/kendo-data-query';
import { Subject } from 'rxjs';

@Component({
  selector: 'system-config-domains-list',
  templateUrl: './domains-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DomainsListComponent implements OnInit, OnChanges {
 
  /** Public properties **/
  isDomainsDetailPopup = false;
  isDomainsDeletePopupShow = false;
  isDomainsDeactivatePopupShow = false;
  isDomainsReactivatePopupShow = false; 
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  public formUiStyle: UIFormStyle = new UIFormStyle();

  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() domainDataLists$: any;
  @Input() domainFilterColumn$: any;
  @Output() loadDomainListsEvent = new EventEmitter<any>();
  @Output() domainFilterColumnEvent = new EventEmitter<any>();
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
  isDomainListGridLoaderShow = false;
  gridDomainDataSubject = new Subject<any>();
  gridDomainData$ =
    this.gridDomainDataSubject.asObservable();
  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };


  public moreActions = [
    {
      buttonType: 'btn-h-primary',
      text: 'Edit',
      icon: 'edit',
    },

    {
      buttonType: 'btn-h-primary',
      text: 'Deactivate',
      icon: 'block',
      click: (data: any): void => {
        this.onDomainsDeactivateClicked();
      },
    },
    {
      buttonType: 'btn-h-danger',
      text: 'Delete',
      icon: 'delete',
      click: (data: any): void => {
        this.onDomainsDeleteClicked();
      },
    },
  ];
 


  
  ngOnInit(): void {
    this.loadDomainList(); 
  }
  ngOnChanges(): void {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };
  
    this.loadDomainList();
  }
  
  private loadDomainList(): void {
    this.loadDomainLitData(
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType
    );
  }
  loadDomainLitData(
    skipCountValue: number,
    maxResultCountValue: number,
    sortValue: string,
    sortTypeValue: string
  ) {
    this.isDomainListGridLoaderShow = true;
    const gridDataRefinerValue = {
      skipCount: skipCountValue,
      pagesize: maxResultCountValue,
      sortColumn: sortValue,
      sortType: sortTypeValue,
    };
    this.loadDomainListsEvent.emit(gridDataRefinerValue);
    this.gridDataHandle();
  }
  loadDomainFilterColumn(){
    this.domainFilterColumnEvent.emit();
  
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
    this.loadDomainList();
  }
  
  // updating the pagination infor based on dropdown selection
  pageSelectionChange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadDomainList();
  }
  
  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
  }
  
  gridDataHandle() {
    this.domainDataLists$.subscribe(
      (data: GridDataResult) => {
        this.gridDataResult = data;
        this.gridDataResult.data = filterBy(
          this.gridDataResult.data,
          this.filterData
        );
        this.gridDomainDataSubject.next(this.gridDataResult);
        if (data?.total >= 0 || data?.total === -1) {
          this.isDomainListGridLoaderShow = false;
        }
      }
    );
    this.isDomainListGridLoaderShow = false;
  }


  /** Internal event methods **/
  onCloseDomainsDetailClicked() {
    this.isDomainsDetailPopup = false;
  }
  onDomainsDetailClicked() {
    this.isDomainsDetailPopup = true;
  }

  onCloseDomainsDeleteClicked() {
    this.isDomainsDeletePopupShow = false;
  }
  onDomainsDeleteClicked() {
    this.isDomainsDeletePopupShow = true;
  }
  onCloseDomainsDeactivateClicked() {
    this.isDomainsDeactivatePopupShow = false;
  }
  onDomainsDeactivateClicked() {
    this.isDomainsDeactivatePopupShow = true;
  }

  onCloseDomainsReactivateClicked() {
    this.isDomainsReactivatePopupShow = false;
  }
}
