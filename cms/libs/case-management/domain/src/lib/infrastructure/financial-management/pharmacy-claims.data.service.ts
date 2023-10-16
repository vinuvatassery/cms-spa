/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
/** External libraries **/
import { of } from 'rxjs/internal/observable/of';
import { ConfigurationProvider } from '@cms/shared/util-core'; 

@Injectable({ providedIn: 'root' })
export class FinancialPharmacyClaimsDataService {
  /** Constructor**/
  constructor(
    private readonly http: HttpClient,
    private readonly configurationProvider: ConfigurationProvider
  ) {}
 

 
  loadPharmacyClaimsProcessListService( ) {
    return of([
      {
        id:1,
        PharmacyName: 'Address `',  
        clientName:'address2', 
        nameOnPrimaryInsuranceCard:'address2', 
        memberID:'XXXXXX', 
        RXNumber:'XXXXXX', 
        FillDate:'XX/XX/XXXX', 
        ndcCode:'XXXXXX', 
        brandName:'XXXXXX', 
        drugName: 'XXXXXX',
        paymentType: 'XXXXXX',
        amountPaid: 'xx.xx',
        rxQty: 'XX',
        rxType: 'XX',
        rxDaysSupply: 'XX',
        indexCode: 'XXXX',
        pcaCode: 'XXXX',
        objectCode: 'XXXX',
        paymentStatus: 'XXXX',
        warrantNumber: 'XXXXXX',
        entryDate: 'XX/XX/XXXX',
        by: 'by',
      },
      
    ]);
  }
  loadPharmacyClaimsBatchListService( ) {
    return of([
      {
        id:1,
        item:1,
        PharmacyName: 'XXXXXX XXXXXX',  
        paymentMethod: 'paymentMethod',
        clientName:'XXXXXX XXXXXX XXXX', 
        nameOnPrimaryInsuranceCard:'address2', 
        memberID:'XXXXXX', 
        RXNumber:'XXXXXX', 
        FillDate:'XX/XX/XXXX', 
        ndcCode:'XXXXXX', 
        brandName:'XXXXXX', 
        drugName: 'XXXXXX',
        paymentType: 'XXXXXX',
        amountPaid: 'xx.xx',
        rxQty: 'XX',
        rxType: 'XX',
        rxDaysSupply: 'XX',
        indexCode: 'XXXX',
        pcaCode: 'XXXX',
        objectCode: 'XXXX',
        paymentStatus: 'XXXX',
        warrantNumber: 'XXXXXX',
        entryDate: 'XX/XX/XXXX',
        by: 'by',
      },
      
    ]);
  }
  loadPharmacyClaimsAllPaymentsListService( ) {
    return of([
      {
        id:1,
      Item: '123213',
      batch:'23213123',
      PharmacyName: 'XXXXXX',  
      clientName:'XXXXXX', 
      paymentMethod:'XXXXXX', 
      nameOnPrimaryInsuranceCard:'address2', 
      memberID:'XXXXXX', 
      RXNumber:'XXXXXX', 
      FillDate:'XX/XX/XXXX', 
      ndcCode:'XXXXXX', 
      brandName:'XXXXXX', 
      drugName: 'XXXXXX',
      paymentType: 'XXXXXX',
      amountPaid: 'xx.xx',
      rxQty: 'XX',
      rxType: 'XX',
      rxDaysSupply: 'XX',
      indexCode: 'XXXX',
      pcaCode: 'XXXX',
      objectCode: 'XXXX',
      paymentStatus: 'XXXX',
      warrantNumber: 'XXXXXX',
      entryDate: 'XX/XX/XXXX',
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


  loadBatchLogListService( ) {
    return of([
      {
        id:1,
        item:1,
        PharmacyName: 'XXXXXX XXXXXX',  
        paymentMethod: 'paymentMethod',
        clientName:'XXXXXX XXXXXX', 
        nameOnPrimaryInsuranceCard:'XXXXXXX XXXXXXXXXXX', 
        memberID:'XXXXXX', 
        RXNumber:'XXXXXX', 
        FillDate:'XX/XX/XXXX', 
        ndcCode:'XXXXXX', 
        brandName:'XXXXXX', 
        drugName: 'XXXXXX',
        paymentType: 'XXXXXX',
        amountPaid: 'xx.xx',
        rxQty: 'XX',
        rxType: 'XX',
        rxDaysSupply: 'XX',
        indexCode: 'XXXX',
        pcaCode: 'XXXX',
        objectCode: 'XXXX',
        paymentStatus: 'XXXX',
        warrantNumber: 'XXXXXX',
        entryDate: 'XX/XX/XXXX',
        by: 'by',
      },
     
    ]);
  }
  loadBatchItemsListService(){
    return of([
      {
        id:101,
        vendorName: 'vendorName',
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
        id:102,
        vendorName: 'vendorName',
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

  loadReconcileListService(){
    return of([
      {
        id:1,
      pharmacyName: 'Vendor Name',
      TIN:'XXXXXX', 
      pmtMethod:'pmtMethod', 
      datePmtReconciled:'XX/XX/XXXX', 
      datePmtSend:'XX/XX/XXXX', 
      pmtAmount:'XX.XX', 
      note:'XXXX XXXXXX XXXXXX', 
      },
      
     
    ]);
  }
  addPharmacyClaim(data: any) {
    return this.http.put<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/claims/pharmacies`,      data    );
  }

  updatePharmacyClaim(data: any) {
    return this.http.put<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/claims/pharmacies`,      data    );
  }

  getPharmacyClaim(paymentRequestId: string) {
    return this.http.get<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/claims/pharmacies/${paymentRequestId}`);
  }

  searchPharmacies(searchText: string) {
    return this.http.get<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/claims/pharmacies/searchText=${searchText}`);
  }

  searchClients(searchText: string) {
    return this.http.get<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/claims/pharmacies/clients=${searchText}`);
  }

  searchDrug(searchText: string) {
    return this.http.get<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/claims/pharmacies/drugs/ndcCode=${searchText}`);
  }
}
