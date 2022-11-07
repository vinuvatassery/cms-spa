/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
/** External libraries **/
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
/** Entities **/
import { Document } from '../entities/document';

@Injectable({ providedIn: 'root' })
export class DocumentDataService {
  /** Constructor**/
  constructor(private readonly http: HttpClient) {}

  /** Public methods **/
  loadDocuments(): Observable<Document[]> {
    return of([
      { id: 1, 
        name: 'Lorem ipsum', 
        description: 'Lorem ipsum dolor sit amet' ,
        filesize: '12 MB' ,
        attachmenttType: 'Proof of Income' , 
        attachmentnote: 'Lorem ipsum dolor sit amet, consectetur adipiscing eli. Sed dignissim nec lorem' ,
        by: 'James' ,
      },
      { id: 1, name: 'Lorem ipsum', description: 'Lorem ipsum dolor sit amet' },
      {
        id: 2,
        name: 'At vero eos',
        description: 'At vero eos et accusam et justo duo dolores',
        filesize: '12 MB' ,
        attachmenttType: 'Proof of Income' , 
        attachmentnote: 'Lorem ipsum dolor sit amet, consectetur adipiscing eli. Sed dignissim nec lorem' ,
        by: 'James' ,
      },
      {
        id: 3,
        name: 'Duis autem',
        description: 'Duis autem vel eum iriure dolor in hendrerit',
        filesize: '12 MB' ,
        attachmenttType: 'Proof of Income' , 
        attachmentnote: 'Lorem ipsum dolor sit amet, consectetur adipiscing eli. Sed dignissim nec lorem' ,
        by: 'James' ,
      },
    ]);
  }
}
