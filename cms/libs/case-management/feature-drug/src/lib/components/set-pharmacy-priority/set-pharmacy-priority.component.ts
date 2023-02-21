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
  FormGroup} from '@angular/forms'
import { Lov, LovFacade } from '@cms/system-config/domain';
import { ActivatedRoute } from '@angular/router';
import { SnackBarNotificationType,LoaderService } from '@cms/shared/util-core';

/** External libraries **/
import { first, Subscription, Observable } from 'rxjs';
/** Facades **/
import { DrugPharmacyFacade, WorkflowFacade,PharmacyPriority, PriorityCode} from '@cms/case-management/domain';
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
  @Input() pharmacyPriorityModalButtonText: any;
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
   priorityValidation=false;
  
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
  btnDisabled = false; 

   /** Private properties **/
   private loadSessionSubscription!: Subscription;

  /** Constructor **/
  constructor(
     private readonly drugPharmacyFacade: DrugPharmacyFacade,
    private readonly route: ActivatedRoute,
    private readonly loaderService: LoaderService,
    private readonly workflowFacade: WorkflowFacade,
    private  readonly lov: LovFacade,
    private cdr: ChangeDetectorRef
    ) {
    
    }

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadSessionData();
    this.lov.getPriorityLovs();
    this.loadPriority().then((isloaded) =>{
      if(isloaded){
        this.loadClientPharmacies();
      }
    })
   // this.priority();
    
   
  }

  ngOnDestroy(): void {
    this.loadSessionSubscription.unsubscribe();
  }

  /** Private methods **/
  private loadPriority() {
    return new Promise((resolve,reject) =>{
      this.lov.pharmacyPrioritylov$.subscribe((priorityLov: Lov[]) => {
      
        this.priorities = priorityLov;
        this.cdr.detectChanges();
        if(priorityLov.length > 0){
          resolve(true);
        }
      })
    })
  ;
  }
 

  public onChangePriority(value: any,index :any): void {
    this.priorityValidation = false;
    this.savePriorityObjectList[index].priorityCode = value;
    this.copyLoadPriorties=this.priorities.filter(m=>m.lovCode!=value);
    this.copyLoadPriorties= this.priorities;
    if( this.savePriorityObjectList.length == 1)
    {
      this.copyLoadPriorties = this.priorities.filter((x:any) =>x.lovCode === PriorityCode.Primary  );
      
    }
    else if( this.savePriorityObjectList.length == 2)
    {
      this.copyLoadPriorties = this.priorities.filter((x:any)=>x.lovCode === PriorityCode.Primary ||x.lovCode === PriorityCode.Secondary);
    }
    else{
      this.copyLoadPriorties = this.priorities.filter((x:any)=>x.lovCode === PriorityCode.Primary ||x.lovCode === PriorityCode.Secondary ||x.lovCode === PriorityCode.Tertiary);
    }
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
          this.loadPriority();
        }
      });

  }
  private loadClientPharmacies(){
   
    this.clientpharmacies$.subscribe(list =>{
      this.savePriorityObjectList =JSON.parse(JSON.stringify(list));
      this.copyLoadPriorties= this.priorities;
      if( this.savePriorityObjectList.length == 1)
      {
        this.copyLoadPriorties = this.priorities.filter((x:any) =>x.lovCode === PriorityCode.Primary  );
        
      }
      else if( this.savePriorityObjectList.length == 2)
      {
        this.copyLoadPriorties = this.priorities.filter((x:any)=>x.lovCode === PriorityCode.Primary ||x.lovCode === PriorityCode.Secondary);
      }
      else{
        this.copyLoadPriorties = this.priorities.filter((x:any)=>x.lovCode === PriorityCode.Primary ||x.lovCode === PriorityCode.Secondary ||x.lovCode === PriorityCode.Tertiary);
      }
   
      
    })
  }
  // /** Internal event methods **/
  onCloseChangePriorityClicked() {

    this.closeChangePriority.emit();
  }

  onSavePriority()
  {
    this.priorityValidation = false;
    let primaryCodeDuplicate:number =0;
    let secondryCodeDuplicate:number =0;
    let tertiaryCodeDuplicate:number =0;
    for (let i = 0; i < this.savePriorityObjectList.length; i++) {
      const element= this.savePriorityObjectList[i];
      if(element.priorityCode === PriorityCode.Primary){
        primaryCodeDuplicate++;
      }
      if(element.priorityCode === PriorityCode.Secondary){
        secondryCodeDuplicate++;
      }
      if(element.priorityCode === PriorityCode.Tertiary){
        tertiaryCodeDuplicate++;
      }
    }
    if(primaryCodeDuplicate > 1 || secondryCodeDuplicate > 1 || tertiaryCodeDuplicate>1){
      this.priorityValidation = true;
      return;
    }
    this.loaderService.show();
    this.btnDisabled =true;
    this.drugPharmacyFacade.updatePharmacyPriority(this.savePriorityObjectList).subscribe((x:any) =>{
      if(x){
        this.loaderService.hide();
        this.drugPharmacyFacade.loadClientPharmacyList(this.clientId);
        this.drugPharmacyFacade.showHideSnackBar(SnackBarNotificationType.SUCCESS, 'Pharmacy Priorities updated successfully');
        this.onCloseChangePriorityClicked();
      }
    },(error:any) =>{
      this.btnDisabled = false;
      this.drugPharmacyFacade.showHideSnackBar(SnackBarNotificationType.ERROR , error)
    });
  }
}
