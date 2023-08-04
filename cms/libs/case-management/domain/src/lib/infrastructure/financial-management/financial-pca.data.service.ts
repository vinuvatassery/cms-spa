/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
/** External libraries **/
import { of } from 'rxjs/internal/observable/of';
import { ConfigurationProvider } from '@cms/shared/util-core'; 

@Injectable({ providedIn: 'root' })
export class FinancialPcaDataService {
  /** Constructor**/
  constructor(
    private readonly http: HttpClient,
    private readonly configurationProvider: ConfigurationProvider
  ) {}
 
  loadFinancialPcaSetupListService( ) {
    return of([
      {
        invoiceID:1,
        providerName: 'Address `',
        taxID:'address2', 
        paymentMethod:'address2', 
        clientName:'address2', 
        nameOnPrimaryInsuranceCard:'address2', 
        memberID:'address2', 
        serviceCount:'address2', 
        totalCost:'address2', 
        totalDue:'address2', 
        paymentStatus:'address2', 
        by: 'by',
      },
      {
        invoiceID:2,
        providerName: 'Address `',
        taxID:'address2', 
        paymentMethod:'address2', 
        clientName:'address2', 
        nameOnPrimaryInsuranceCard:'address2', 
        memberID:'address2', 
        serviceCount:'address2', 
        totalCost:'address2', 
        totalDue:'address2', 
        paymentStatus:'address2', 
        by: 'by',
      },
    ]);
  }
  loadFinancialPcaAssignmentListService( ) {
    return of([
      {
        id:1,
        batch: '05012021_001 `',
        ofProviders:'XX', 
        ofClaims:'XX', 
        pmtsRequested:'XX', 
        pmtsReconciled:'XX', 
        totalAmountDue:'XX,XXX.XX', 
        totalAmountReconciled:'XX,XXX.XX',  
      },
      {
        id:2,
        batch: '05012021_001 `',
        ofProviders:'XX', 
        ofClaims:'XX', 
        pmtsRequested:'XX', 
        pmtsReconciled:'XX', 
        totalAmountDue:'XX,XXX.XX', 
        totalAmountReconciled:'XX,XXX.XX',
      },
      {
        id:3,
        batch: '05012021_001 `',
        ofProviders:'XX', 
        ofClaims:'XX', 
        pmtsRequested:'XX', 
        pmtsReconciled:'XX', 
        totalAmountDue:'XX,XXX.XX', 
        totalAmountReconciled:'XX,XXX.XX',  
      },
    ]);
  }
  loadFinancialPcaReassignmentListService( ) {
    return of([
      {
        batch: 'MMDDYYYY_XXX',
        vendor: 'Provider Name',
        type:'TPA', 
        clientName:'FName LName', 
        primaryInsurance:'FName LName', 
        memberID:'FName LName', 
        refundWarrant:'address2', 
        refundAmount:'address2', 
        depositDate:'address2', 
        depositMethod:'address2', 
        originalWarranty:'XXXXXX', 
        originalAmount:'XXXXXX', 
        indexCode:'address2', 
        pca:'address2', 
        grant:'address2', 
        vp:'address2', 
        refundNote:'address2', 
        entryDate:'XX-XX-XXXX',  
        by: 'by',
      },
      {
        batch: 'MMDDYYYY_XXX',
        vendor: 'Provider Name',
        type:'TPA', 
        clientName:'FName LName', 
        primaryInsurance:'FName LName', 
        memberID:'FName LName', 
        refundWarrant:'address2', 
        refundAmount:'address2', 
        depositDate:'address2', 
        depositMethod:'address2', 
        originalWarranty:'XXXXXX', 
        originalAmount:'XXXXXX', 
        indexCode:'address2', 
        pca:'address2', 
        grant:'address2', 
        vp:'address2', 
        refundNote:'address2', 
        entryDate:'XX-XX-XXXX',  
        by: 'by',
      },
      {
        batch: 'MMDDYYYY_XXX',
        vendor: 'Provider Name',
        type:'TPA', 
        clientName:'FName LName', 
        primaryInsurance:'FName LName', 
        memberID:'FName LName', 
        refundWarrant:'address2', 
        refundAmount:'address2', 
        depositDate:'address2', 
        depositMethod:'address2', 
        originalWarranty:'XXXXXX', 
        originalAmount:'XXXXXX', 
        indexCode:'address2', 
        pca:'address2', 
        grant:'address2', 
        vp:'address2', 
        refundNote:'address2', 
        entryDate:'XX-XX-XXXX',  
        by: 'by',
      },
      {
        batch: 'MMDDYYYY_XXX',
        vendor: 'Provider Name',
        type:'TPA', 
        clientName:'FName LName', 
        primaryInsurance:'FName LName', 
        memberID:'FName LName', 
        refundWarrant:'address2', 
        refundAmount:'address2', 
        depositDate:'address2', 
        depositMethod:'address2', 
        originalWarranty:'XXXXXX', 
        originalAmount:'XXXXXX', 
        indexCode:'address2', 
        pca:'address2', 
        grant:'address2', 
        vp:'address2', 
        refundNote:'address2', 
        entryDate:'XX-XX-XXXX',  
        by: 'by',
      },
    ]);
  }
  loadFinancialPcaReportListService( ) {
    return of([
      {
        vendorName: 'Address `',
        type:'address2', 
        clientName:'address2', 
        refundWarrant:'address2', 
        refundAmount:'address2', 
        depositDate:'address2', 
        depositMethod:'address2', 
        indexCode:'address2', 
        pca:'address2', 
        grant:'address2', 
        vp:'address2', 
        refundNote:'address2', 
        entryDate:'address2',  
        by: 'by',
      },
      {
        vendorName: 'Address `',
        type:'address2', 
        clientName:'address2', 
        refundWarrant:'address2', 
        refundAmount:'address2', 
        depositDate:'address2', 
        depositMethod:'address2', 
        indexCode:'address2', 
        pca:'address2', 
        grant:'address2', 
        vp:'address2', 
        refundNote:'address2', 
        entryDate:'address2',  
        by: 'by',
      },
     
    ]);
  }
 
  loadFinancialPcaObjectListService(){
    return of([
      {
        id:1,
        vendorName: 'Vendor Name',
        type:'address2', 
        clientName:'address2', 
        refundWarrant:'address2', 
        refundAmount:'address2', 
        depositDate:'address2', 
        depositMethod:'address2', 
        indexCode:'address2', 
        pca:'address2', 
        grant:'address2', 
        vp:'address2', 
        refundNote:'address2', 
        entryDate:'address2',  
        by: 'by',
      },
      {
        id:2,
        vendorName: 'Address `',
        type:'address2', 
        clientName:'address2', 
        refundWarrant:'address2', 
        refundAmount:'address2', 
        depositDate:'address2', 
        depositMethod:'address2', 
        indexCode:'address2', 
        pca:'address2', 
        grant:'address2', 
        vp:'address2', 
        refundNote:'address2', 
        entryDate:'address2',  
        by: 'by',
      },
     
    ]);
  }
 
 
}