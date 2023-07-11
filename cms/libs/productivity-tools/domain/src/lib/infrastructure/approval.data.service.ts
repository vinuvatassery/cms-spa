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


  loadPendingPaymentsListsServices() {
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


  loadImportedClaimsListServices()  {
    return of([
      { 
        id: 1, 
        clientName: 'Attention', 
        namePrimaryInsuranceCard: 'Attention', 
        claimSource: 'Attention', 
        policyID: 'xxxx', 
        amountDue: 'xxxx', 
        dateService: 'xxx', 
        policyIDMatch: 'xx/xx/xxxx', 
        eligibilityMatch: '12/2019',
        validInsurance: 'Immediate',
        belowMaxBenefits: 'Expense',
        entryDate: 'Rent Deposit',
        isDelete: 'Y',
      },
      { 
        id: 2, 
        clientName: 'Attention', 
        namePrimaryInsuranceCard: 'Attention', 
        claimSource: 'Attention', 
        policyID: 'xxxx', 
        amountDue: 'xxxx', 
        dateService: 'xxx', 
        policyIDMatch: 'xx/xx/xxxx', 
        eligibilityMatch: '12/2019',
        validInsurance: 'Immediate',
        belowMaxBenefits: 'Expense',
        entryDate: 'Rent Deposit',
        isDelete: 'N',
      },
    ]);
  }
}
