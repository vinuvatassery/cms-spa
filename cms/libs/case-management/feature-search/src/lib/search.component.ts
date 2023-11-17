import { Component, OnInit } from '@angular/core';
import { SearchFacade } from '@cms/case-management/domain';

@Component({
  selector: 'case-management-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  searchList$ = this.searchFacade.searchList$;

  constructor(private searchFacade: SearchFacade) {}

  ngOnInit() {
    this.load();
  }

  load(): void {
    this.searchFacade.load();
  }
}
