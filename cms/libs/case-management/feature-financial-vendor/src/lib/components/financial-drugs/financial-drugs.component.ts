import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { DrugCategoryCode, DrugsFacade } from '@cms/case-management/domain';
import { State } from '@progress/kendo-data-query';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'cms-financial-drugs',
  templateUrl: './financial-drugs.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialDrugsComponent {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  isFinancialDrugsDetailShow = false;
  isFinancialDrugsDeactivateShow = false;
  isFinancialDrugsReassignShow  = false;
  vendorId: any;
  DrugCategoryCode = DrugCategoryCode;
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  isDrugsGridLoaderShow = false;
  public sortValue = this.drugsFacade.sortValue;
  public sortType = this.drugsFacade.sortType;
  public pageSizes = this.drugsFacade.gridPageSizes;
  public gridSkipCount = this.drugsFacade.skipCount;
  public sort = this.drugsFacade.sort;
  public state!: State;
  drugsGridView$ = this.drugsFacade.drugsData$;
  dialogTitle = "Add";

  public emailBillingAddressActions = [
    {
      buttonType: 'btn-h-primary',
      text: 'Edit Drug',
      icon: 'edit',
      click: (data: any): void => {
        console.log(data);
        this.clickOpenAddEditFinancialDrugsDetails("Edit");
      },
    },
    {
      buttonType: 'btn-h-primary',
      text: 'Re-assign Drug',
      icon: 'compare_arrows',
      click: (data: any): void => {
        console.log(data);
        this.clickOpenReassignFinancialDrugsDetails();
      },
    },
    {
      buttonType: 'btn-h-primary',
      text: 'Deactivate Drug',
      icon: 'block',
      click: (data: any): void => {
        console.log(data);
        this.clickOpenDeactivateFinancialDrugsDetails();
      },
    },
  ];



   /** Constructor **/
   constructor(private readonly drugsFacade: DrugsFacade, private route: ActivatedRoute) {}



  ngOnInit(): void {
    this.vendorId = this.route.snapshot.queryParams['v_id'];

    this.state = {
      skip: this.gridSkipCount,
      take: this.pageSizes[0]?.value
    };
    this.loadDrugsListGrid();
  }
  ngOnChanges(): void {
    this.state = {
      skip: this.gridSkipCount,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };
  }

  // updating the pagination info based on dropdown selection
  pageSelectionchange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadDrugsListGrid();
  }

  public dataStateChange(stateData: any): void {
    this.sort = stateData.sort;
    this.sortValue = stateData.sort[0]?.field ?? this.sortValue;
    this.sortType = stateData.sort[0]?.dir ?? 'asc';
    this.state = stateData;
    this.sort = stateData.sort;
    this.sortValue = stateData.sort[0]?.field ?? this.sortValue;
    this.sortType = stateData.sort[0]?.dir ?? 'asc';
    this.state = stateData;
    this.loadDrugsListGrid();
  }
  loadDrugsListGrid() {
    this.drugsFacade.loadDrugsListGrid(
      this.vendorId ?? "",
      this.state.skip ?? 0,
      this.state.take ?? 0,
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
}
