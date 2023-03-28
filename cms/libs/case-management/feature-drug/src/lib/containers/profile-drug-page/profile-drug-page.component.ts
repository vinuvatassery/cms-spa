/** Angular **/
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DrugPharmacyFacade } from '@cms/case-management/domain';

@Component({
  selector: 'case-management-profile-drug-page',
  templateUrl: './profile-drug-page.component.html',
  styleUrls: ['./profile-drug-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileDrugPageComponent  implements OnInit {
  profileClientId!: number;
  clientCaseEligibilityId!: any;
  clientCaseId!: any;
  tabId! : any

  constructor(  
    private drugPharmacyFacade: DrugPharmacyFacade,
    private route: ActivatedRoute,
  ) { }

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
      this. loadQueryParams()
     
    }

     /** Private properties **/
  loadQueryParams()
  {
    this.profileClientId = this.route.snapshot.queryParams['id'];
    this.clientCaseEligibilityId = this.route.snapshot.queryParams['elg_id'];
    this.clientCaseId = this.route.snapshot.queryParams['clientCaseId'];
    this.tabId = this.route.snapshot.queryParams['tabId'];  
  }

  removePharmacy(clientPharmacyId: string) {
    this.drugPharmacyFacade.removeClientPharmacy(
      this.profileClientId ?? 0,
      clientPharmacyId
    );
  }
  removeDrugPharmacyRsp(vendorId: any) {
    this.drugPharmacyFacade.removeDrugPharmacy(
      this.profileClientId ?? 0,
      vendorId
    );
  }

  searchPharmacy(searchText: string) {
    this.drugPharmacyFacade.searchPharmacies(searchText);
  }
  addPharmacy(vendorId: string) {
    let priorityCode :string = "";
    this.drugPharmacyFacade.drugPharnacyPriority.subscribe(priorityCodes =>{
     
      priorityCode = priorityCodes;
    })
    this.drugPharmacyFacade.addDrugPharmacy(
      this.profileClientId,
      vendorId,
      priorityCode
    );
  }
}

