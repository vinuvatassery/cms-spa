/** Angular **/
import {
 Component,
  OnInit,
  ChangeDetectionStrategy,
  Output, Input,
  EventEmitter,
} from '@angular/core';
import {
  FormGroup,
  FormControl
} from '@angular/forms'
/** Enums **/
import {  ClientPharmacy, NavigationType } from '@cms/case-management/domain';
import { ActivatedRoute } from '@angular/router';
import { SnackBarNotificationType,LoggingService,LoaderService } from '@cms/shared/util-core';

/** External libraries **/
import { debounceTime, distinctUntilChanged, pairwise, startWith,first, forkJoin, mergeMap, of, Subscription, Observable } from 'rxjs';
/** Facades **/
import { DrugPharmacyFacade, WorkflowFacade,StatusFlag,CompletionChecklist, PharmacyPriority} from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa'; 
@Component({
  selector: 'case-management-set-pharmacy-priority',
  templateUrl: './set-pharmacy-priority.component.html',
  styleUrls: ['./set-pharmacy-priority.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetPharmacyPriorityComponent implements OnInit {
  /** Input properties  **/
  @Input() clientpharmacies$!: Observable<any>;
  /** Output properties  **/
  @Output() closeChangePriority = new EventEmitter();
  priority1:any;
  priority2:any;
  public setPrioirityForm: FormGroup = new FormGroup({}) ;
pharmcayPriority: PharmacyPriority={
  clientPharmacyId: '',
  clientId: 0,
  priorityCode: '',
};
loadPrioritites:any[]=[];
copyLoadPrioritites:any[]=[];

 savePrirorityObject = {
  clientPharmacyId: "",
  clientId: 0,
  priorityCode: ""
}
public itemDisabled(itemArgs: { dataItem: any; index: number }) {
  return itemArgs.dataItem.value === this.setPrioirityForm.controls['priority1']?.value // disable the 3rd item
}
savePrirorityObjectList:any[] =[];
  /** Public properties  **/
  ddlPriorities$ = this.drugPharmacyFacade.ddlPriorities$;
  public formUiStyle : UIFormStyle = new UIFormStyle();
  sessionId: any = "";
  clientId: any;
  clientPharmacyId:any;
  clientCaseId: any;
  pharmacyPriorityList: any;
  clientCaseEligibilityId: string = "";
  isDisabled = false;
  priorityInfo = {} as PharmacyPriority;
   /** Private properties **/
   private loadSessionSubscription!: Subscription;
   private saveClickSubscription !: Subscription;
  /** Constructor **/
  constructor(
     private readonly drugPharmacyFacade: DrugPharmacyFacade,
    private route: ActivatedRoute,
    private loaderService: LoaderService,
    private workflowFacade: WorkflowFacade,
     private loggingService:LoggingService) {
      this.ddlPriorities$.subscribe(ddlist =>{
        this.loadPrioritites = ddlist;
        this.copyLoadPrioritites = ddlist;
      })
    }

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.buildForm();
    this.loadSessionData();
    this.loadclientpharmacies();
    this.loadPriorities();
    this.addSaveSubscription();
    this.pharmacyPriorityFormChanged();
  }
  ngOnDestroy(): void {
    this.loadSessionSubscription.unsubscribe();
  }
  /** Private methods **/
  private loadPriorities() {
    this.drugPharmacyFacade.loadDdlPriorities();
  }
 
  public valueChange(value: any,index:any): void {
   this.savePrirorityObjectList[index].priorityCode = value;
     this.copyLoadPrioritites=this.loadPrioritites.filter(m=>m.value!==value);
 
  }
  private loadClientPharmacies() {
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

  private buildForm() {
    this.setPrioirityForm = new FormGroup({
      priority1: new FormControl('', []),
      priority2: new FormControl('', [])
  });
  }
  pharmacyPriority: any={};
  loadSessionData() {
    debugger;
    this.sessionId = this.route.snapshot.queryParams['sid'];
    this.workflowFacade.loadWorkFlowSessionData(this.sessionId)
    this.loadSessionSubscription = this.workflowFacade.sessionDataSubject$.pipe(first(sessionData => sessionData.sessionData != null))
      .subscribe((session: any) => {
        debugger;
        if (session !== null && session !== undefined && session.sessionData !== undefined) {
          this.clientCaseId = JSON.parse(session.sessionData).ClientCaseId;
          this.clientId = JSON.parse(session.sessionData).clientId;
          this.clientCaseEligibilityId = JSON.parse(session.sessionData).clientCaseEligibilityId;
          //this.clientId = 1000;
          this.loadPharmacyPriority();
        }
      });

  }
  private loadclientpharmacies(){
    this.clientpharmacies$.subscribe(list =>{
      this.savePrirorityObjectList = list;
      // this.savePrirorityObjectList.forEach(x =>{
      //   x.defaultItem="";
      // })

    })
  }
  private addSaveSubscription(): void {
    this.saveClickSubscription = this.workflowFacade.saveAndContinueClicked$.pipe(
      mergeMap((navigationType: NavigationType) =>
        forkJoin([of(navigationType), this.save()])
      ),
    ).subscribe(([navigationType, isSaved]) => {
      if (isSaved) {
        this.loaderService.hide();
        this.drugPharmacyFacade.ShowHideSnackBar(SnackBarNotificationType.SUCCESS, 'Pharmacy Priorities saved sucessfully')
        this.workflowFacade.navigate(navigationType);
      }
    });
  }
  private save() {
    debugger;
    let isValid = true;
    if (isValid) {
      this.priorityInfo.clientId = 0;
      this.priorityInfo.priorityCode= this.setPrioirityForm.controls["priority1"].value;
      this.priorityInfo.priorityCode= this.setPrioirityForm.controls["priority2"].value;
      return this.drugPharmacyFacade.updatePharmacyPriority(this.savePrirorityObjectList);
     
    }

    return of(false)
  }
  private pharmacyPriorityFormChanged() {
    this.setPrioirityForm.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        startWith(null),
        pairwise()
      )
      .subscribe(([prev, curr]: [any, any]) => {
        this.updateFormCompleteCount(prev, curr);
      });
  }
  private updateFormCompleteCount(prev: any, curr: any) {
    let completedDataPoints: CompletionChecklist[] = [];
    Object.keys(this.setPrioirityForm.controls).forEach(key => {
      if (prev && curr) {
        if (prev[key] !== curr[key]) {
          let item: CompletionChecklist = {
            dataPointName: key,
            status: curr[key] ? StatusFlag.Yes : StatusFlag.No
          };
          completedDataPoints.push(item);
        }
      }
      else {
        if (this.setPrioirityForm?.get(key)?.value && this.setPrioirityForm?.get(key)?.valid) {
          let item: CompletionChecklist = {
            dataPointName: key,
            status: StatusFlag.Yes
          };

          completedDataPoints.push(item);
        }
      }
    });

    if (completedDataPoints.length > 0) {
      this.workflowFacade.updateChecklist(completedDataPoints);
    }
  }
  private loadPharmacyPriority(): void {
     this.isDisabled = false;
    this.drugPharmacyFacade.loadPharmacyPriority( this.clientId).subscribe({
      next: (response:any) => {
        this.pharmacyPriorityList = response;
      },
      error: (error: any) => {
        this.loggingService.logException({name:SnackBarNotificationType.ERROR,message:error?.error?.error});
      }
    })
  }
  // /** Internal event methods **/
  onCloseChangePriorityClicked() {
    this.closeChangePriority.emit();
  }
  onSavePriority()
  {
    this.drugPharmacyFacade.updatePharmacyPriority(this.savePrirorityObjectList).subscribe((x:any) =>{
      console.log(x);
      if(x){
        this.onCloseChangePriorityClicked();
      }
    },(error:any) =>{
      this.loggingService.logException({name:SnackBarNotificationType.ERROR,message:error?.error?.error});
    });

  }
}
