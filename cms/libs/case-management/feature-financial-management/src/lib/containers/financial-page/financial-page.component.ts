import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {  ActivatedRoute, Router } from '@angular/router';
import { CaseFacade,  SearchHeaderType } from '@cms/case-management/domain';

@Component({
  selector: 'cms-financial-page',
  templateUrl: './financial-page.component.html',
  styleUrls: ['./financial-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FinancialPageComponent implements OnInit{

 
  // new profile button
  // financial-navigation component
  //  router outlet
  //  reminder component(reuse)
  isInnerLeftMenuOpen = false;
  constructor(route: Router, activeRoute : ActivatedRoute,
    private caseFacade: CaseFacade    ) {
    route.navigate(['vendors'], {relativeTo: activeRoute})
  }   

   /** Lifecycle hooks **/
   ngOnInit() {    
    this.caseFacade.enableSearchHeader(SearchHeaderType.VendorSearch);
  }

  openInnerLeftMenu(){
    this.isInnerLeftMenuOpen = !this.isInnerLeftMenuOpen
  }
}
