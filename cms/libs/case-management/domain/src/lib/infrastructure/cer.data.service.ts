/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
/** External libraries **/
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
/** Entities **/
import { Cer } from '../entities/cer';

@Injectable({ providedIn: 'root' })
export class CerDataService {
  /** Constructor**/
  constructor(private readonly http: HttpClient) {}

  /** Public methods **/
  loadCer(): Observable<Cer[]> {
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

  loadCerGrid() {
    return of([
      {
        ClientName: 'John Sakariya',
        MemID: '000000',
        DateOfBirth: '01-03-2022',
        CERID: '000000',
        CurrentStatus: 'ACCEPT',
        DateCERSent: '01-03-2022',
        DateCERReceived: '01-03-2022',
        DateCERCompleted: '01-01-2022',
        ReminderSentDate: '01-03-2022',
        CERResentDate: '01-03-2022',
        RestrictedSentDate: '01-01-2022',
        SpokenLanguage: 'English',
        CaseManager: 'Krish Fell',
        CaseWorker: 'Router Miller',
      },
      {
        ClientName: 'Kelly Morhes',
        MemID: '000000',
        DateOfBirth: '01-03-2022',
        CERID: '000000',
        CurrentStatus: 'ACCEPT',
        DateCERSent: '01-03-2022',
        DateCERReceived: '01-03-2022',
        DateCERCompleted: '01-01-2022',
        ReminderSentDate: '01-03-2022',
        CERResentDate: '01-03-2022',
        RestrictedSentDate: '01-01-2022',
        SpokenLanguage: 'English',
        CaseManager: 'Krish Fell',
        CaseWorker: 'Router Miller',
      },
      {
        ClientName: 'drill Patta',
        MemID: '000000',
        DateOfBirth: '01-03-2022',
        CERID: '000000',
        CurrentStatus: 'ACCEPT',
        DateCERSent: '01-03-2022',
        DateCERReceived: '01-03-2022',
        DateCERCompleted: '01-01-2022',
        ReminderSentDate: '01-03-2022',
        CERResentDate: '01-03-2022',
        RestrictedSentDate: '01-01-2022',
        SpokenLanguage: 'English',
        CaseManager: 'Krish Fell',
        CaseWorker: 'Router Miller',
      },
    ]);
  }

  loadDdlCer() {
    return of(['Value 1', 'Value 2', 'Value 3', 'Value 4']);
  }
}
