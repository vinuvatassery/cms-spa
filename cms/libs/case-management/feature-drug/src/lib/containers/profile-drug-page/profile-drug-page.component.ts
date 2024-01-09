/** Angular **/
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ClientProfileTabs, DrugPharmacyFacade } from '@cms/case-management/domain';
import { filter, Subject, Subscription } from 'rxjs';

@Component({
  selector: 'case-management-profile-drug-page',
  templateUrl: './profile-drug-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileDrugPageComponent  implements OnInit , OnDestroy {
  profileClientId!: number;
  clientCaseEligibilityId!: any;
  clientCaseId!: any;
  tabId! : any
  isClientProfile = true;

  constructor(  
    private drugPharmacyFacade: DrugPharmacyFacade,
    private route: ActivatedRoute,
    private readonly router: Router
  ) { }

  tabChangeSubscription$ = new Subscription();
  tabIdSubject = new Subject<string>();
  tabId$ = this.tabIdSubject.asObservable();
    //for add pharmacy
    clientpharmacies$ = this.drugPharmacyFacade.clientPharmacies$;
    pharmacysearchResult$ = this.drugPharmacyFacade.pharmacies$;
    searchLoaderVisibility$ = this.drugPharmacyFacade.searchLoaderVisibility$;
    addPharmacyRsp$ = this.drugPharmacyFacade.addPharmacyResponse$;
    editPharmacyRsp$ = this.drugPharmacyFacade.editPharmacyResponse$;
    removePharmacyRsp$ = this.drugPharmacyFacade.removePharmacyResponse$;
    removeDrugPharmacyRsp$ = this.drugPharmacyFacade.removeDrugPharmacyResponse$;
    triggerPriorityPopup$ = this.drugPharmacyFacade.triggerPriorityPopup$;
    selectedPharmacy$ = this.drugPharmacyFacade.selectedPharmacy$;
    
    ngOnInit(): void {

      this.routeChangeSubscription();
      this. loadQueryParams()
     
    }

     /** Private properties **/
  loadQueryParams()
  {
    this.profileClientId = this.route.snapshot.queryParams['id'];
    this.clientCaseEligibilityId = this.route.snapshot.queryParams['e_id'];
    this.tabId = this.route.snapshot.queryParams['tid']; 
    this.tabIdSubject.next(this.tabId)    
  }

  get clientProfileTabs(): typeof ClientProfileTabs {
    return ClientProfileTabs;
  }
  private routeChangeSubscription() {
    this.tabChangeSubscription$ = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {    
          this.loadQueryParams()  
      });
  }

  ngOnDestroy(): void {
    this.tabChangeSubscription$.unsubscribe();
  }

  removePharmacy(clientPharmacyId: string) {
    this.drugPharmacyFacade.removeClientPharmacy(
      this.profileClientId ?? 0,
      clientPharmacyId
    );
  }
  removeDrugPharmacyRsp(data: any) {
    this.drugPharmacyFacade.removeClientPharmacy(
      this.profileClientId ?? 0,
      data.vendorId,
      data.isShowHistoricalData
    );
  }

  searchPharmacy(searchText: string) {
    this.drugPharmacyFacade.searchPharmacies(searchText);
  }
  addPharmacy(data:any) {
    let priorityCode  = !data.isSetAsPrimary ? "" : "P";
    this.drugPharmacyFacade.addDrugPharmacy(
      this.profileClientId,
      data.vendorId,
      data?.vendorAddressId,
      priorityCode,
      data.isShowHistoricalData
    );
  }
}

