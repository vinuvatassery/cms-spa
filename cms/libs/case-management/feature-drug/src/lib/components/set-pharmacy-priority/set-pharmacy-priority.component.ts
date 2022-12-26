/** Angular **/
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
} from '@angular/core';
import {
  FormGroup,
  FormControl
} from '@angular/forms'
/** Enums **/
import {  NavigationType } from '@cms/case-management/domain';
import { ActivatedRoute } from '@angular/router';
import { SnackBarNotificationType,LoggingService,LoaderService } from '@cms/shared/util-core';

/** External libraries **/
import { debounceTime, distinctUntilChanged, pairwise, startWith,first, forkJoin, mergeMap, of, Subscription } from 'rxjs';
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
  /** Output properties  **/
  @Output() closeChangePriority = new EventEmitter();
  priority1:any;
  priority2:any;
  priority3:any;
  public setPrioirityForm: FormGroup = new FormGroup({}) ;
pharmcayPriority: PharmacyPriority={
  clientPharmacyId: '',
  clientId: 0,
  priorityCode: '',
};
loadPrioritites:any[]=[];
 savePrirorityObject = {
  clientPharmacyId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  clientId: 0,
  priorityCode: ""
}
savePrirorityObjectList:any[] =[];
  /** Public properties **/
  ddlPriorities$ = this.drugPharmacyFacade.ddlPriorities$;
  public formUiStyle : UIFormStyle = new UIFormStyle();
  sessionId: any = "";
  clientId: any;
  clientPharmacyId:any;
  clientCaseId: any;
  clientCaseEligibilityId: string = "";
  isDisabled = false;
  priorityInfo = {} as PharmacyPriority;
   /** Private properties **/
   private loadSessionSubscription!: Subscription;
   private saveClickSubscription !: Subscription;
  /** Constructor **/
  constructor(private readonly drugPharmacyFacade: DrugPharmacyFacade,
    private route: ActivatedRoute,
    private loaderService: LoaderService,
    private workflowFacade: WorkflowFacade) {
      this.ddlPriorities$.subscribe(ddlist =>{
        this.loadPrioritites = ddlist;
      })
    }

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.buildForm();
    this.loadSessionData();
    this.loadPriorities();
    this.addSaveSubscription();
    this.pharmacyPriorityFormChanged();
  }
  ngOnDestroy(): void {
   // this.saveClickSubscription.unsubscribe();
    this.loadSessionSubscription.unsubscribe();
  }


  /** Private methods **/
  private loadPriorities() {
    this.drugPharmacyFacade.loadDdlPriorities();
  }
  public valueChange(value: any,type:any): void {
    debugger;
    if(type === 1){
  const pharmacyPriority1:any = {}
   //this.pharmacyPriority.priorityCode = this.priority1?.value;
   //pharmacyPriority1.priorityCode = value.value;
    pharmacyPriority1.clientId = this.clientId
    pharmacyPriority1.priorityCode = this.setPrioirityForm.controls['priority1']?.value;
    pharmacyPriority1.clientPharmacyId = "89397EE3-0717-4457-A8C1-39881B77B241";
    //pharmacyPriority1.priorityCode = this.setPrioirityForm.controls['priority1'].value;
    if(this.savePrirorityObjectList && this.savePrirorityObjectList.length > 0){
      const index = this.savePrirorityObjectList.findIndex(x=>x.priorityCode == 'P');
      if(index >= 0){
        this.savePrirorityObjectList.splice(index,0,pharmacyPriority1);
      }
    }else{
      this.savePrirorityObjectList.push(pharmacyPriority1);
    }
    
    }else if(type == 2){
      const pharmacyPriority2:any ={};
     //pharmacyPriority2.priorityCode = value.value;
      //this.pharmacyPriority.priorityCode = this.priority1?.value;
      pharmacyPriority2.priorityCode = this.setPrioirityForm.controls['priority2']?.value;
    pharmacyPriority2.clientId = this.clientId
    pharmacyPriority2.clientPharmacyId = "6952473A-080C-443B-A69E-D0FDA3CA5AB6";
    //pharmacyPriority2.priorityCode = this.setPrioirityForm.controls['priority2'].value;
    if(this.savePrirorityObjectList && this.savePrirorityObjectList.length > 0){
      const index = this.savePrirorityObjectList.findIndex(x=>x.priorityCode == 'S');
      if(index >= 0){
        this.savePrirorityObjectList.splice(index,0,pharmacyPriority2);
      }else {
        this.savePrirorityObjectList.push(pharmacyPriority2);
      }
    }
    }
    console.log("valueChange", value);
  }
  private buildForm() {
    this.setPrioirityForm = new FormGroup({
      priority1: new FormControl('', []),
      priority2: new FormControl('', []),
      priority3: new FormControl('', [])
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
          this.clientCaseEligibilityId = JSON.parse(session.sessionData).clientCaseEligibilityId;
          this.clientId = 1000;
          this.clientPharmacyId= '976a2c48-0ebf-4c77-b9c3-03355103d663'
          //JSON.parse(session.sessionData).clientId;
          this.loadPharmacyPriority();
        }
      });

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
    // TODO: validate the form
    if (isValid) {
      
      this.priorityInfo.clientId = 0;
     // this.priorityInfo.clienPharmacyId = '';
      this.priorityInfo.priorityCode= this.setPrioirityForm.controls["priority1"].value;
      this.priorityInfo.priorityCode= this.setPrioirityForm.controls["priority2"].value;
      return this.drugPharmacyFacade.updatePharmacyPriority(this.priorityInfo);
      
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
    debugger;
     this.isDisabled = false;
    this.drugPharmacyFacade.loadPharmacyPriority( this.clientId).subscribe({
      next: (response:any) => {
        debugger;
        if(response!==null){
         this.setPrioirityForm.controls["prioirity1"].setValue(response.priorityCode);
          this.setPrioirityForm.controls["prioirity2"].setValue(response.priorityCode);
          //this.prioirity1 = {text:'Primary',value:response[0]?.priorityCode};
          
        }
      },
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
      this.addSaveSubscription();
      if(x){
        this.onCloseChangePriorityClicked();
      }
    },(error:any) =>{
          console.log(error);
    });

  }
}
