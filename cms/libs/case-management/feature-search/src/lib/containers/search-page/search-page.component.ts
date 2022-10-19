/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
/** Facades **/
import { SearchFacade } from '@cms/case-management/domain';

@Component({
  selector: 'case-management-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchPageComponent implements OnInit {
  /** Public properties **/
  search$ = this.searchFacade.search$;

  /** Constructor **/
  constructor(private readonly searchFacade: SearchFacade) {}

  /** Lifecycle hooks **/
  ngOnInit() {
    this.loadSearch();
  }

  /** Private methods **/
  private loadSearch(): void {
    this.searchFacade.loadSearch();
  }
}
