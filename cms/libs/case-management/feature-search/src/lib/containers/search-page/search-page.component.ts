/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
/** Facades **/
import { SearchFacade } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { debounceTime,  distinctUntilChanged, Subject } from 'rxjs';
@Component({
  selector: 'case-management-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchPageComponent implements OnInit {
  /** Public properties **/
  showHeaderSearchInputLoader = false;
  search$ = this.searchFacade.search$;
  globalSearchResult$ = this.searchFacade.globalSearched$;;
  mobileHeaderSearchOpen = false;
  public formUiStyle : UIFormStyle = new UIFormStyle();
  filterManager: Subject<string> = new Subject<string>();
  /** Constructor **/
  constructor(private readonly searchFacade: SearchFacade) {
     
  }

  /** Lifecycle hooks **/
  ngOnInit() {
    //this.loadSearch();
  }
  clickMobileHeaderSearchOpen(){
      this.mobileHeaderSearchOpen = !this.mobileHeaderSearchOpen
  }
  /** Private methods **/
  private loadSearch(): void {
    this.showHeaderSearchInputLoader = true;
    this.searchFacade.loadSearch();
    this.showHeaderSearchInputLoader = false;

  }
  onsearchTextChange(text : string)
  {    
    this.showHeaderSearchInputLoader = true;  
    if(text){     
      //this.caseFacade.loadCaseBySearchText(text);
      this.searchFacade.loadCaseBySearchText(text);     

    } 
    this.showHeaderSearchInputLoader = false;
  }
}
