/** Angular **/
import { Component, ChangeDetectionStrategy, Output, EventEmitter, OnInit, Input } from '@angular/core';
/** External libraries **/
import { DialItemAnimation } from '@progress/kendo-angular-buttons';
import { ClientEligibilityFacade, CaseFacade } from '@cms/case-management/domain';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'case-management-case360-header',
  templateUrl: './case360-header.component.html',
  styleUrls: ['./case360-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Case360HeaderComponent implements OnInit {
  /** Public properties **/
  @Input() loadedClientHeader : any
  @Input() caseWorkerId : any
  @Input() clientProfileImpInfo$ : any
  @Input() clientCaseEligibilityId : any
  @Input() clientId : any
  @Input() clientCaseId : any
  @Output() loadClientProfileInfoEvent =  new EventEmitter();
  @Output() loadClientImpInfoEvent =  new EventEmitter();
  @Input() currentGroup$!: Observable<any>;
  @Input() ddlGroups$!: Observable<any>;
  @Input() groupUpdated$!: Observable<any>;
  @Output() loadChangeGroupEvent = new EventEmitter<string>();
  @Output() updateChangeGroupEvent = new EventEmitter<any>();
  @Output() createCerSessionEvent = new EventEmitter<string>();
 
  isAnimationOptionsOpened: boolean | DialItemAnimation = false;
  isStatusPeriodDetailOpened = false;
  isGroupDetailOpened$ = new BehaviorSubject<boolean>(false);
  isEditEligibilityFlag!:boolean;
  groupChangeTitle !: string;

  constructor(
    private readonly clientEligibilityFacade: ClientEligibilityFacade,
    private readonly caseFacade: CaseFacade) {
  }

     /** Lifecycle hooks **/
 ngOnInit(): void {
  this.loadClientProfileInfoEvent.emit()  
  this.clientEligibilityFacade.eligibilityPeriodPopupOpen$.subscribe(response=>{
    this.isStatusPeriodDetailOpened = response;
  });
  this.addGroupUpdatedSubscription();   
}

/** Internal event methods **/
  onStatusPeriodDetailClosed() {
    this.isStatusPeriodDetailOpened = false;
  }

  onStatusPeriodDetailClicked() {
    this.isEditEligibilityFlag=false;
    this.isStatusPeriodDetailOpened = true;
  }

  onStatusPeriodEditClicked() {
    this.isEditEligibilityFlag=true;
    this.isStatusPeriodDetailOpened = true;
  }

  onGroupDetailClicked(eligibilityId: string) {
    if (eligibilityId) {
      this.loadChangeGroupEvent.emit(eligibilityId);
    }

    this.isGroupDetailOpened$.next(true);
  }

  loadClientImpInfo() {
    this.loadClientImpInfoEvent.emit()
  }

  onGroupChangeUpdateClicked(group: any) {
    group = {
      eligibilityId: this.loadedClientHeader.clientCaseEligibilityId,
      groupCodeId: group.groupCodeId,
      groupStartDate: group.groupStartDate
    };
    this.updateChangeGroupEvent.emit(group);
  }

  onGroupChangeCancelClicked() {
    this.isGroupDetailOpened$.next(false);
    this.groupChangeTitle ='';    
  }

  addGroupUpdatedSubscription() {
    this.groupUpdated$.subscribe((value: boolean) => {    
      if(value){
      this.isGroupDetailOpened$.next(false);
        this.loadClientProfileInfoEvent.emit();
        this.groupChangeTitle ='';
      }  
    })
  }

  checkIfSCheduledGroup(isScheduled:boolean){
    this.groupChangeTitle =  isScheduled ? 'Edit Scheduled Group Change':'Change Group';
  }

  onModalSaveAndClose(result:any){
    if(result){
      this.isStatusPeriodDetailOpened=false;
      this.loadClientProfileInfoEvent.emit() 
    }
  }

  createCerSession()
  {
    //2169 iii.	If the Eligibility has been disenrolled for the CER the link will disable
    if(this.loadedClientHeader?.caseStatus!=='DISENROLLED')
    {
    this.createCerSessionEvent.emit()
    }
  }

  

}
