import {
  Component,
  OnInit,
  ViewEncapsulation,Input,
  ChangeDetectorRef,
  EventEmitter,
  Output
} from '@angular/core';
import { DrugPharmacyFacade, CaseFacade } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
import { FilterService} from '@progress/kendo-angular-grid';
import { CompositeFilterDescriptor } from '@progress/kendo-data-query';
import { fileAddIcon } from '@progress/kendo-svg-icons';
@Component({
  selector: 'case-management-drugs-purchased-list',
  templateUrl: './drugs-purchased-list.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class DrugsPurchasedListComponent implements OnInit {
  @Input() clientId: any;
  /** Public properties **/
  drugPurchases$ = this.drugPharmacyFacade.drugPurchases$;
  isOpenChangePriorityClicked = false;
  isOpenPharmacyClicked = false;
  isEditPharmacyListClicked = false;
  selectedPharmacy!: any;
  public sortValue = this.drugPharmacyFacade.sortValue;
  public sortType = this.drugPharmacyFacade.sortType;
  public pageSizes = this.drugPharmacyFacade.gridPageSizes;
  public gridSkipCount = this.drugPharmacyFacade.skipCount;
  public sort = this.drugPharmacyFacade.sort;
  public state!: State;
  public formUiStyle : UIFormStyle = new UIFormStyle(); 
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  isReadOnly$=this.caseFacade.isCaseReadOnly$;
  isOnlyPremiumsWith12Months:boolean=true;
  public actions = [
    {
      buttonType: 'btn-h-primary',
      text: 'Edit  ',
      icon: 'edit',
      click: (): void => {
        this.onEditPharmacyClicked(this.actions);
      },
    },
    {
      buttonType: 'btn-h-primary',
      text: 'Change Priority',
      icon: 'format_line_spacing',
      click: (): void => {
        this.onOpenChangePriorityClicked();
      },
    },

    {
      buttonType: 'btn-h-danger',
      text: 'Remove  ',
      icon: 'delete',
      click: (): void => {
        console.log('Remove Pharmacy');
      },
    },
  ];
  filteredBy = "";
  searchValue = "";
  isFiltered = false;
  public gridFilter: CompositeFilterDescriptor={logic:'and',filters:[]};
  selectedColumn!: any;
  filter : any = "";
  afterDate: any;
  beforeDate: any;
  columnName: any = "";
  @Output() loadDrugsPurchasedListEvent = new EventEmitter<any>();
  /** Constructor **/
  constructor(private readonly drugPharmacyFacade: DrugPharmacyFacade, private caseFacade: CaseFacade,private readonly  cdr :ChangeDetectorRef) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.state = {
      skip: this.gridSkipCount,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
      filter : this.filter,
    };
    this.loadDrugsPurchased();
    
  }
  
  /** Private methods **/
  private loadDrugsPurchased(  
  ) { 
    this.drugPharmacyFacade.getDrugPurchasedList(this.clientId,this.state.skip,this.state.take,this.sortValue,this.sortType, this.filter);
    debugger
    this.loadDrugsPurchasedList(null);
  }

  /** Internal event methods **/
  onOpenPharmacyClicked() {
    this.isOpenPharmacyClicked = true;
  }

  onEditPharmacyClicked(pharmacy: any) {
    this.isEditPharmacyListClicked = true;
    this.isOpenPharmacyClicked = true;
    this.selectedPharmacy = pharmacy;
  }

  onOpenChangePriorityClicked() {
    this.isOpenChangePriorityClicked = true;
  }

  /** External event methods **/
  handleCloseChangePriorityClikced() {
    this.isOpenChangePriorityClicked = false;
  }

  handleClosePharmacyClicked() {
    this.isOpenPharmacyClicked = false;
    this.isEditPharmacyListClicked = false;
  }
  pageselectionchange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadDrugsPurchased();
  }

  public dataStateChange(stateData: any): void {
    debugger
    if(stateData.filter?.filters.length > 0)
    {
      let stateFilter = stateData.filter?.filters.slice(-1)[0].filters[0];
      this.columnName = stateFilter.field;

        this.filter =stateFilter.value
      this.isFiltered = true;
    }
    this.state=stateData;
   this.loadDrugsPurchased();
  }
  filterChange(filter: CompositeFilterDescriptor): void {
    this.gridFilter = filter;
  }
  
 groupFilterChange(value: any, filterService: FilterService): void {
    filterService.filter({
        filters: [{
          field: "group",
          operator: "eq",
          value:value.lovTypeCode
      }],
        logic: "or"
    });
}
private loadDrugsPurchasedList(event: any ): void {
  debugger
  const gridDataRefinerValue =
  {
    skipCount: this.state.skip ?? 0,
    pagesize : this.state.take ?? 0,
    sortColumn : this.sortValue,
    sortType : this.sortType,
    columnName : this.columnName,
    filter : this.filter,
    afterDate: this.afterDate,
    beforeDate: this.beforeDate
  }

  this.loadPurchased(gridDataRefinerValue)
}

loadPurchased(gridDataRefinerValue:any)
 {
   this.loadDrugsPurchasedListEvent.next(gridDataRefinerValue);
   this.cdr.detectChanges();
 }

}
