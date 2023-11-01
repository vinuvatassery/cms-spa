/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
/** External libraries **/ 
import { of } from 'rxjs/internal/observable/of';
/** Entities **/ 

@Injectable({ providedIn: 'root' })
export class ApprovalDataService {
  /** Constructor **/
  constructor(private readonly http: HttpClient) {}

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
