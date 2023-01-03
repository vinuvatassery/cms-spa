/** Angular **/
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
/** External libraries **/
import { forkJoin, mergeMap, of, Subscription } from 'rxjs';
/** Internal Libraries **/
import { WorkflowFacade, VerificationFacade, NavigationType } from '@cms/case-management/domain';
import { Router } from '@angular/router';
import { LoaderService} from '@cms/shared/util-core';

@Component({
  selector: 'case-management-authorization-page',
  templateUrl: './authorization-page.component.html',
  styleUrls: ['./authorization-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthorizationPageComponent implements OnInit, OnDestroy {

  private saveClickSubscription !: Subscription;
  private saveForLaterClickSubscription !: Subscription;
  private saveForLaterValidationSubscription !: Subscription;

  constructor(private workflowFacade: WorkflowFacade,
    private loaderService: LoaderService,
    private router: Router) { }


  ngOnInit(): void {
    this.addSaveSubscription();
    this.addSaveForLaterSubscription();
    this.addSaveForLaterValidationsSubscription();
  }

  ngOnDestroy(): void {
    this.saveClickSubscription.unsubscribe();
    this.saveForLaterClickSubscription.unsubscribe();
    this.saveForLaterValidationSubscription.unsubscribe();
  }

  private addSaveSubscription(): void {
    this.saveClickSubscription = this.workflowFacade.saveAndContinueClicked$.pipe(
      mergeMap((navigationType: NavigationType) =>
        forkJoin([of(navigationType), this.save()])
      ),
    ).subscribe(([navigationType, isSaved]) => {
      if (isSaved) {
        this.workflowFacade.navigate(navigationType);
      }
    });
  }

  private save() {
    let isValid = true;
    // TODO: validate the form
    if (isValid) {
      return of(true);
    }
    
    return of(false)
  }

  private addSaveForLaterSubscription(): void {
    this.saveForLaterClickSubscription = this.workflowFacade.saveForLaterClicked$.pipe(
      mergeMap((statusResponse: boolean) =>
        forkJoin([of(statusResponse), this.save()])
      ),
    ).subscribe(([statusResponse, isSaved]) => {
      if (isSaved) {
        this.loaderService.hide();
        this.router.navigate(['/case-management/cases/case360/100'])
      }
    });
  }

  private addSaveForLaterValidationsSubscription(): void {
    this.saveForLaterValidationSubscription = this.workflowFacade.saveForLaterValidationClicked$.subscribe((val) => {
      if (val) {
        if(this.checkValidations()){
          this.workflowFacade.showSaveForLaterConfirmationPopup(true);
        }
      }
    });
  }

  checkValidations(){
    return true;
  }
}
