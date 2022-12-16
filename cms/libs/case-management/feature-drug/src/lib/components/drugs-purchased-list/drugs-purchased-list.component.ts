import {
  Component,
  OnInit,
  ViewEncapsulation,
  ChangeDetectionStrategy,
} from '@angular/core';
import { DrugPharmacyFacade } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
@Component({
  selector: 'case-management-drugs-purchased-list',
  templateUrl: './drugs-purchased-list.component.html',
  styleUrls: ['./drugs-purchased-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DrugsPurchasedListComponent implements OnInit {
  /** Public properties **/
  DrugsPurchased$ = this.drugPharmacyFacade.drugsPurchased$;
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
  // actions: Array<any> = [{ text: 'Action' }];
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
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
  constructor(private readonly drugPharmacyFacade: DrugPharmacyFacade) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadDrugsPurchased();
    this.state = {
      skip: this.gridSkipCount,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };
  }

  /** Private methods **/
  private loadDrugsPurchased() {
    this.drugPharmacyFacade.loadDrugsPurchased();
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
}
