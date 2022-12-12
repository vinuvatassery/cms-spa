/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
/** Facades **/
import { SearchFacade } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
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
  mobileHeaderSearchOpen = false;
  public formUiStyle : UIFormStyle = new UIFormStyle();
  /** Constructor **/
  constructor(private readonly searchFacade: SearchFacade) {}

  /** Lifecycle hooks **/
  ngOnInit() {
    this.loadSearch();
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
}
