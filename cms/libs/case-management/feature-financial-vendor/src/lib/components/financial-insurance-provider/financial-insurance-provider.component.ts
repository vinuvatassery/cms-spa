import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { InsuranceProviderFacade } from '@cms/case-management/domain';
import { State } from '@progress/kendo-data-query';
import { Subject, Subscription } from 'rxjs';
@Component({
  selector: 'cms-financial-insurance-provider',
  templateUrl: './financial-insurance-provider.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialInsuranceProviderComponent { 
  public formUiStyle: UIFormStyle = new UIFormStyle(); 
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  isInsuranceProviderGridLoaderShow = false;
  public sortValue = this.insuranceProviderFacade.sortValue;
  public sortType = this.insuranceProviderFacade.sortType;
  public pageSizes = this.insuranceProviderFacade.gridPageSizes;
  public gridSkipCount = this.insuranceProviderFacade.skipCount;
  public sort = this.insuranceProviderFacade.sort;
  public state!: State;
  insuranceProviderGridView$ = this.insuranceProviderFacade.insuranceProviderData$;
  insursnceProviderSubscription = new Subscription();
  insursnceProviderProfileSubject = new Subject();
  insursnceProviderProfilePhoto$ = this.insuranceProviderFacade.insursnceProviderProfilePhotoSubject;
  public emailBillingAddressActions = [
    {
      buttonType: 'btn-h-primary',
      text: 'Edit Provider',
      icon: 'edit',
      click: (data: any): void => {        
        console.log(data);
         
      },
    },
 
    {
      buttonType: 'btn-h-primary',
      text: 'Deactivate',
      icon: 'block',
      click: (data: any): void => {
        console.log(data);
       
      },
    },
  ];


  
  
   /** Constructor **/
   constructor(private readonly insuranceProviderFacade: InsuranceProviderFacade,) {}

   
  ngOnInit(): void {
    this.loadInsuranceProviderListGrid();
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
  loadInsuranceProviderListGrid() {
    this.state = {
      skip: this.gridSkipCount,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };
    this.insuranceProviderFacade.loadInsuranceProviderListGrid();
  }
}
