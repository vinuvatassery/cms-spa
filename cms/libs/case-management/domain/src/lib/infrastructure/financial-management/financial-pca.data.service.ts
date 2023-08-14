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
        id:1,
        pca: '123123`',
        ay:'AY21', 
        description:'Some Description Some Description', 
        amount:'43324342.33',  
        remaining:'345435.33', 
        closeDate:'MM/DD/YYYY', 
        grantName:'Name', 
        grantNumber:'34535345', 
        assigned: true,  
      },
      {
        id:2,
        pca: '123123`',
        ay:'AY21', 
        description:'Some Description Some Description', 
        amount:'43324342.33',  
        remaining:'345435.33', 
        closeDate:'MM/DD/YYYY', 
        grantName:'Name', 
        grantNumber:'34535345', 
        assigned: false,  
      },
      
    ]);
  }
  loadFinancialPcaAssignmentListService( ) {
    return of([
      {
        id:1,
        priority: 1,
        pca: '123123`',
        object:'Third Party', 
        objectCode:'234234', 
        amount:'43324342.33',  
        openDate:'MM/DD/YYYY', 
        closeDate:'MM/DD/YYYY', 
        totalAmount:'43324342.33', 
        amountUsed:'43324342.33', 
        amountLeft:'43324342.33',
        isActive: true,  
      },
      {
        id:2,
        priority: 2,
        pca: '123123`',
        object:'Third Party', 
        objectCode:'234234', 
        amount:'43324342.33',  
        openDate:'MM/DD/YYYY', 
        closeDate:'MM/DD/YYYY', 
        totalAmount:'43324342.33', 
        amountUsed:'43324342.33', 
        amountLeft:'43324342.33',
        isActive: false,  
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
 
}