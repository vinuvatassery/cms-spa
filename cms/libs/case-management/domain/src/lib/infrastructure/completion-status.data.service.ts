import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CompletionStatusDataService {

  loadCompletionStatus(caseId?: number) {
    if (caseId) {
      return of([
        {
          name: 'Case Details',
          completed: 2,
          total: 31,
        },
        {
          name: 'Applicant Info',
          completed: 2,
          total: 31,
        },
        {
          name: 'Contact Info',
          completed: 2,
          total: 31,
        },
        {
          name: 'Family & Dependents',
          completed: 31,
          total: 31,
        },
        {
          name: 'Income',
          completed: 2,
          total: 31,
        },
        {
          name: 'Employment',
          completed: 31,
          total: 31,
        },
        {
          name: 'Cessation',
          completed: 31,
          total: 2,
        },
        {
          name: 'Health Insurance',
          completed: 31,
          total: 31,
        },
        {
          name: 'Prescription Drugs',
          completed: 31,
          total: 31,
        },
        {
          name: 'HIV Healthcare Provider',
          completed: 31,
          total: 31,
        },
        {
          name: 'HIV Case Manager',
          completed: 31,
          total: 31,
        },
        {
          name: 'HIV Verification',
          completed: 31,
          total: 31,
        },
        {
          name: 'Authorization',
          completed: 31,
          total: 31,
        },
      ]);
    } else {
      return of([
        {
          name: 'Case Details',
          completed: 0,
          total: 31,
        },
        {
          name: 'Applicant Info',
          completed: 0,
          total: 31,
        },
        {
          name: 'Contact Info',
          completed: 0,
          total: 31,
        },
        {
          name: 'Family & Dependents',
          completed: 0,
          total: 31,
        },
        {
          name: 'Income',
          completed: 0,
          total: 31,
        },
        {
          name: 'Employment',
          completed: 0,
          total: 31,
        },
        {
          name: 'Cessation',
          completed: 0,
          total: 2,
        },
        {
          name: 'Health Insurance',
          completed: 0,
          total: 31,
        },
        {
          name: 'Prescription Drugs',
          completed: 0,
          total: 31,
        },
        {
          name: 'HIV Healthcare Provider',
          completed: 0,
          total: 31,
        },
        {
          name: 'HIV Case Manager',
          completed: 0,
          total: 31,
        },
        {
          name: 'HIV Verification',
          completed: 0,
          total: 31,
        },
        {
          name: 'Authorization',
          completed: 0,
          total: 31,
        },
      ]);
    }
  }
}
