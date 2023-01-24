/** Angular **/
import {
 Component,
  OnInit,
  ChangeDetectionStrategy,
  Output, Input,
  EventEmitter,
} from '@angular/core';
import { 
  FormGroup} from '@angular/forms'
import { Lov, LovFacade } from '@cms/system-config/domain';
import { ActivatedRoute } from '@angular/router';
import { SnackBarNotificationType,LoaderService } from '@cms/shared/util-core';

/** External libraries **/
import { first, Subscription, Observable } from 'rxjs';
/** Facades **/
import { DrugPharmacyFacade, WorkflowFacade,PharmacyPriority} from '@cms/case-management/domain';
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


  /** Public properties  **/
  setPriorityForm: FormGroup = new FormGroup({}) ;
  // pharmacyPriority: PharmacyPriority={
  //   clientPharmacyId: '',
  //   clientId: 0,
  //   priorityCode: '',
  // };
   priorities:any[]=[];
   copyLoadPriorties:any[]=[];
  
  //  savePrirorityObject = {
  //   clientPharmacyId: "",
  //   clientId: 0,
  //   priorityCode: ""
  // }

  savePriorityObjectList:any[] =[];
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

  /** Constructor **/
  constructor(
     private readonly drugPharmacyFacade: DrugPharmacyFacade,
    private readonly route: ActivatedRoute,
    private readonly loaderService: LoaderService,
    private readonly workflowFacade: WorkflowFacade,
    private  readonly lov: LovFacade,
    ) {
    
    }

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadSessionData();
    this.loadClientPharmacies();
    this.lov.getPriorityLovs();
    this.loadPriority();
  }

  ngOnDestroy(): void {
    this.loadSessionSubscription.unsubscribe();
  }

  /** Private methods **/
  private loadPriority() {
    this.lov.pharmacyPrioritylov$.subscribe((priorityLov: Lov[]) => {
      this.copyLoadPriorties = priorityLov;
      this.priorities = priorityLov;
    });
  }
 

  public onChangePriority(value: any,index:any): void {
   this.savePriorityObjectList[index].priorityCode = value;
     this.copyLoadPriorties=this.priorities.filter(m=>m.lovCode!=value);
 
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
        }
      });

  }
  private loadClientPharmacies(){
    this.clientpharmacies$.subscribe(list =>{
      this.savePriorityObjectList = list;
    })
  }  

  // /** Internal event methods **/
  onCloseChangePriorityClicked() {
    this.closeChangePriority.emit();
  }

  onSavePriority()
  {
    this.loaderService.show();
    this.drugPharmacyFacade.updatePharmacyPriority(this.savePriorityObjectList).subscribe((x:any) =>{
      if(x){
        this.loaderService.hide();
        this.drugPharmacyFacade.loadClientPharmacyList(this.clientId);
        this.drugPharmacyFacade.showHideSnackBar(SnackBarNotificationType.SUCCESS, 'Pharmacy Priorities updated successfully');
        this.onCloseChangePriorityClicked();
      }
    },(error:any) =>{
      this.drugPharmacyFacade.showHideSnackBar(SnackBarNotificationType.ERROR , error)
    });
  }
}
