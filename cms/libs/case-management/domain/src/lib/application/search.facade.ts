import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Search } from '../entities/search';
import { SearchDataService } from '../infrastructure/search.data.service';

@Injectable({ providedIn: 'root' })
export class SearchFacade {
  private searchListSubject = new BehaviorSubject<Search[]>([]);
  searchList$ = this.searchListSubject.asObservable();

  constructor(private searchDataService: SearchDataService) {}

  load(): void {
    this.searchDataService.load().subscribe({
      next: (searchList) => {
        this.searchListSubject.next(searchList);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }
}
