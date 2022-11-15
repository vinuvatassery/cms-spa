/** Angular **/
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { CaseDetailsFacade, HealthcareProviderFacade } from '@cms/case-management/domain';
import { Subscription } from 'rxjs';

@Component({
  selector: 'case-management-healthcare-provider-page',
  templateUrl: './healthcare-provider-page.component.html',
  styleUrls: ['./healthcare-provider-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HealthcareProviderPageComponent implements OnInit, OnDestroy {

  ClientCaseEligibilityId  = "90478CC0-1EB5-4D76-BC49-05423EFA3D93";

  /** Public properties **/
  hasNoProvider = false; 
  healthCareProviders$ = this.healthProvider.healthCareProviders$;
  removeHealthProvider$ =this.healthProvider.removeHealthProvider$;


  /** Private properties **/
  private saveClickSubscription !: Subscription;

  /** Constructor **/
  constructor(private caseDetailsFacade: CaseDetailsFacade,
    private healthProvider:HealthcareProviderFacade) { }

  /** Lifecycle Hooks **/
  ngOnInit(): void {
    this.loadHealthCareProviders(this.ClientCaseEligibilityId);
    this.saveClickSubscribed();
  }

   /** Private methods **/
   private loadHealthCareProviders(ClientCaseEligibilityId : string) {  
    this.healthProvider.loadHealthCareProviders(ClientCaseEligibilityId);   
  }

  private removeHealthCareProvider(ProviderId : string){
     this.healthProvider.removeHealthCareProviders(this.ClientCaseEligibilityId, ProviderId);      
  }
  UpdateHealthCareProvidersFlag(nohealthCareProviderFlag : string) {
    this.healthProvider.UpdateHealthCareProvidersFlag(this.ClientCaseEligibilityId, nohealthCareProviderFlag);   
  }

  ngOnDestroy(): void {
    this.saveClickSubscription.unsubscribe();
  }

  /** Private Methods **/
  private saveClickSubscribed(): void {
    this.saveClickSubscription = this.caseDetailsFacade.saveAndContinueClicked.subscribe(() => {
      this.healthProvider.save().subscribe((response: boolean) => {
        if(response){
          this.caseDetailsFacade.navigateToNextCaseScreen.next(true);
        }
      })
    });
  }

  /** Internal event methods **/
  onProviderValueChanged() {
    this.hasNoProvider = !this.hasNoProvider;
    this.UpdateHealthCareProvidersFlag( this.hasNoProvider == true ? "Y" : "N");  
  }

/** events from child components**/
   handlePrvRemove(prvSelectedId : string)
   {        
      this.removeHealthCareProvider(prvSelectedId);                  
   }
  
}
