/** Angular **/
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Output, Input,
  EventEmitter,
  ChangeDetectorRef
} from '@angular/core';
import {
  FormGroup
} from '@angular/forms'
import { ActivatedRoute } from '@angular/router';
/** External libraries **/
import { Subscription } from 'rxjs';
/** Internal libraries **/
import { DrugPharmacyFacade, WorkflowFacade, PharmacyPriority, PriorityCode, } from '@cms/case-management/domain';
import { Lov, LovFacade } from '@cms/system-config/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { SnackBarNotificationType,LoaderService,NotificationSnackbarService, NotificationSource } from '@cms/shared/util-core';


@Component({
  selector: 'case-management-set-pharmacy-priority',
  templateUrl: './set-pharmacy-priority.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetPharmacyPriorityComponent implements OnInit {
  /** Input properties  **/
  @Input() clientpharmacies:any[] = [];
  @Input() pharmacyPriorityModalButtonText: any;
  @Input() clientId: any;
  /** Output properties  **/
  @Output() closeChangePriority = new EventEmitter();


  /** Public properties  **/
  setPriorityForm: FormGroup = new FormGroup({});
  priorities: any[] = [];
  copyLoadPriorties: any[] = [];
  priorityValidation = false;
  savePriorityObjectList: any[] = [];
  ddlPriorities$ = this.drugPharmacyFacade.ddlPriorities$;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  pharmacyPriority$: Lov[] = [];
  sessionId: any = "";
  clientPharmacyId: any;
  clientCaseId: any;
  pharmacyPriorityList: any;
  isDisabled = false;
  priorityInfo = {} as PharmacyPriority;
  btnDisabled = false; 
  showRequiredValidation = false;

  /** Private properties **/
  private loadSessionSubscription!: Subscription;

  /** Constructor **/
  constructor(
    private readonly drugPharmacyFacade: DrugPharmacyFacade,
    private readonly route: ActivatedRoute,
    private readonly loaderService: LoaderService,
    private readonly workflowFacade: WorkflowFacade,
    private readonly notificationSnackbarService: NotificationSnackbarService,
    private  readonly lov: LovFacade,
    private cdr: ChangeDetectorRef
  ) {

  }

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.lov.getPriorityLovs();
    this.loadPriority().then((isloaded) => {
      if (isloaded) {
        this.loadClientPharmacies();
      }
    })
  }

  ngOnDestroy(): void {
    this.loadSessionSubscription?.unsubscribe();
  }

  /** Private methods **/
  private loadPriority() {
    return new Promise((resolve, reject) => {
      this.lov.pharmacyPrioritylov$.subscribe((priorityLov: Lov[]) => {
        this.priorities = priorityLov;
        if (priorityLov.length > 0) {
          resolve(true);
        }
      })
    });
  }


  public onChangePriority(value: any, index: any): void {
    this.priorityValidation = false;
    this.showRequiredValidation = false;
    const changedItem = this.savePriorityObjectList[index];
    let existItemIndex = this.savePriorityObjectList?.findIndex(i=>i.priorityCode === value && i.clientPharmacyId !== changedItem?.clientPharmacyId);
    if(existItemIndex !== -1 && this.savePriorityObjectList[existItemIndex]){
      this.notificationSnackbarService.manageSnackBar(SnackBarNotificationType.ERROR,'Priorities cannot be duplicated.', NotificationSource.UI)
      this.savePriorityObjectList[existItemIndex].priorityCode = null;
    }

    this.savePriorityObjectList[index].priorityCode = value;
    this.copyLoadPriorties = this.priorities.filter(m => m.lovCode != value);
    this.copyLoadPriorties = this.priorities;
    if (this.savePriorityObjectList.length == 1) {
      this.copyLoadPriorties = this.priorities.filter((x: any) => x.lovCode === PriorityCode.Primary);

    }
    else if (this.savePriorityObjectList.length == 2) {
      this.copyLoadPriorties = this.priorities.filter((x: any) => x.lovCode === PriorityCode.Primary || x.lovCode === PriorityCode.Secondary);
    }
    else {
      this.copyLoadPriorties = this.priorities.filter((x: any) => x.lovCode === PriorityCode.Primary || x.lovCode === PriorityCode.Secondary || x.lovCode === PriorityCode.Tertiary);
    }
  }

  private loadClientPharmacies(){
      this.savePriorityObjectList =JSON.parse(JSON.stringify(this.clientpharmacies));
      this.cdr.detectChanges();
      for(let priority of this.savePriorityObjectList){
          priority.priorityCode = priority.priorityCode?.replace(/\s/g, '');
      }
      this.copyLoadPriorties= this.priorities;
      if( this.savePriorityObjectList.length == 1)
      {
        this.copyLoadPriorties = this.priorities.filter((x:any) =>x.lovCode === PriorityCode.Primary  );
        
      }
      else if (this.savePriorityObjectList.length == 2) {
        this.copyLoadPriorties = this.priorities.filter((x: any) => x.lovCode === PriorityCode.Primary || x.lovCode === PriorityCode.Secondary);
      }
      else {
        this.copyLoadPriorties = this.priorities.filter((x: any) => x.lovCode === PriorityCode.Primary || x.lovCode === PriorityCode.Secondary || x.lovCode === PriorityCode.Tertiary);
      }
  }
  // /** Internal event methods **/
  onCloseChangePriorityClicked() {

    this.closeChangePriority.emit();
  }

  onSavePriority()
  {
     const isValid = this.savePriorityObjectList?.findIndex(i=>i.priorityCode === '' || i.priorityCode === null || i.priorityCode === undefined) === -1;
  if(!isValid){
      this.showRequiredValidation = true;
      return; 
  }
    if(!this.priorityValidation)
    {
      this.loaderService.show();
      this.btnDisabled =true;
      this.drugPharmacyFacade.updatePharmacyPriority(this.savePriorityObjectList)
      .subscribe({
        next: (x:any) =>{
          if(x){
            this.loaderService.hide();
            this.drugPharmacyFacade.loadClientPharmacyList(this.clientId);
            this.drugPharmacyFacade.showHideSnackBar(SnackBarNotificationType.SUCCESS, 'Pharmacy Priorities updated successfully');
            this.onCloseChangePriorityClicked();
          }
        },
        error: (error:any) =>{
          this.btnDisabled = false;
          this.drugPharmacyFacade.showHideSnackBar(SnackBarNotificationType.ERROR , error)
        }
      });
    }
    else
    {
      this.notificationSnackbarService.manageSnackBar(SnackBarNotificationType.ERROR,'Priorities can not be duplicated.');
    }
  }
}
