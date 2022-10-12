/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
/** Facades **/
import { DrugPharmacyFacade } from '@cms/case-management/domain';

@Component({
  selector: 'case-management-pharmacy-list',
  templateUrl: './pharmacy-list.component.html',
  styleUrls: ['./pharmacy-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PharmacyListComponent implements OnInit {
  /** Public properties **/
  clientpharmacies$ = this.drugPharmacyFacade.clientPharmacies$;
  isOpenChangePriorityClicked = false;
  isOpenPharmacyClicked = false;
  isEditPharmacyListClicked = false;
  selectedPharmacy!: any;
  // actions: Array<any> = [{ text: 'Action' }];
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  public actions = [
    {
      buttonType:"btn-h-primary",
      text: "Edit Pharmacy",
      icon: "edit",
      click: (): void => {
        this.onEditPharmacyClicked(this.actions);
      },
    },
    {
      buttonType:"btn-h-primary",
      text: "Change Priority",
      icon: "format_line_spacing",
      click: (): void => {
       this.onOpenChangePriorityClicked()
      },
    },
    
    {
      buttonType:"btn-h-danger",
      text: "Remove Pharmacy",
      icon: "delete",
      click: (): void => {
        console.log("Remove Pharmacy");
      },
    },
   
    
 
  ];

  /** Constructor **/
  constructor(private readonly drugPharmacyFacade: DrugPharmacyFacade) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadClientPharmacies();
  }

  /** Private methods **/
  private loadClientPharmacies() {
    this.drugPharmacyFacade.loadClientPharmacies();
    this.clientpharmacies$.subscribe({
      next: (pharmacies) => {
        pharmacies.forEach((pharmacyData: any) => {
          pharmacyData.PharmacyNameAndNumber =
            pharmacyData.PharmacyName + ' #' + pharmacyData.PharmcayId;
        });
      },
      error: (err) => {
        console.log(err);
      },
    });
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
