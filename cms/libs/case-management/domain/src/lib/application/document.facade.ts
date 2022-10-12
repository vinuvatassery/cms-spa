/** Angular **/
import { Injectable } from '@angular/core';
/** External libraries **/
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
/** Entities **/
import { Document } from '../entities/document';
/** Data services **/
import { DocumentDataService } from '../infrastructure/document.data.service';

@Injectable({ providedIn: 'root' })
export class DocumentFacade {
  /** Private properties **/
  private documentsSubject = new BehaviorSubject<Document[]>([]);

  /** Public properties **/
  documents$ = this.documentsSubject.asObservable();

  /** Constructor**/
  constructor(private readonly documentDataService: DocumentDataService) {}

  /** Public methods **/
  loadDocuments(): void {
    this.documentDataService.loadDocuments().subscribe({
      next: (documentsResponse) => {
        this.documentsSubject.next(documentsResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }
}
