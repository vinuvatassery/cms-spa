/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
/** Facades **/
import { SearchFacade } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import {  Subject } from 'rxjs';
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

  /** Constructor **/
  constructor(private readonly searchFacade: SearchFacade,private router: Router) {
     
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
  onSelectChange(selectedValue:any){ 
    if(selectedValue !== undefined){
      this.router.navigateByUrl(`case-management/cases/case360/${selectedValue.clientCaseId}`); 
    }
  }

}



