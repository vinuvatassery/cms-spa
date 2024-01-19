/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
/** External Libraries **/
import { State } from '@progress/kendo-data-query';
import { Observable, Subject } from 'rxjs';
/** Internal Libraries **/
import { ClientPharmacy, Pharmacy, CaseFacade } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';

@Component({
  selector: 'case-management-pharmacy-list',
  templateUrl: './pharmacy-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PharmacyListComponent implements OnInit {
  /** Input Properties **/
  @Input() clientpharmacies$!: Observable<any>;
  @Input() pharmacysearchResult$!: Observable<Pharmacy>;
  @Input() selectedPharmacy$!: Observable<Pharmacy>;
  @Input() addPharmacyResponse$!: Observable<boolean>;
  @Input() editPharmacyResponse$!: Observable<boolean>;
  @Input() removePharmacyResponse$!: Observable<boolean>;
  @Input() triggerPriorityPopup$!: Observable<boolean>;
  @Input() searchLoaderVisibility$!: Observable<boolean>;
  @Input() clientId: any;
  @Input() showPharmacyRequiredValidation$!: Observable<boolean>;
  @Input() showPharmacyGrid:any = true;
  @Input() isCer:any = false;
  /** Output Properties **/
  @Output() searchPharmacy = new EventEmitter<string>();
  @Output() addPharmacyClick = new EventEmitter<any>();
  @Output() editPharmacyInit = new EventEmitter<string>();
  @Output() editPharmacyClick = new EventEmitter<{ clientPharmacyId: string, vendorId: string }>();
  @Output() removePharmacyClick = new EventEmitter<string>();

  /** Public properties **/
  isTriggerPriorityPopup = false;
  isEditPharmacyPriorityTitle = false;
  pharmacyPriorityModalButtonText = 'Save';
  isOpenChangePriorityClicked$ = new Subject();
  isOpenPharmacyClicked$ = new Subject();
  isEditPharmacyListClicked = false;
  isRemoveClientPharmacyClicked$ = new Subject();
  selectClientPharmacyId!: string;
  selectedPharmacyForEdit!: any;
  removeButtonEmitted = false;
  editButtonEmitted = false;
  addButtonEmitted = false;
  clientpharmacies:any[] = []
  public state!: State;
  isReadOnly$=this.caseFacade.isCaseReadOnly$;
  public formUiStyle: UIFormStyle = new UIFormStyle();
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
        this.isEditPharmacyPriorityTitle = true;
          this.onOpenChangePriorityClicked()
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

   /** Private properties **/
  clientPharmacyCount!:number;

  /** Constructor **/
  constructor(private caseFacade: CaseFacade) {
    this.isOpenChangePriorityClicked$.next(false);
    this.isOpenPharmacyClicked$.next(false);
    this.isRemoveClientPharmacyClicked$.next(false);
   }

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadClientPharmacies();  
    this.actionResponseSubscription();
    this.editPharmacyItemSubscribe();
    this.priorityPopupShowSubscription();
  }

  /** Private methods **/
  private loadClientPharmacies() {
    this.clientpharmacies$.subscribe({
      next: (pharmacies: ClientPharmacy[]) => {
        if(pharmacies && pharmacies.length === 0 ){
         
          this.isEditPharmacyPriorityTitle = false;
          this.pharmacyPriorityModalButtonText = 'Save';
        }
        else
        {
          this.clientpharmacies = pharmacies;
          this.isEditPharmacyPriorityTitle = true;
          this.pharmacyPriorityModalButtonText = 'Update';
        }
        pharmacies.forEach((pharmacyData: ClientPharmacy) => {
          const pharmacyNumber = pharmacyData?.pharmacyNumber ? `#${pharmacyData.pharmacyNumber}` : '';
          pharmacyData.pharmacyNameAndNumber = `${pharmacyData?.pharmacyName ?? ''} ${pharmacyNumber}`;
        });
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  private priorityPopupShowSubscription(){
    this.triggerPriorityPopup$.subscribe((value:boolean)=>{
      if(value ){
        this.isOpenChangePriorityClicked$.next(true);
        this.isEditPharmacyPriorityTitle = false;
        this.pharmacyPriorityModalButtonText = 'Save';
      }
      else
      {
        this.isEditPharmacyPriorityTitle = true;
        this.pharmacyPriorityModalButtonText = 'Update';
      }
    })
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

  addPharmacyEvent(pharmacy:any) {
    this.addPharmacyClick.emit(pharmacy);
  }

  editPharmacyEvent(pharmacy:any) {
    const data = { clientPharmacyId: this.selectClientPharmacyId, vendorId: pharmacy.vendorId,vendorAddressId:pharmacy.VendorAddressId }
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

  removeClientPharmacyOnEditMode(){
    this.handleClosePharmacyClicked()
    this.onRemovePharmacyClicked(this.selectClientPharmacyId);
  }

  removeClientPharmacy(data: any) {
    if (data?.isDelete === true) {
      this.removePharmacyEvent(data?.clientPharmacyId);
    }
    else{
      this.handleRemoveClientPharmacyClose();
    }
  }

  handleRemoveClientPharmacyClose() {
    this.isRemoveClientPharmacyClicked$.next(false);
    this.removeButtonEmitted = false;
  }
}
