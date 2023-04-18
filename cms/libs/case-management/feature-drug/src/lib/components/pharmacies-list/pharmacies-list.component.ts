import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input,
  ChangeDetectorRef,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  DrugPharmacyFacade,
  WorkflowFacade,
  Pharmacy,
  StatusFlag,
  CompletionChecklist,
  PriorityCode,
} from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
import { Observable, Subject } from 'rxjs';
import { LoggingService } from '@cms/shared/util-core';
@Component({
  selector: 'case-management-pharmacies-list',
  templateUrl: './pharmacies-list.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PharmaciesListComponent implements OnInit{
  /** Input properties **/
  @Input() clientId: any;
  @Input() clientpharmacies$!: Observable<any>;
  @Input() pharmacysearchResult$!: Observable<Pharmacy>;
  @Input() selectedPharmacy$!: Observable<Pharmacy>;
  @Input() addPharmacyResponse$!: Observable<boolean>;
  @Input() editPharmacyResponse$!: Observable<boolean>;
  @Input() removePharmacyResponse$!: Observable<boolean>;
  @Input() removeDrugPharmacyResponse$!: Observable<boolean>;
  @Input() triggerPriorityPopup$!: Observable<boolean>;
  @Input() searchLoaderVisibility$!: Observable<boolean>;
  // @Input() clientpharmacies$!: Observable<any>;
  /** Output Properties **/
  @Output() searchPharmacy = new EventEmitter<string>();
  @Output() addPharmacyClick = new EventEmitter<any>();
  @Output() editPharmacyInit = new EventEmitter<string>();
  @Output() editPharmacyClick = new EventEmitter<{
    clientPharmacyId: string;
    vendorId: string;
  }>();
  @Output() removePharmacyClick = new EventEmitter<any>();
  /** Public properties **/
  pharmaciesTotal: any = {};
  priority: string = PriorityCode.Primary;
  pharmaciesList$ = this.drugPharmacyFacade.clientPharmacies$;
  isOpenChangePriorityClicked = false;
  isOpenDeactivatePharmaciesClicked = false;
  isOpenReactivatePharmaciesClicked = false;
  isOpenPharmacyClicked = false;
  removeDrugPharmacyRsp$ = this.drugPharmacyFacade.removeDrugPharmacyResponse$;
  isEditPharmacyListClicked = false;
  selectedPharmacy!: any;
  /** Public properties **/
  isTriggerPriorityPopup = false;
  isEditPharmacyPriorityTitle = false;
  isShowHistoricalData = false;
  isOpenSelectNewPrimaryPharmaciesClicked = false;
  pharmacyPriorityModalButtonText = 'Save';
  isOpenChangePriorityClicked$ = new Subject();
  isOpenPharmacyClicked$ = new Subject();
  isRemoveClientPharmacyClicked$ = new Subject();
  selectClientPharmacyId!: string;
  selectClientPharmacyDetails!: any;
  selectedPharmacyForEdit!: any;
  removeButtonEmitted = false;
  editButtonEmitted = false;
  isSetAsPrimary = false;
  pharmacies: any[] = [];
  changePharmacyObj: any;
  pharmacyId: any;
  vendorId: any;
  triggerPriorityPopupNumber = 0;
  public sortValue = this.drugPharmacyFacade.sortValue;
  public sortType = this.drugPharmacyFacade.sortType;
  public pageSizes = this.drugPharmacyFacade.gridPageSizes;
  public gridSkipCount = this.drugPharmacyFacade.skipCount;
  public sort = this.drugPharmacyFacade.sort;
  public state!: State;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  // actions: Array<any> = [{ text: 'Action' }];
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  public pharmacyOptions = [
    {
      buttonType: 'btn-h-danger',
      text: 'Deactivate',
      icon: 'block',
      type: 'Deactivate',
      click: (clientPharmacy: any): void => {
        if (clientPharmacy.clientPharmacyId) {
          let pharmacyObj = {
            ClientId: this.clientId,
            IsActive: false,
          };
          this.pharmacyId = clientPharmacy.clientPharmacyId;
          this.vendorId = clientPharmacy.vendorId;
          this.changePharmacyObj = pharmacyObj;
          if (
            clientPharmacy.priorityCode === PriorityCode.Primary
          ) {
            this.OpenSelectNewPrimaryPharmaciesClicked(
              clientPharmacy,
              'deactivate'
            );
          } else {
            if (
              clientPharmacy.clientPharmacyId &&
              clientPharmacy.priorityCode != PriorityCode.Primary
            ) {
              this.OpenDeactivatePharmaciesClicked(clientPharmacy);
            }
          }
        }
      },
    },
    {
      buttonType: 'btn-h-warn',
      text: 'Mark Primary',
      icon: 'star',
      type: 'MarkAsPrimary',
      click: (clientPharmacy: any): void => {
        if (clientPharmacy.clientPharmacyId) {
          let pharmacyPriorityites = [
            {
              ClientPharmacyId: clientPharmacy.clientPharmacyId,
              ClientId: this.clientId,
              PriorityCode: 'P',
            },
          ];
          this.drugPharmacyFacade.updateDrugPharamcyPriority(
            this.clientId,
            pharmacyPriorityites,
            this.isShowHistoricalData
          );
        }
      },
    },
    {
      buttonType: 'btn-h-primary',
      text: 'Re-activate',
      icon: 'done',
      type: 'Reactivate',
      click: (clientPharmacy: any): void => {
        if (clientPharmacy.vendorId) {
          this.drugPharmacyFacade.addClientPharmacy(this.clientId,clientPharmacy?.vendorId,this.isShowHistoricalData);
        }
      },
    },
    {
      buttonType: 'btn-h-danger',
      text: 'Remove',
      icon: 'delete',
      type: 'delete',
      click: (
        clientPharmacy: any,
        vendorId: string,
        clientPharmacyId: string
      ): void => {
        if (clientPharmacy.clientPharmacyId) {
          this.pharmacyId = clientPharmacy.clientPharmacyId;
          this.vendorId = clientPharmacy.clientPharmacyId;
          if (
            clientPharmacy.priorityCode === PriorityCode.Primary ||
            this.pharmacies.length === 1
          ) {
            this.OpenSelectNewPrimaryPharmaciesClicked(
              clientPharmacy,
              'remove'
            );
          } else {
            if (this.removeButtonEmitted === false) {
              this.onRemovePharmacyClicked(clientPharmacy.clientPharmacyId);
              this.removeButtonEmitted = true;
            }
          }
        }
      },
    },
  ];
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
        console.log('Remove  ');
      },
    },
  ];

  /** Constructor **/
  constructor(
    private readonly drugPharmacyFacade: DrugPharmacyFacade,
    private readonly workflowFacade: WorkflowFacade,
    private readonly loggingService: LoggingService,
    private readonly cdr: ChangeDetectorRef
  ) {

    this.isOpenPharmacyClicked$.next(false);
    this.isRemoveClientPharmacyClicked$.next(false);
  }

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadPharmacieslist();
    this.state = {
      skip: this.gridSkipCount,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };
    this.drugPharmacyFacade.clientPharmacies$.subscribe((list) => {
      if (list && list.length >= 0) {
        this.pharmacies = list;
        this.handleClosePharmacyClicked();
        this.handleCloseSelectNewPrimaryPharmaciesClicked();
        this.handleCloseReactivatePharmaciesClicked();
        this.isOpenDeactivatePharmaciesClicked = false;
      }
    });
    this.triggerPriorityPopup$.subscribe(isTrigered =>{
      if(isTrigered && this.triggerPriorityPopupNumber == 0 && !this.isSetAsPrimary){
        this.triggerPriorityPopupNumber++;
        this.isTriggerPriorityPopup = true;

      }
    });
    this.drugPharmacyFacade.newAddedPharmacyObs.subscribe((isAdded) =>{
      if(isAdded){
        this.triggerPriorityPopupNumber = 0;
        this.handleCloseChangePriorityClikced();
      }
    });
  }

  /** Private methods **/
  filterActionButtonOptions(options: any[], actionType: any): any[] {
    let filteredOptions: any[] = [];
    if (
      actionType.priorityCode != PriorityCode.Primary &&
      actionType.activeFlag === StatusFlag.Yes
    ) {
      filteredOptions = options.filter((option) => option.type != 'Reactivate');
    } else if (
      actionType.priorityCode != PriorityCode.Primary &&
      actionType.activeFlag === StatusFlag.No
    ) {
      filteredOptions = options.filter((option) => option.type != 'Deactivate' && option.type != 'MarkAsPrimary');
    } else if (
      actionType.priorityCode === PriorityCode.Primary &&
      actionType.activeFlag === StatusFlag.Yes
    ) {
      filteredOptions = options.filter(
        (option) =>
          option.type != 'MarkAsPrimary' && option.type != 'Reactivate'
      );
    } else if (
      actionType.priorityCode === PriorityCode.Primary &&
      actionType.activeFlag === StatusFlag.No
    ) {
      filteredOptions = options.filter(
        (option) =>
          option.type != 'MarkAsPrimary' && option.type != 'Deactivate'
      );
    } else {
      filteredOptions = options;
    }

    return filteredOptions;
  }
  private updateWorkFlowStatus(isCompleted: boolean) {
    const workFlowdata: CompletionChecklist[] = [
      {
        dataPointName: 'drugPharmacy',
        status: isCompleted ? StatusFlag.Yes : StatusFlag.No,
      },
    ];

    this.workflowFacade.updateChecklist(workFlowdata);
  }
  onGetHistoricalPharmaciesData() {

    this.loadPharmacieslist();
  }
  private loadPharmacieslist() {
    this.drugPharmacyFacade.loadClientPharmacyList(
      this.clientId,
      false,
      this.isShowHistoricalData
    );
  }

  /** Internal event methods **/
  updateAndDeactivatePharmacy(data: any) {
 
    if (data && data.isNewAdded) {
      this.drugPharmacyFacade
        .addDrugPharmacy(
          this.clientId,
          data.newPharmacy.vendorId,
          PriorityCode.Primary,
          this.isShowHistoricalData
        )
        .then((isSucceed: any) => {
          if (isSucceed) {
            this.drugPharmacyFacade.deactivePharmacies(
              this.pharmacyId,
              this.changePharmacyObj,
              this.isShowHistoricalData
            );
          }
        });
    } else if (data && !data.isNewAdded) {
      let updatedPharmacy = [
        {
          ClientPharmacyId: data.newPharmacy.clientPharmacyId,
          ClientId: this.clientId,
          PriorityCode: PriorityCode.Primary,
        },
      ];
      this.drugPharmacyFacade
        .updateDrugPharamcyPriority(this.clientId, updatedPharmacy,
          this.isShowHistoricalData)
        .then((isSucceed: any) => {
          if (isSucceed) {
            this.drugPharmacyFacade.deactivePharmacies(
              this.pharmacyId,
              this.changePharmacyObj,
              this.isShowHistoricalData
            );
          }
        });
    } else {
      this.drugPharmacyFacade.deactivePharmacies(
        this.pharmacyId,
        this.changePharmacyObj,
        this.isShowHistoricalData
      );
    }
  }
  setUpdatedPharmacy(pharmacyId: any) {
    let updatedPharmacy = [
      {
        ClientPharmacyId: pharmacyId,
        ClientId: this.clientId,
        PriorityCode: PriorityCode.Primary,
      },
    ];
    this.drugPharmacyFacade.updateDrugPharamcyPriority(
      this.clientId,
      updatedPharmacy,
      this.isShowHistoricalData
    );
  }
  onRemovePharmacy(data: any) {
    if (data !== null) {
      this.removeButtonEmitted = true;
      if (data && data.isNewAdded) {
        this.drugPharmacyFacade
          .addDrugPharmacy(this.clientId, data.newPharmacy.vendorId, PriorityCode.Primary,
          this.isShowHistoricalData)
          .then((isSuceed) => {
            if (isSuceed) {
              this.drugPharmacyFacade.removeClientPharmacy(
                this.clientId ?? 0,
                this.pharmacyId,
                this.isShowHistoricalData
              );
            }
          });
      } else if (data && !data.isNewAdded) {
        let updatedPharmacy = [
          {
            ClientPharmacyId: data.newPharmacy.clientPharmacyId,
            ClientId: this.clientId,
            PriorityCode: PriorityCode.Primary,
          },
        ];
        this.drugPharmacyFacade
          .updateDrugPharamcyPriority(this.clientId, updatedPharmacy,
            this.isShowHistoricalData)
          .then((isSucceed: any) => {
            if (isSucceed) {
              this.drugPharmacyFacade.removeClientPharmacy(
                this.clientId ?? 0,
                this.pharmacyId,
                this.isShowHistoricalData
              );
            }
          });
      }
    } else {
      this.drugPharmacyFacade.removeClientPharmacy(
        this.clientId ?? 0,
        this.pharmacyId,
        this.isShowHistoricalData
      );
    }
  }
  onOpenPharmacyClicked() {
    this.isOpenPharmacyClicked = true;
  }

  onEditPharmacyClicked(pharmacy: any) {
    this.isEditPharmacyListClicked = true;
    this.isOpenPharmacyClicked = true;
    this.selectedPharmacy = pharmacy;
  }

  onRemovePharmacyClicked(clientPharmacyId: string) {
    this.selectClientPharmacyId = clientPharmacyId;
    this.isRemoveClientPharmacyClicked$.next(true);
  }
  onOpenChangePriorityClicked() {
    this.isOpenChangePriorityClicked = true;
  }

  /** External event methods **/
  handleCloseChangePriorityClicked() {
    this.isOpenChangePriorityClicked = false;
  }

  handleClosePharmacyClicked() {
    this.isOpenPharmacyClicked = false;
    this.isEditPharmacyListClicked = false;
    this.isOpenPharmacyClicked$.next(false);
    this.isRemoveClientPharmacyClicked$.next(false);
  }
  removePharmacyEvent(clientPharmacyId: string) {
    this.removeButtonEmitted = false;
    let data = {
      vendorId:clientPharmacyId,
      isShowHistoricalData:this.isShowHistoricalData
    }
    this.removePharmacyClick.emit(data);
  }
  addPharmacyEvent(pharmacyId: string) {
    this.triggerPriorityPopupNumber = 0;
    this.addPharmacyClick.emit(pharmacyId);
  }
  removeClientPharmacyOnEditMode() {
    this.handleClosePharmacyClicked();
    let data = {
      vendorId:this.selectClientPharmacyId,
      isShowHistoricalData:this.isShowHistoricalData
    }
    this.removePharmacyClick.emit(data);
  }
  setAsPrimaryEvent(data:any){
    this.isSetAsPrimary = data;
}
  onSearchPharmacy(searchText: string) {
    this.searchPharmacy.emit(searchText);
  }

  removeClientPharmacy(data: any) {
    if (data?.isDelete === true) {
      this.removePharmacyEvent(data?.clientPharmacyId);
    } else {
      this.handleRemoveClientPharmacyClose();
    }
  }

  handleRemoveClientPharmacyClose() {
    this.removeButtonEmitted = false;
    this.isOpenPharmacyClicked$.next(false);
    this.isRemoveClientPharmacyClicked$.next(false);
  }
  disableAddpharmacyButton(pharmacies:any[]):boolean {
    let isDisable = false;
    if(pharmacies && pharmacies?.length > 0){
      isDisable =  pharmacies.filter(item =>item.activeFlag === 'Y').length >= 3 ? true : false;
    }
    return isDisable;
  }

  /** reactivate Pharmacies  **/
  reActivatePharmaciesClicked(clientPharmacyId: string) {
    this.drugPharmacyFacade.updatedMakePharmaciesPrimary(clientPharmacyId);
  }
  /** make Pharmacies Primary **/
  makePharmaciesPrimaryClicked(clientPharmacyId: string) {
    this.drugPharmacyFacade.updatedMakePharmaciesPrimary(clientPharmacyId);
  }
  /** Deactivate Pharmacies **/
  OpenDeactivatePharmaciesClicked(clientPharmacyDetails: string) {
    this.selectClientPharmacyDetails = clientPharmacyDetails;
    this.selectClientPharmacyDetails.clientId = this.clientId;
    this.isOpenDeactivatePharmaciesClicked = true;
  }
  handleCloseDeactivatePharmaciesClicked() {
    this.isOpenDeactivatePharmaciesClicked = false;
  }

  /** Reactivate Pharmacies **/
  OpenReactivatePharmaciesClicked(clientPharmacyDetails: any) {
    this.selectClientPharmacyDetails = clientPharmacyDetails;
    this.selectClientPharmacyDetails.clientId = this.clientId;
    this.isOpenReactivatePharmaciesClicked = true;
  }
  handleCloseReactivatePharmaciesClicked() {
    this.isOpenReactivatePharmaciesClicked = false;
  }
  /**  Select New Primary Pharmacies **/
  OpenSelectNewPrimaryPharmaciesClicked(
    clientPharmacyDetails: any,
    type: string
  ) {
    this.selectClientPharmacyDetails = clientPharmacyDetails;
    this.selectClientPharmacyDetails.actionType = type;
    this.isOpenSelectNewPrimaryPharmaciesClicked = true;
  }
  handleCloseSelectNewPrimaryPharmaciesClicked() {
    this.isOpenSelectNewPrimaryPharmaciesClicked = false;
  }
  handleCloseChangePriorityClikced() {
    this.isTriggerPriorityPopup = false;
  }
}
