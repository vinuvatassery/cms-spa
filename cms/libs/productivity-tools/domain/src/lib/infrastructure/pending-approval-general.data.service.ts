import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
/** External libraries **/ 
import { of } from 'rxjs/internal/observable/of';

@Injectable({ providedIn: 'root' })
export class PendingApprovalGeneralService {
  /** Constructor **/
  constructor(private readonly http: HttpClient) {}

  /** Public methods **/
  loadApprovalsGeneral() {
    return of([
      { id: 1, name: 'Lorem ipsum', description: 'Lorem ipsum dolor sit amet' },
      {
        id: 2,
        name: 'At vero eos',
        description: 'At vero eos et accusam et justo duo dolores',
      },
      {
        id: 3,
        name: 'Duis autem',
        description: 'Duis autem vel eum iriure dolor in hendrerit',
      },
    ]);
  }
}
