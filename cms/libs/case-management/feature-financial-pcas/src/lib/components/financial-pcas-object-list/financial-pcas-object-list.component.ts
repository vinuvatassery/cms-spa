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
  selector: 'cms-financial-pcas-object-list',
  templateUrl: './financial-pcas-object-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
 
export class FinancialPcasObjectListComponent implements OnInit, OnChanges
{
 
  public formUiStyle: UIFormStyle = new UIFormStyle();
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  isFinancialPcaObjectGridLoaderShow = false;
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() financialPcaObjectGridLists$: any;
  @Output() loadFinancialPcaObjectListEvent = new EventEmitter<any>();
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

  gridFinancialPcaObjectDataSubject = new Subject<any>();
  gridFinancialPcaObjectData$ =
    this.gridFinancialPcaObjectDataSubject.asObservable();
  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  objectGridActions =[

    {
      buttonType: 'btn-h-primary',
      text: 'Edit Object',
      icon: 'edit', 
    },
    {
      buttonType: 'btn-h-primary',
      text: 'Active Object',
      icon: 'check', 
    },
    {
      buttonType: 'btn-h-primary',
      text: 'De-active Object',
      icon: 'block', 
    },
    {
      buttonType: 'btn-h-primary',
      text: 'Add Group',
      icon: 'add', 
    },
    {
      buttonType: 'btn-h-danger',
      text: 'Delete Object',
      icon: 'delete', 
    },

  ];

  groupGridActions =[
    {
      buttonType: 'btn-h-primary',
      text: 'Edit Group',
      icon: 'edit', 
    },
    {
      buttonType: 'btn-h-primary',
      text: 'Active Group',
      icon: 'check', 
    },
    {
      buttonType: 'btn-h-primary',
      text: 'De-active Group',
      icon: 'block', 
    },
    {
      buttonType: 'btn-h-danger',
      text: 'Delete Group',
      icon: 'delete', 
    },

  ];
  aaaaaa = [
    {
      id: 1, 
      object: 'Object & Group Assignment',
      objectCode: '123213', 
      isActive: true,
    },
    {
      id: 2, 
      object: 'Object & Group Assignment',
      objectCode: '123213', 
      isActive: true,
    },
    
  ];
  bbbbbb = [
    {
      id: 1,  
      group: '123123`',  
      isActive: true,
    },
    {
      id: 2,
      group: '123123`',  
      isActive: true,
    },
    
  ];
  /** Constructor **/
  constructor(
    private readonly cdr: ChangeDetectorRef,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.loadFinancialPcaObjectListGrid();
  }
  ngOnChanges(): void {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };

    this.loadFinancialPcaObjectListGrid();
  }

  private loadFinancialPcaObjectListGrid(): void {
    this.loadPcaObject(
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType
    );
  }
  loadPcaObject(
    skipCountValue: number,
    maxResultCountValue: number,
    sortValue: string,
    sortTypeValue: string
  ) {
    this.isFinancialPcaObjectGridLoaderShow = true;
    const gridDataRefinerValue = {
      skipCount: skipCountValue,
      pagesize: maxResultCountValue,
      sortColumn: sortValue,
      sortType: sortTypeValue,
    };
    this.loadFinancialPcaObjectListEvent.emit(gridDataRefinerValue);
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
    this.loadFinancialPcaObjectListGrid();
  }

  // updating the pagination infor based on dropdown selection
  pageSelectionChange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadFinancialPcaObjectListGrid();
  }

  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
  }

  gridDataHandle() {
    this.financialPcaObjectGridLists$.subscribe(
      (data: GridDataResult) => {
        this.gridDataResult = data;
        this.gridDataResult.data = filterBy(
          this.gridDataResult.data,
          this.filterData
        );
        this.gridFinancialPcaObjectDataSubject.next(this.gridDataResult);
        if (data?.total >= 0 || data?.total === -1) {
          this.isFinancialPcaObjectGridLoaderShow = false;
        }
      }
    );
    this.isFinancialPcaObjectGridLoaderShow = false;
  }

 
 
}




