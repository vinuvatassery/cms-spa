/** Angular **/
import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
/** External libraries **/
import { forkJoin, mergeMap, of, Subscription, first } from 'rxjs';
/** Internal Libraries **/
import { VerificationFacade, NavigationType, WorkflowFacade } from '@cms/case-management/domain';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SnackBarNotificationType} from '@cms/shared/util-core';


@Component({
  selector: 'case-management-verification-page',
  templateUrl: './verification-page.component.html',
  styleUrls: ['./verification-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerificationPageComponent implements OnInit, OnDestroy, AfterViewInit {

  hivVerificationForm!:FormGroup;
  sessionId!: string;
  clientCaseId!: string;
  clientId!: number;  
  userId!:any;
  private loadSessionSubscription!: Subscription;
  /** Private properties **/
  private saveClickSubscription !: Subscription;

  /** Constructor **/
  constructor(private workflowFacade: WorkflowFacade,
    private verificationFacade: VerificationFacade,private formBuilder: FormBuilder,
    private readonly cdr: ChangeDetectorRef,private workFlowFacade: WorkflowFacade,
    private route: ActivatedRoute) { }

  /** Lifecycle Hooks **/
  ngOnInit(): void {
    this.buildForm();
    this.addSaveSubscription();
    this.loadSessionData();
    this.verificationFacade.hivVerificationSave$.subscribe(data=>{
      this.load();
    });
  }

  ngOnDestroy(): void {
    this.saveClickSubscription.unsubscribe();
    this.loadSessionSubscription.unsubscribe();
  }

  ngAfterViewInit(){
    this.workflowFacade.enableSaveButton();
  } 

  /** Private Methods **/
  private buildForm() {
    this.hivVerificationForm = this.formBuilder.group({
      providerEmailAddress: [''],
      providerOption:[''],
      verificationStatusDate:[''],
      requestedUserName:[''],
      userId:['']
    });

  }
  private addSaveSubscription(): void {
    this.saveClickSubscription = this.workflowFacade.saveAndContinueClicked$.pipe(      
      mergeMap((navigationType: NavigationType) =>
        forkJoin([of(navigationType), this.save()])
      ),
    ).subscribe(([navigationType, isSaved]) => {
      if (isSaved) {
        this.verificationFacade.showHideSnackBar(SnackBarNotificationType.SUCCESS,'Verification Status Updated');
        this.workflowFacade.navigate(navigationType);
      } else {
        this.workflowFacade.enableSaveButton();
      }
    });
  }

  private loadSessionData() {
    this.sessionId = this.route.snapshot.queryParams['sid'];
    this.workflowFacade.loadWorkFlowSessionData(this.sessionId)
    this.loadSessionSubscription = this.workflowFacade.sessionDataSubject$.pipe(first(sessionData => sessionData.sessionData != null))
      .subscribe((session: any) => {
        if (session && session?.sessionData) {
          this.clientCaseId = JSON.parse(session.sessionData)?.ClientCaseId
          this.clientId = JSON.parse(session.sessionData)?.clientId ?? this.clientId;
          this.load();
        }

      });
  }

  private load(){
    this.verificationFacade.showLoader();
    this.verificationFacade.getHivVerification( this.clientId).subscribe({
      next:(data)=>{
        if(data !== null){
          if(data?.hivVerification !== null){
            this.hivVerificationForm.controls["providerEmailAddress"].setValue(data.hivVerification["verificationToEmail"]);
            this.hivVerificationForm.controls["providerOption"].setValue(data.hivVerification["verificationMethodCode"]);
            this.hivVerificationForm.controls["verificationStatusDate"].setValue(data.hivVerification["verificationStatusDate"]);
            this.hivVerificationForm.controls["requestedUserName"].setValue(data["requestedUserName"]);
            this.hivVerificationForm.controls["userId"].setValue(data.hivVerification["creatorId"]);
            this.verificationFacade.providerValueChange(this.hivVerificationForm.controls["providerOption"].value);              
          }      
        }
        this.verificationFacade.hideLoader();
      },
      error:(error)=>{
        if (error) {
          this.verificationFacade.showHideSnackBar(
            SnackBarNotificationType.ERROR,
            error
          );
          this.verificationFacade.hideLoader();
        }
      }
    });
  }
  private save() {
    this.validateForm();
    this.cdr.detectChanges();
    if (this.hivVerificationForm.valid) {
      return of(true);
    }
    
    return of(false)
  }
  private validateForm(){
    this.hivVerificationForm.markAllAsTouched();
    this.hivVerificationForm.controls["providerOption"].setValidators([Validators.required])
    this.hivVerificationForm.controls["providerOption"].updateValueAndValidity();
    this.hivVerificationForm.updateValueAndValidity();
  }
}
