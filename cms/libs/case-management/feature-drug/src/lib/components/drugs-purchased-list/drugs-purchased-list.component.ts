import {
  Component,
  OnInit,
  ViewEncapsulation,Input
} from '@angular/core';
import { DrugPharmacyFacade, CaseFacade } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
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
  isPermiumWithinLastTwelveMonthsData:boolean=true;
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

  /** Constructor **/
  constructor(private readonly drugPharmacyFacade: DrugPharmacyFacade, private caseFacade: CaseFacade) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.state = {
      skip: this.gridSkipCount,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };
    this.loadDrugsPurchased();
  }
  
  /** Private methods **/
  private loadDrugsPurchased(  
    ) {   
      this.drugPharmacyFacade.getDrugPurchasedList(this.clientId,this.state.skip,this.state.take,this.sortValue,this.sortType,this.isPermiumWithinLastTwelveMonthsData);
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
    this.state = stateData;
   this.loadDrugsPurchased();
  }
  public onClickLoadDrugsPurchasedData()
  {
    this.loadDrugsPurchased();
  }
}
