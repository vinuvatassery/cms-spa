/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
/** External libraries **/
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
/** Entities **/
import { Approval, ApprovalPayments } from '../entities/approval'; 

@Injectable({ providedIn: 'root' })
export class ApprovalDataService {
  /** Constructor **/
  constructor(private readonly http: HttpClient) {}

  /** Public methods **/
  loadApprovalsGeneral(): Observable<Approval[]> {
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


  loadPendingPaymentsListsServices(): Observable<ApprovalPayments[]> {
    return of([
      { 
        id: 1, 
        Attention: 'Attention', 
        viewPmtsInBatch: 'Attention', 
        batch: 'Attention', 
        totalAMount: 'xxxx', 
        pmtCount: 'xxxx', 
        providerCount: 'xxx', 
        dateApprovalRequest: 'xx/xx/xxxx', 
        serviceDate: '12/2019',
        Schedule: 'Immediate',
        category: 'Expense',
        expenseType: 'Rent Deposit',
        typeOfUtility: 'Electric',
        amount: '(572.00)',
        fundingSource: 'Formula',
        paymentMethod: 'Check',
        frequency: 'One Time',
        serviceProvider: 'Post Centennial Park', 
        status: 'Submitted', 
        URN: '102456',
        clientNumber: '00000543',
        name: 'Sarah Phillips (Josh)',
        pcaCode: 'Code X',
        glAccount: '00000000', 
        sendBackNotes:'notes',
      },
      
      
     
    ]);
  }
}
