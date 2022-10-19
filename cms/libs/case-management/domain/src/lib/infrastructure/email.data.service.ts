/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
/** External libraries **/
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
/** Entities **/
import { Email } from '../entities/email';

@Injectable({ providedIn: 'root' })
export class EmailDataService {
  /** Constructor**/
  constructor(private readonly http: HttpClient) {}

  /** Public methods **/
  loadEmails(): Observable<Email[]> {
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

  loadDdlLetterTemplates() {
    return of([
      { key: 1, value: 'Draft Custom Letter', screenName: 'Authorization' },
      { key: 2, value: 'Template Name 1', screenName: 'Authorization' },
      { key: 3, value: 'Template Name 2', screenName: 'Authorization' },
      { key: 4, value: 'Draft Custom Letter', screenName: 'Case360Page' },
      { key: 5, value: 'Draft Name 1', screenName: 'Case360Page' },
      { key: 6, value: 'Draft Name 2', screenName: 'Case360Page' },
      { key: 7, value: 'Draft Custom Letter', screenName: 'case-detail' },
      { key: 8, value: 'Draft Name 1', screenName: 'case-detail' },
      { key: 9, value: 'Draft Name 2', screenName: 'case-detail' },
    ]);
  }

  loadDdlEmails() {
    return of([
      'john.cc@email.com',
      'clara.ben@example.com',
      'bellstro@example.com',
      'David.bessi@email.com',
      'father-cool@email.com',
    ]);
  }

  loadClientVariables() {
    return of([
      'Variable 1',
      'Variable 2',
      'Variable 3',
      'Variable 4',
      'Variable 5',
    ]);
  }

  loadDdlEditorVariables() {
    return of([
      {
        text: 'Attach from System',
      },
      {
        text: 'Attach from Computer',
      },
      {
        text: "Attach from Client's Attachments",
      },
    ]);
  }

  loadDdlMessageRecipients() {
    return of(['(000)000-0000', '(123)456-7890']);
  }
}
