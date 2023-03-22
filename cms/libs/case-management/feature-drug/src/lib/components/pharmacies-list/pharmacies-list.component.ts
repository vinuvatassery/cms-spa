import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input,ChangeDetectorRef,
  Output, EventEmitter
} from '@angular/core';
import { DrugPharmacyFacade,WorkflowFacade,Pharmacy,StatusFlag,CompletionChecklist,PriorityCode} from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
import { Observable, Subject } from 'rxjs';
import { LoaderService,  LoggingService,  SnackBarNotificationType,} from '@cms/shared/util-core';
@Component({
  selector: 'case-management-pharmacies-list',
  templateUrl: './pharmacies-list.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class PharmaciesListComponent implements OnInit {
  
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
    @Output() addPharmacyClick = new EventEmitter<string>();
    @Output() editPharmacyInit = new EventEmitter<string>();
    @Output() editPharmacyClick = new EventEmitter<{ clientPharmacyId: string, vendorId: string }>();
    @Output() removePharmacyClick = new EventEmitter<string>();
  /** Public properties **/
  pharmaciesTotal:any={};
  priority:string=PriorityCode.Primary
  pharmaciesList$ = this.drugPharmacyFacade.clientPharmacies$
  isOpenChangePriorityClicked = false;
  isOpenPharmacyClicked = false;
  removeDrugPharmacyRsp$ = this.drugPharmacyFacade.removeDrugPharmacyResponse$;
  isEditPharmacyListClicked = false;
  selectedPharmacy!: any;
  /** Public properties **/
  isTriggerPriorityPopup = false;
  isEditPharmacyPriorityTitle = false;
  isShowHistoricalData =  false;
  pharmacyPriorityModalButtonText = 'Save';
  isOpenChangePriorityClicked$ = new Subject();
  isOpenPharmacyClicked$ = new Subject();
  isRemoveClientPharmacyClicked$ = new Subject();
  selectClientPharmacyId!: string;
  selectedPharmacyForEdit!: any;
  removeButtonEmitted = false;
  editButtonEmitted = false;
  public sortValue = this.drugPharmacyFacade.sortValue;
  public sortType = this.drugPharmacyFacade.sortType;
  public pageSizes = this.drugPharmacyFacade.gridPageSizes;
  public gridSkipCount = this.drugPharmacyFacade.skipCount;
  public sort = this.drugPharmacyFacade.sort;
  public state!: State;
  public formUiStyle : UIFormStyle = new UIFormStyle(); 
  // actions: Array<any> = [{ text: 'Action' }];
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  public pharmacyOptions = [
    {
      buttonType:"btn-h-danger",
      text: "Deactivate",
      icon: "block",
      click: (): void => {
      //  this.onDeactivatePhoneNumberClicked()
      },
    },
    {
      buttonType:"btn-h-primary",
      text: "Edit Doc",
      icon: "edit",
      click: (): void => {
      //  this.isOpenDocAttachment = true
      },
    },
   
    {
      buttonType:"btn-h-danger",
      text: "Remove",
      icon: "delete",
      click: (clientPharmacyId: string, vendorId: string): void => {
     
        if (this.removeButtonEmitted === false) {
           this.onRemovePharmacyClicked(clientPharmacyId);
            this.removeButtonEmitted = true;
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
  constructor(private readonly drugPharmacyFacade: DrugPharmacyFacade,
    private readonly workflowFacade: WorkflowFacade,
    private readonly loggingService: LoggingService,
    private readonly cdr: ChangeDetectorRef) {
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
    
  }

  /** Private methods **/
   private updateWorkFlowStatus(isCompleted:boolean)
  {
    const workFlowdata: CompletionChecklist[] = [{
      dataPointName: 'drugPharmacy',
      status: isCompleted ? StatusFlag.Yes :StatusFlag.No
    }];

    this.workflowFacade.updateChecklist(workFlowdata);
  }
  onGetHistoricalPharmaciesData(){
    this.loadPharmacieslist();
  }
  private loadPharmacieslist() {

    this.drugPharmacyFacade.loadDrugPharmacyList(this.clientId,false,this.isShowHistoricalData);
    this.drugPharmacyFacade.clientPharmacies$.subscribe( pharmacies =>{
      if(pharmacies && pharmacies.length > 0){
        this.handleClosePharmacyClicked();
      }
    })
    
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

  onRemovePharmacyClicked(clientPharmacyId: string) {
    this.selectClientPharmacyId = clientPharmacyId;
    this.isRemoveClientPharmacyClicked$.next(true);
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
    this.isOpenPharmacyClicked$.next(false);
    this.isRemoveClientPharmacyClicked$.next(false);
  }
  removePharmacyEvent(clientPharmacyId: string) {
    this.removeButtonEmitted=false;
    this.removePharmacyClick.emit(clientPharmacyId);
  }
  addPharmacyEvent(pharmacyId: string) {
    
    this.addPharmacyClick.emit(pharmacyId);
  }
  removeClientPharmacyOnEditMode(){
    this.handleClosePharmacyClicked()
   this.removePharmacyClick.emit(this.selectClientPharmacyId);
  }
  onSearchPharmacy(searchText: string) {
    this.searchPharmacy.emit(searchText);
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
    this.removeButtonEmitted = false;
    this.isOpenPharmacyClicked$.next(false);
    this.isRemoveClientPharmacyClicked$.next(false);
  }
}
