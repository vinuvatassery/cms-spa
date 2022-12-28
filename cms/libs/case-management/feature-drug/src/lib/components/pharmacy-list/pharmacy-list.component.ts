/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
/** External Libraries **/
import { State } from '@progress/kendo-data-query';
import { BehaviorSubject, Observable } from 'rxjs';
/** Internal Libraries **/
import { ClientPharmacy, DrugPharmacyFacade, Pharmacy } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';

@Component({
  selector: 'case-management-pharmacy-list',
  templateUrl: './pharmacy-list.component.html',
  styleUrls: ['./pharmacy-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PharmacyListComponent implements OnInit {
  /** Input Properties **/
  @Input() clientpharmacies$!: Observable<any>;
  @Input() pharmacysearchResult$!: Observable<Pharmacy>
  @Input() selectedPharmacy$!: Observable<Pharmacy>
  @Input() addPharmacyResponse$!: Observable<boolean>
  @Input() editPharmacyResponse$!: Observable<boolean>
  @Input() removePharmacyResponse$!: Observable<boolean>
  /** Output Properties **/
  @Output() searchPharmacy = new EventEmitter<string>();
  @Output() addPharmacyClick = new EventEmitter<string>();
  @Output() editPharmacyInit = new EventEmitter<string>();
  @Output() editPharmacyClick = new EventEmitter<{ clientPharmacyId: string, vendorId: string }>();
  @Output() removePharmacyClick = new EventEmitter<string>();

  /** Public properties **/
  //clientpharmacies$ = this.drugPharmacyFacade.clientPharmacies$;
  isOpenChangePriorityClicked$ = new BehaviorSubject(false);
  isOpenPharmacyClicked$ = new BehaviorSubject(false);
  isEditPharmacyListClicked = false;
  isRemoveClientPharmacyClicked$ = new BehaviorSubject(false);
  selectClientPharmacyId!: string;
  selectedPharmacyForEdit!: any;
  removeButtonEmitted = false;
  editButtonEmitted = false;
  addButtonEmitted = false;


  // public sortValue = this.drugPharmacyFacade.sortValue;
  // public sortType = this.drugPharmacyFacade.sortType;
  // public pageSizes = this.drugPharmacyFacade.gridPageSizes;
  // public gridSkipCount = this.drugPharmacyFacade.skipCount;
  // public sort = this.drugPharmacyFacade.sort;
  public state!: State;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  // actions: Array<any> = [{ text: 'Action' }];
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  public actions = [
    {
      buttonType: "btn-h-primary",
      text: "Edit Pharmacy",
      icon: "edit",
      click: (clientPharmacyId: string, vendorId: string): void => {
        if (this.editButtonEmitted === false) {
          this.onEditPharmacyClicked(clientPharmacyId, vendorId);
          this.editButtonEmitted = true;
        }
      },
    },
    {
      buttonType: "btn-h-primary",
      text: "Change Priority",
      icon: "format_line_spacing",
      click: (clientPharmacyId: string, vendorId: string): void => {
        if (this.addButtonEmitted === false) {
          this.onOpenChangePriorityClicked()
          this.addButtonEmitted = true;
        }
      },
    },

    {
      buttonType: "btn-h-danger",
      text: "Remove Pharmacy",
      icon: "delete",
      click: (clientPharmacyId: string, vendorId: string): void => {
        if (this.removeButtonEmitted === false) {
          this.onRemovePharmacyClicked(clientPharmacyId);
          this.removeButtonEmitted = true;
        }

      },
    },
  ];

  /** Constructor **/
  constructor() { }

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.state = {
      skip: this.gridSkipCount,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };
    this.loadClientPharmacies();  
    this.actionResponseSubscription();
    this.editPharmacyItemSubscribe();
 
  }

  /** Private methods **/
  private loadClientPharmacies() {
    // this.drugPharmacyFacade.loadClientPharmacies();
    this.clientpharmacies$.subscribe({
      next: (pharmacies: ClientPharmacy[]) => {
        pharmacies.forEach((pharmacyData: any) => {
          pharmacyData.pharmacyNameAndNumber =
            pharmacyData.pharmacyName + ' #' + pharmacyData.pharmacyNumber;
        });
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  private actionResponseSubscription() {
    this.addPharmacyResponse$.subscribe(response => {
      this.handleActionResult(response);
    });

    this.editPharmacyResponse$.subscribe(response => {
      this.handleActionResult(response);
    });

    this.removePharmacyResponse$.subscribe(response => {
      this.handleActionResult(response);
    });
  }

  private editPharmacyItemSubscribe() {
    this.selectedPharmacy$.subscribe((selectedItem: Pharmacy) => {
      if (selectedItem && selectedItem?.vendorId) {
        this.selectedPharmacyForEdit = selectedItem;
        this.isOpenPharmacyClicked$.next(true);
      }
    })
  }

  private handleActionResult(resp: boolean) {
    if (resp === true) {
      this.handleClosePharmacyClicked();
    }
  }

  /** Internal event methods **/
  onOpenPharmacyClicked() {
    this.isOpenPharmacyClicked$.next(true);
  }

  onEditPharmacyClicked(clientPharmacyId: string, vendorId: string) {
    this.isEditPharmacyListClicked = true
    this.selectClientPharmacyId = clientPharmacyId;
    this.editPharmacyInit.emit(vendorId);
  }

  onOpenChangePriorityClicked() {
    this.isOpenChangePriorityClicked$.next(true);
  }

  onSearchPharmacy(searchText: string) {
    this.searchPharmacy.emit(searchText);
  }

  addPharmacyEvent(pharmacyId: string) {
    this.addPharmacyClick.emit(pharmacyId);
  }

  editPharmacyEvent(pharmacyId: string) {
    const data = { clientPharmacyId: this.selectClientPharmacyId, vendorId: pharmacyId }
    this.editPharmacyClick.emit(data);
  }

  removePharmacyEvent(clientPharmacyId: string) {
    this.removePharmacyClick.emit(clientPharmacyId);
  }
  /** External event methods **/
  handleCloseChangePriorityClikced() {
    this.isOpenChangePriorityClicked$.next(false);
  }

  handleClosePharmacyClicked() {
    this.isOpenPharmacyClicked$.next(false);
    this.isEditPharmacyListClicked = false;
    this.isRemoveClientPharmacyClicked$.next(false);
    this.removeButtonEmitted = false;
    this.editButtonEmitted = false;
    this.addButtonEmitted = false;
  }

  onRemovePharmacyClicked(clientPharmacyId: string) {
    this.selectClientPharmacyId = clientPharmacyId;
    this.isRemoveClientPharmacyClicked$.next(true);
  }

  removeClientPharmacy(data: any) {
    if (data?.isDelete === true) {
      this.removePharmacyEvent(data?.clientPharmacyId);
    }
  }

  handleRemoveClientPharmacyClose() {
    this.isRemoveClientPharmacyClicked$.next(true);
    this.removeButtonEmitted = false;
  }
}
