/** Angular **/
import { Injectable } from '@angular/core';
/** External libraries **/
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
/** Entities **/
import { Search } from '../entities/search';
/** Data services **/
import { SearchDataService } from '../infrastructure/search.data.service';

@Injectable({ providedIn: 'root' })
export class SearchFacade {
  /** Private properties **/
  private searchSubject = new BehaviorSubject<Search[]>([]);

  /** Public properties **/
  search$ = this.searchSubject.asObservable();

  /** Constructor**/
  constructor(private readonly searchDataService: SearchDataService) {}

  /** Public methods **/
  loadSearch(): void {
    this.searchDataService.loadSearch().subscribe({
      next: (searchResponse) => {
        this.searchSubject.next(searchResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }
}
