
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa'; 
import { Router } from '@angular/router';
import {  GridDataResult } from '@progress/kendo-angular-grid';
import {
  CompositeFilterDescriptor,
  State,
  filterBy,
} from '@progress/kendo-data-query';
import { Subject } from 'rxjs';

@Component({
  selector: 'cms-medical-claims-all-payments-list',
  templateUrl: './medical-claims-all-payments-list.component.html',
  styleUrls: ['./medical-claims-all-payments-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalClaimsAllPaymentsListComponent implements OnInit, OnChanges{
  public formUiStyle: UIFormStyle = new UIFormStyle();
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  isMedicalClaimsAllPaymentsGridLoaderShow = false;
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() medicalClaimsAllPaymentsGridLists$: any;
  @Output() loadMedicalClaimsAllPaymentsListEvent = new EventEmitter<any>();
  public state!: State;
  sortColumn = 'batch';
  sortDir = 'Ascending';
  columnsReordered = false;
  filteredBy = '';
  searchValue = '';
  isFiltered = false;
  filter!: any;
  selectedColumn!: any;
  gridDataResult!: GridDataResult;

  gridMedicalClaimsAllPaymentsDataSubject = new Subject<any>();
  gridMedicalClaimsAllPaymentsData$ = this.gridMedicalClaimsAllPaymentsDataSubject.asObservable();
  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  
  
  public allPaymentsGridActions = [
    {
      buttonType: 'btn-h-primary',
      text: 'Edit Refund',
      icon: 'edit', 
    },
    {
      buttonType: 'btn-h-primary',
      text: 'UnAllPayments Refund',
      icon: 'undo', 
    },
    {
      buttonType: 'btn-h-danger',
      text: 'Delete Refund',
      icon: 'delete', 
    },
  ];
  public claimsProcessMore = [
    {
      buttonType: 'btn-h-primary',
      text: 'Request Payments',
      icon: 'local_atm',
      click: (data: any): void => {
         
      },
    },

    {
      buttonType: 'btn-h-primary',
      text: 'Reconcile Payments',
      icon: 'edit',
      click: (data: any): void => {
       
      },
    },
    {
      buttonType: 'btn-h-primary',
      text: 'Print Authorizations',
      icon: 'print',
      click: (data: any): void => {
       
      },
    },
  ];
  
  /** Constructor **/
  constructor(private route: Router, ) {}

  ngOnInit(): void {
    this.loadMedicalClaimsAllPaymentsListGrid();
  }
  ngOnChanges(): void {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };

    this.loadMedicalClaimsAllPaymentsListGrid();
  }


  private loadMedicalClaimsAllPaymentsListGrid(): void {
    this.loadRefundAllPayments(
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType
    );
  }
  loadRefundAllPayments(
    skipCountValue: number,
    maxResultCountValue: number,
    sortValue: string,
    sortTypeValue: string
  ) {
    this.isMedicalClaimsAllPaymentsGridLoaderShow = true;
    const gridDataRefinerValue = {
      skipCount: skipCountValue,
      pagesize: maxResultCountValue,
      sortColumn: sortValue,
      sortType: sortTypeValue,
    };
    this.loadMedicalClaimsAllPaymentsListEvent.emit(gridDataRefinerValue);
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
    this.loadMedicalClaimsAllPaymentsListGrid();
  }

  // updating the pagination infor based on dropdown selection
  pageSelectionChange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadMedicalClaimsAllPaymentsListGrid();
  }

  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
  }

  gridDataHandle() {
    this.medicalClaimsAllPaymentsGridLists$.subscribe((data: GridDataResult) => {
      this.gridDataResult = data;
      this.gridDataResult.data = filterBy(
        this.gridDataResult.data,
        this.filterData
      );
      this.gridMedicalClaimsAllPaymentsDataSubject.next(this.gridDataResult);
      if (data?.total >= 0 || data?.total === -1) { 
        this.isMedicalClaimsAllPaymentsGridLoaderShow = false;
      }
    });
    this.isMedicalClaimsAllPaymentsGridLoaderShow = false;
  }
 
}

 