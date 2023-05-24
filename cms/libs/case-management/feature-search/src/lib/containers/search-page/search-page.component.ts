/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
/** Facades **/
import { SearchFacade, CaseStatusCode, CaseFacade, FinancialManagementFacade } from '@cms/case-management/domain';
import { LoaderService, LoggingService, SnackBarNotificationType } from '@cms/shared/util-core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import {  Subject } from 'rxjs';
import { groupBy } from "@progress/kendo-data-query";

export interface VendorList {
  id: number;
  title: string;
  address: string;
  city: string;
  state: string;
  zip: string;
 
}


export const vendorList: VendorList[] =  [
  {
    id: 1,
    title: "Mod Health",
    address: "xxx, 55 Main St",
    city: "Portland",
    state: "OR",
    zip: "97205",
  },
  {
    id: 2,
    title: "Mod Health",
    address: "xxx, 55 Main St",
    city: "Portland",
    state: "OR",
    zip: "97205",
  },
  {
    id: 21,
    title: "Mod Health",
    address: "xxx, 55 Main St",
    city: "Portland",
    state: "OR",
    zip: "97205",
  },
  {
    id: 22,
    title: "Mod Health",
    address: "xxx, 55 Main St",
    city: "Portland",
    state: "OR",
    zip: "97205",
  },
  {
    id: 3,
    title: "Mods Insurance",
    address: "xxx, 55 Main St",
    city: "Portland",
    state: "OR",
    zip: "97205",
  },
  {
    id: 4,
    title: "Mods Insurance",
    address: "xxx, 55 Main St",
    city: "Portland",
    state: "OR",
    zip: "97205",
  },
  {
    id: 5,
    title: "Mods Insurance",
    address: "xxx, 55 Main St",
    city: "Portland",
    state: "OR",
    zip: "97205",
  },
  {
    id: 6,
    title: "Mods Insurance",
    address: "xxx, 55 Main St",
    city: "Portland",
    state: "OR",
    zip: "97205",
  },
  {
    id: 7,
    title: "Vendor Name",
    address: "xxx, 55 Main St",
    city: "Portland",
    state: "OR",
    zip: "97205",
  },
  {
    id: 8,
    title: "Vendor Name",
    address: "xxx, 55 Main St",
    city: "Portland",
    state: "OR",
    zip: "97205",
  },
  {
    id: 9,
    title: "Vendor Name",
    address: "xxx, 55 Main St",
    city: "Portland",
    state: "OR",
    zip: "97205",
  },
];

@Component({
  selector: 'case-management-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchPageComponent implements OnInit {
  /** Public properties **/
  showHeaderSearchInputLoader = false;
  clientSearchResult$ = this.searchFacade.clientSearch$;;
  mobileHeaderSearchOpen = false;
  public formUiStyle : UIFormStyle = new UIFormStyle();
  filterManager: Subject<string> = new Subject<string>();
  searchBars$ = this.caseFacade.searchBars$
  vendorList: any[] = groupBy(vendorList, [{ field: "title" }]);
  /** Constructor **/
  constructor(private readonly searchFacade: SearchFacade,private router: Router,
    private caseFacade: CaseFacade,
    private loggingService: LoggingService,
    private loaderService: LoaderService
   ) {
  
  }

  /** Lifecycle hooks **/
  ngOnInit() {
      this.clientSearchResult$.subscribe(data=>{
      this.showHeaderSearchInputLoader = false;
    })
  
  }
  clickMobileHeaderSearchOpen(){
      this.mobileHeaderSearchOpen = !this.mobileHeaderSearchOpen
  }
  
  onSearchTextChange(selectedValue : string)
  {  
    this.showHeaderSearchInputLoader = true;    
      this.searchFacade.loadCaseBySearchText(selectedValue);     
 
  }
  onSelectChange(selectedValue: any) {
    if (selectedValue !== undefined) {
      if (selectedValue) {
        if (selectedValue.caseStatus !== CaseStatusCode.incomplete) {
          this.router.navigate([`/case-management/cases/case360/${selectedValue.clientId}`]);
        }
        else {
          this.loaderService.show();
          this.caseFacade.getSessionInfoByCaseEligibilityId(selectedValue.clientCaseEligibilityId).subscribe({
            next: (response: any) => {
              if (response) {                
                this.loaderService.hide();
                this.router.navigate(['case-management/case-detail'], {
                  queryParams: {
                    sid: response.sessionId,
                    eid: response.entityID,                   
                    wtc: response?.workflowTypeCode
                  },
                });
              }
            },
            error: (err: any) => {
              this.loaderService.hide();
              this.caseFacade.showHideSnackBar(SnackBarNotificationType.ERROR, err);
              this.loggingService.logException(err)
            }
          })
        }
      }
    }
  }

}


