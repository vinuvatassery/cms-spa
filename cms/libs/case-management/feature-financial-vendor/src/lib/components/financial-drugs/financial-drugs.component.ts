import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { DrugCategoryCode } from '@cms/case-management/domain';
import { State } from '@progress/kendo-data-query';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'cms-financial-drugs',
  templateUrl: './financial-drugs.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialDrugsComponent {
  @Input() drugsData$!: Observable<any>;
  @Input() vendorDetails$!: Observable<any>;
  @Input() pageSizes : any;
  @Input() sortValue : any;
  @Input() sortType : any;
  @Input() sort : any;
  @Input() gridSkipCount : any;
  @Output() loadDrugListEvent = new EventEmitter<any>();

  public formUiStyle: UIFormStyle = new UIFormStyle();
  isFinancialDrugsDetailShow = false;
  isFinancialDrugsDeactivateShow = false;
  isFinancialDrugsReassignShow  = false;
  vendorId: any;
  DrugCategoryCode = DrugCategoryCode;
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  isDrugsGridLoaderShow = false;
  public state!: State;
  dialogTitle = "Add";

  public emailBillingAddressActions = [
    {
      buttonType: 'btn-h-primary',
      text: 'Edit Drug',
      icon: 'edit',
      click: (data: any): void => {
        this.clickOpenAddEditFinancialDrugsDetails("Edit");
      },
    },
    {
      buttonType: 'btn-h-primary',
      text: 'Re-assign Drug',
      icon: 'compare_arrows',
      click: (data: any): void => {
        this.clickOpenReassignFinancialDrugsDetails();
      },
    },
    {
      buttonType: 'btn-h-primary',
      text: 'Deactivate Drug',
      icon: 'block',
      click: (data: any): void => {
        this.clickOpenDeactivateFinancialDrugsDetails();
      },
    },
  ];



   /** Constructor **/
   constructor(private route: ActivatedRoute,
    private readonly ref: ChangeDetectorRef,
   ) {}



  ngOnInit(): void {
    this.vendorId = this.route.snapshot.queryParams['v_id'];
  }

  ngOnChanges(): void {
    debugger;
    this.state = {
      skip: this.gridSkipCount,
      take: this.state?.take ?? this.pageSizes[0]?.value,
      sort: this.sort,
    };
    this.loadDrugsListGrid();
  }

  pageSelectionchange(data: any) {
    debugger;
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadDrugsListGrid();
  }

  public dataStateChange(stateData: any): void {
    debugger;
    this.sort = stateData.sort;
    this.sortValue = stateData.sort[0]?.field ?? this.sortValue;
    this.sortType = stateData.sort[0]?.dir ?? 'asc';
    this.state = stateData;
    this.loadDrugsListGrid();
  }

  loadDrugsListGrid() {
    this.loadDrugList (
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType
    );
  }

  clickOpenAddEditFinancialDrugsDetails(title:string) {
    this.dialogTitle = title;
    this.isFinancialDrugsDetailShow = true;
  }

  clickCloseAddEditFinancialDrugsDetails() {
    this.isFinancialDrugsDetailShow = false;
  }

  clickOpenDeactivateFinancialDrugsDetails() {
    this.isFinancialDrugsDeactivateShow = true;
  }
  clickCloseDeactivateFinancialDrugs() {
    this.isFinancialDrugsDeactivateShow = false;
  }
  clickOpenReassignFinancialDrugsDetails() {
    this.isFinancialDrugsReassignShow = true;
  }
  clickCloseReassignFinancialDrugs(){
    this.isFinancialDrugsReassignShow = false;
  }

  loadDrugList (
    skipCountValue: number,
    maxResultCountValue: number,
    sortValue: string,
    sortTypeValue: string)
    {
      const gridDataRefinerValue = {
        skipCount: skipCountValue,
        pageSize: maxResultCountValue,
        sortColumn: sortValue,
        sortType: sortTypeValue,
      };
     this.loadDrugListEvent.emit(gridDataRefinerValue);
  }


  public columnChange(e: any) {
    this.ref.detectChanges();
  }
}
