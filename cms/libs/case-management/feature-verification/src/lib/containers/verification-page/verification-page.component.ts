/** Angular **/
import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
/** External libraries **/
import { forkJoin, mergeMap, of, Subscription } from 'rxjs';
/** Internal Libraries **/
import { WorkflowFacade, VerificationFacade, NavigationType } from '@cms/case-management/domain';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'case-management-verification-page',
  templateUrl: './verification-page.component.html',
  styleUrls: ['./verification-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerificationPageComponent implements OnInit, OnDestroy, AfterViewInit {

  hivVerificationForm!:FormGroup;
  /** Private properties **/
  private saveClickSubscription !: Subscription;

  /** Constructor **/
  constructor(private workflowFacade: WorkflowFacade,
    private verificationFacade: VerificationFacade,private formBuilder: FormBuilder) { }

  /** Lifecycle Hooks **/
  ngOnInit(): void {
    this.buildForm();
    this.addSaveSubscription();
  }

  ngOnDestroy(): void {
    this.saveClickSubscription.unsubscribe();
  }

  ngAfterViewInit(){
    this.workflowFacade.enableSaveButton();
  } 

  /** Private Methods **/

  private buildForm() {
    this.hivVerificationForm = this.formBuilder.group({
      providerEmailAddress: ['', [Validators.required, Validators.email]],
      providerOption:['']
    });

  }
  private addSaveSubscription(): void {
    this.saveClickSubscription = this.workflowFacade.saveAndContinueClicked$.pipe(
      //tap(() => this.workflowFacade.disableSaveButton()), TODO: uncomment while completing this page. This will prevent multiple clicks on save & continue button. 
      mergeMap((navigationType: NavigationType) =>
        forkJoin([of(navigationType), this.save()])
      ),
    ).subscribe(([navigationType, isSaved]) => {
      if (isSaved) {
        this.workflowFacade.navigate(navigationType);
      } else {
        this.workflowFacade.enableSaveButton();
      }
    });
  }

  private save() {
    let isValid = true;
    // TODO: validate the form
    if (isValid) {
      return this.verificationFacade.save();
    }
    
    return of(false)
  }
}
