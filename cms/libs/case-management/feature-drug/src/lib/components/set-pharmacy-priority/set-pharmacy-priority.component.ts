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
import { Lov, LovFacade } from '@cms/system-config/domain';
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
savePrirorityObjectList:any[] =[];
  /** Public properties  **/
  ddlPriorities$ = this.drugPharmacyFacade.ddlPriorities$;
  public formUiStyle : UIFormStyle = new UIFormStyle();
  pharmacyPriority$: Lov[] = [];
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
    private lov: LovFacade,
     private loggingService:LoggingService) {
    
    }

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadSessionData();
    this.loadclientpharmacies();
    this.lov.getPriorityLovs();
    this.loadPriorities();
    this.addSaveSubscription();
    this.pharmacyPriorityFormChanged();
  }
  ngOnDestroy(): void {
    this.loadSessionSubscription.unsubscribe();
  }
  /** Private methods **/
  private loadPriorities() {
    this.lov.pharmacyPrioritylov$.subscribe((priorityLov: Lov[]) => {
      this.copyLoadPrioritites = priorityLov;
      this.loadPrioritites = priorityLov;
    });
  }
 

  public onChangePrirority(value: any,index:any): void {
   this.savePrirorityObjectList[index].priorityCode = value;
     this.copyLoadPrioritites=this.loadPrioritites.filter(m=>m.lovCode!=value);
 
  }
  loadSessionData() {
    this.sessionId = this.route.snapshot.queryParams['sid'];
    this.workflowFacade.loadWorkFlowSessionData(this.sessionId)
    this.loadSessionSubscription = this.workflowFacade.sessionDataSubject$.pipe(first(sessionData => sessionData.sessionData != null))
      .subscribe((session: any) => {
        if (session !== null && session !== undefined && session.sessionData !== undefined) {
          this.clientCaseId = JSON.parse(session.sessionData).ClientCaseId;
          this.clientId = JSON.parse(session.sessionData).clientId;
          this.clientCaseEligibilityId = JSON.parse(session.sessionData).clientCaseEligibilityId;
         // this.loadPharmacyPriority();
        }
      });

  }
  private loadclientpharmacies(){
    this.clientpharmacies$.subscribe(list =>{
      this.savePrirorityObjectList = list;
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
    let isValid = true;
    if (isValid) {
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

  // /** Internal event methods **/
  onCloseChangePriorityClicked() {
    this.closeChangePriority.emit();
  }
  onSavePriority()
  {
    this.loaderService.show();
    this.drugPharmacyFacade.updatePharmacyPriority(this.savePrirorityObjectList).subscribe((x:any) =>{
      if(x){
        this.loaderService.hide();
        this.drugPharmacyFacade.ShowHideSnackBar(SnackBarNotificationType.SUCCESS, 'Pharmacy Priorities saved sucessfully')
        this.onCloseChangePriorityClicked();
      }
    },(error:any) =>{
      this.loggingService.logException({name:SnackBarNotificationType.ERROR,message:error?.error?.error});
    });

  }
}
