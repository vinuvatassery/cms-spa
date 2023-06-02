import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { DrugsFacade } from '@cms/case-management/domain';
import { State } from '@progress/kendo-data-query';
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
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  isDrugsGridLoaderShow = false;
  public sortValue = this.drugsFacade.sortValue;
  public sortType = this.drugsFacade.sortType;
  public pageSizes = this.drugsFacade.gridPageSizes;
  public gridSkipCount = this.drugsFacade.skipCount;
  public sort = this.drugsFacade.sort;
  public state!: State;
  drugsGridView$ = this.drugsFacade.drugsData$;
 
  public emailBillingAddressActions = [
    {
      buttonType: 'btn-h-primary',
      text: 'Edit Drug',
      icon: 'edit',
      click: (address: any): void => {        
        console.log(address);
        this.clickOpenAddEditFinancialDrugsDetails();
      },
    },
    {
      buttonType: 'btn-h-primary',
      text: 'Re-assign Drug',
      icon: 'compare_arrows',
      click: (address: any): void => {
        console.log(address);
        this.clickOpenReassignFinancialDrugsDetails();
      },
    },
    {
      buttonType: 'btn-h-primary',
      text: 'Deactivate Drug',
      icon: 'block',
      click: (address: any): void => {
        console.log(address);
        this.clickOpenDeactivateFinancialDrugsDetails();
      },
    },
  ];


  
   /** Constructor **/
   constructor(private readonly drugsFacade: DrugsFacade) {}


   
  ngOnInit(): void {
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
  }

  public dataStateChange(stateData: any): void {
    this.sort = stateData.sort;
    this.sortValue = stateData.sort[0]?.field ?? this.sortValue;
    this.sortType = stateData.sort[0]?.dir ?? 'asc';
    this.state = stateData;
  }
  loadDrugsListGrid() {
    this.state = {
      skip: this.gridSkipCount,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };
    this.drugsFacade.loadDrugsListGrid();
  }
  clickOpenAddEditFinancialDrugsDetails() {
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
