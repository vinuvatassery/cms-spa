/** Angular **/
import {
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  Component,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { forkJoin, mergeMap, of, Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  LoaderService,
  LoggingService,
  NotificationSnackbarService,
  SnackBarNotificationType,
} from '@cms/shared/util-core';
import { ActivatedRoute } from '@angular/router';
import { NavigationType } from '@cms/case-management/domain';
import {
  WorkflowFacade,
  EligibilityChecklistAnswerFacade,
} from '@cms/case-management/domain';

@Component({
  selector: 'case-management-client-eligibility-page',
  templateUrl: './client-eligibility-page.component.html',
  styleUrls: ['./client-eligibility-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientEligibilityPageComponent implements OnInit, OnDestroy {
  private saveClickSubscription!: Subscription;
  eligibilityForm!: FormGroup;
  formSubmited!: boolean;
  savedAnswersList: any = [];
  /** Constructor **/
  constructor(
    private workflowFacade: WorkflowFacade,
    private eligibilityChecklistAnswerFacade: EligibilityChecklistAnswerFacade,
    private formBuilder: FormBuilder,
    private readonly ref: ChangeDetectorRef,
    private readonly notificationSnackbarService: NotificationSnackbarService,
    private readonly loaderService: LoaderService,
    private readonly loggingService: LoggingService
  ) {}

  /** Lifecycle Hooks **/
  ngOnInit(): void {
    this.buildForm();
    this.addSaveSubscription();
  }

  ngOnDestroy(): void {
    this.saveClickSubscription.unsubscribe();
  }
  private buildForm() {
    this.eligibilityForm = this.formBuilder.group({
      clientCaseEligibilityId: [''],
      homeAddressProofChecklistId: ['e85074d6-6ba2-4f7c-8ce8-120fe5c9dbfe'],
      homeAddressProof: ['',Validators.required],
      incomeChecklistId: ['06fede81-4784-48a9-99fb-3151e0fb98cb'],
      income: ['',Validators.required],
      hivVerificationChecklistId: ['762c5bb4-6b1f-4f97-8791-b713a78b3cad'],
      hivVerification: ['',Validators.required],
      xyzChecklistId: ['3d7fd4fa-48a4-4701-a8a6-aa106dc10b69'],
      xyz: ['',Validators.required],
      exceptionChecklistId: ['f5955730-7d7c-479e-bff6-fcf948c2bba9'],
      exception: [''],

    });
  }

  showHideSnackBar(type: SnackBarNotificationType, subtitle: any) {
    if (type == SnackBarNotificationType.ERROR) {
      const err = subtitle;
      this.loggingService.logException(err);
    }
    this.notificationSnackbarService.manageSnackBar(type, subtitle);
  }

  private addSaveSubscription(): void {
    this.saveClickSubscription =
      this.workflowFacade.saveAndContinueClicked$.subscribe((data: any) => {
        this.save();
      });
  }

  setSavedAnswersList(value: any) {
    this.savedAnswersList = value;
    if(this.savedAnswersList.length===0)return;
    const homeAddressProofChecklistId =this.eligibilityForm.controls['homeAddressProofChecklistId'].value;
    const homeAddressProof = this.savedAnswersList.find((m:any) => m.eligibilityChecklistId===homeAddressProofChecklistId)?.answer;
    this.eligibilityForm.controls['homeAddressProof'].setValue(homeAddressProof);

    const incomeChecklistId =this.eligibilityForm.controls['incomeChecklistId'].value;
    const income = this.savedAnswersList.find((m:any) => m.eligibilityChecklistId===incomeChecklistId)?.answer;
    this.eligibilityForm.controls['income'].setValue(income);


    const hivVerificationChecklistId =this.eligibilityForm.controls['hivVerificationChecklistId'].value;
    const hivVerification = this.savedAnswersList.find((m:any) => m.eligibilityChecklistId===hivVerificationChecklistId)?.answer;
    this.eligibilityForm.controls['hivVerification'].setValue(hivVerification);

    const xyzChecklistId =this.eligibilityForm.controls['xyzChecklistId'].value;
    const xyz = this.savedAnswersList.find((m:any) => m.eligibilityChecklistId===xyzChecklistId)?.answer;
    this.eligibilityForm.controls['xyz'].setValue(xyz);

    const exceptionChecklistId =this.eligibilityForm.controls['exceptionChecklistId'].value;
    const exception = this.savedAnswersList.find((m:any) => m.eligibilityChecklistId===exceptionChecklistId)?.answer;
    this.eligibilityForm.controls['exception'].setValue(exception);
    
  }

  private save() {
    this.formSubmited=true;
    this.ref.detectChanges();
    if (this.eligibilityForm.valid) {
      this.formSubmited=false;
      const checklistAnswers = [];
      const clientCaseEligibilityId =
        this.eligibilityForm.controls['clientCaseEligibilityId'].value;
      checklistAnswers.push({
        clientCaseEligibilityId,
        eligibilityChecklistId:
        this.eligibilityForm.controls['homeAddressProofChecklistId'].value,
        answer: this.eligibilityForm.controls['homeAddressProof'].value,
      });
      checklistAnswers.push({
        clientCaseEligibilityId,
        eligibilityChecklistId:
        this.eligibilityForm.controls['incomeChecklistId'].value,
        answer: this.eligibilityForm.controls['income'].value,
      });
      checklistAnswers.push({
        clientCaseEligibilityId,
        eligibilityChecklistId:
        this.eligibilityForm.controls['hivVerificationChecklistId'].value,
        answer: this.eligibilityForm.controls['hivVerification'].value,
      });

      checklistAnswers.push({
        clientCaseEligibilityId,
        eligibilityChecklistId:
        this.eligibilityForm.controls['xyzChecklistId'].value,
        answer: this.eligibilityForm.controls['xyz'].value,
      });

      const exceptionAnswer=this.eligibilityForm.controls['exception'].value || 'No';
      checklistAnswers.push({
        clientCaseEligibilityId,
        eligibilityChecklistId:
        this.eligibilityForm.controls['exceptionChecklistId'].value,
        answer: exceptionAnswer,
      });

      
      this.loaderService.show();
      this.saveAndUpdate(checklistAnswers).subscribe(
          (data) => {
            if (data === true) {
              this.showHideSnackBar(SnackBarNotificationType.SUCCESS,'Eligibility checklist save successfully');
              this.loaderService.hide();
            }
          },
          (error) => {
            this.showHideSnackBar(SnackBarNotificationType.ERROR, error);
            this.loaderService.hide();
          }
        );
    }
  }
  saveAndUpdate(checklistAnswers:any){
    if(this.savedAnswersList.length>0){
      this.savedAnswersList.forEach((element:any) => {
        element.answer=checklistAnswers.find((m:any)=>m.eligibilityChecklistId===element.eligibilityChecklistId)?.answer;
      });
      return this.eligibilityChecklistAnswerFacade.updateEligibilityChecklistAnswer(this.savedAnswersList);
    }
    
    else{
      return this.eligibilityChecklistAnswerFacade.saveEligibilityChecklistAnswer(checklistAnswers)

    }
    
     
  }
}
