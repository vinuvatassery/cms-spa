/** Angular **/
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { CaseDetailsFacade, ManagementFacade } from '@cms/case-management/domain';
import { Subscription } from 'rxjs';

@Component({
  selector: 'case-management-management-page',
  templateUrl: './management-page.component.html',
  styleUrls: ['./management-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManagementPageComponent  implements OnInit, OnDestroy {
   /** Public properties **/
  isVisible: any;
  isSelected = true;

   /** Private properties **/
   private saveClickSubscription !: Subscription;

   /** Constructor **/
   constructor(private caseDetailsFacade: CaseDetailsFacade,
    private managementFacade:ManagementFacade) { }
 
   /** Lifecycle Hooks **/
   ngOnInit(): void {
     this.saveClickSubscribed();
   }
 
   ngOnDestroy(): void {
     this.saveClickSubscription.unsubscribe();
   }
 
   /** Private Methods **/
   private saveClickSubscribed(): void {
     this.saveClickSubscription = this.caseDetailsFacade.saveAndContinueClicked.subscribe(() => {
      this.managementFacade.save().subscribe((response: boolean) => {
        if(response){
          this.caseDetailsFacade.navigateToNextCaseScreen.next(true);
        }
      })
     });
   }
}
