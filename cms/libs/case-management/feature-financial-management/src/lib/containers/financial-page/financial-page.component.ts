import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {  ActivatedRoute, Router } from '@angular/router';
import { FinancialManagementFacade } from '@cms/case-management/domain';
import { Subject } from 'rxjs';

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
    private financialManagementFacade: FinancialManagementFacade    ) {
    route.navigate(['vendors'], {relativeTo: activeRoute})
  }   

   /** Lifecycle hooks **/
   ngOnInit() {    
    this.financialManagementFacade.enableVendorSearch();
  }

  openInnerLeftMenu(){
    this.isInnerLeftMenuOpen = !this.isInnerLeftMenuOpen
  }
}
