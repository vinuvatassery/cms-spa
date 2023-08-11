/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
/** External libraries **/
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
import { ConfigurationProvider } from '@cms/shared/util-core'; 
import { Pharmacy } from '../../entities/client-pharmacy';
import { ClientCase } from '../../entities/client-case';

@Injectable({ providedIn: 'root' })
export class FinancialClaimsDataService {
  /** Constructor**/
  constructor(
    private readonly http: HttpClient,
    private readonly configurationProvider: ConfigurationProvider
  ) {}
 

 
  loadFinancialClaimsProcessListService(skipcount: number,  maxResultCount: number,  sort: string,  sortType: string, filter : string, claimsType : string ) {

    const MedicalClaimsPageAndSortedRequestDto =
    {    
      SortType : sortType,
      Sorting : sort,
      SkipCount : skipcount,
      MaxResultCount : maxResultCount,
      Filter : filter
    }
    
    return this.http.post<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/claims/${claimsType}`,MedicalClaimsPageAndSortedRequestDto
    );
  }

  loadFinancialClaimsInvoiceListService(paymentRequestId : string, skipcount: number,  maxResultCount: number,  sort: string,  sortType: string, claimsType : string) {  
    
    return this.http.get<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/claims/${claimsType}/${paymentRequestId}/invoices?SortType=${sortType}&Sorting=${sort}&SkipCount=${skipcount}&MaxResultCount=${maxResultCount}`,
    );
  }

  loadFinancialClaimsBatchListService( ) {
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
  loadFinancialClaimsAllPaymentsListService( ) {
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


  loadBatchLogListService( ) {
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
  loadClaimsListService( ) {
    return of([
      {
        insuranceCarrier: 'Carrier Name',
        planName:'Plan Name', 
        insuranceType:'Off-Exchange Plan', 
        amount:'XXX.XX', 
        coverageDates:'XX/XX/XXXX-XX/XX/XXXX', 
        policyID:'XXXXXXXXX', 
        groupID:'XXXXXXXXX', 
        paymentID:'XXXXXXXXX', 
        pmtMethod:'ACH', 
        pmtStatus:'Recon', 
        PCA:'XXXXXX', 
        mailCode:'XXXX',   
        by: 'by',
      },
      {
        insuranceCarrier: 'Carrier Name',
        planName:'Plan Name', 
        insuranceType:'Off-Exchange Plan', 
        amount:'XXX.XX', 
        coverageDates:'XX/XX/XXXX-XX/XX/XXXX', 
        policyID:'XXXXXXXXX', 
        groupID:'XXXXXXXXX', 
        paymentID:'XXXXXXXXX', 
        pmtMethod:'ACH', 
        pmtStatus:'Recon', 
        PCA:'XXXXXX', 
        mailCode:'XXXX',   
        by: 'by',
      },
      {
        insuranceCarrier: 'Carrier Name',
        planName:'Plan Name', 
        insuranceType:'Off-Exchange Plan', 
        amount:'XXX.XX', 
        coverageDates:'XX/XX/XXXX-XX/XX/XXXX', 
        policyID:'XXXXXXXXX', 
        groupID:'XXXXXXXXX', 
        paymentID:'XXXXXXXXX', 
        pmtMethod:'ACH', 
        pmtStatus:'Recon', 
        PCA:'XXXXXX', 
        mailCode:'XXXX',   
        by: 'by',
      },
      {
        insuranceCarrier: 'Carrier Name',
        planName:'Plan Name', 
        insuranceType:'Off-Exchange Plan', 
        amount:'XXX.XX', 
        coverageDates:'XX/XX/XXXX-XX/XX/XXXX', 
        policyID:'XXXXXXXXX', 
        groupID:'XXXXXXXXX', 
        paymentID:'XXXXXXXXX', 
        pmtMethod:'ACH', 
        pmtStatus:'Recon', 
        PCA:'XXXXXX', 
        mailCode:'XXXX',   
        by: 'by',
      },
      {
        insuranceCarrier: 'Carrier Name',
        planName:'Plan Name', 
        insuranceType:'Off-Exchange Plan', 
        amount:'XXX.XX', 
        coverageDates:'XX/XX/XXXX-XX/XX/XXXX', 
        policyID:'XXXXXXXXX', 
        groupID:'XXXXXXXXX', 
        paymentID:'XXXXXXXXX', 
        pmtMethod:'ACH', 
        pmtStatus:'Recon', 
        PCA:'XXXXXX', 
        mailCode:'XXXX',   
        by: 'by',
      },
      {
        insuranceCarrier: 'Carrier Name',
        planName:'Plan Name', 
        insuranceType:'Off-Exchange Plan', 
        amount:'XXX.XX', 
        coverageDates:'XX/XX/XXXX-XX/XX/XXXX', 
        policyID:'XXXXXXXXX', 
        groupID:'XXXXXXXXX', 
        paymentID:'XXXXXXXXX', 
        pmtMethod:'ACH', 
        pmtStatus:'Recon', 
        PCA:'XXXXXX', 
        mailCode:'XXXX',   
        by: 'by',
      },
      {
        insuranceCarrier: 'Carrier Name',
        planName:'Plan Name', 
        insuranceType:'Off-Exchange Plan', 
        amount:'XXX.XX', 
        coverageDates:'XX/XX/XXXX-XX/XX/XXXX', 
        policyID:'XXXXXXXXX', 
        groupID:'XXXXXXXXX', 
        paymentID:'XXXXXXXXX', 
        pmtMethod:'ACH', 
        pmtStatus:'Recon', 
        PCA:'XXXXXX', 
        mailCode:'XXXX',   
        by: 'by',
      },
      {
        insuranceCarrier: 'Carrier Name',
        planName:'Plan Name', 
        insuranceType:'Off-Exchange Plan', 
        amount:'XXX.XX', 
        coverageDates:'XX/XX/XXXX-XX/XX/XXXX', 
        policyID:'XXXXXXXXX', 
        groupID:'XXXXXXXXX', 
        paymentID:'XXXXXXXXX', 
        pmtMethod:'ACH', 
        pmtStatus:'Recon', 
        PCA:'XXXXXX', 
        mailCode:'XXXX',   
        by: 'by',
      },
      {
        insuranceCarrier: 'Carrier Name',
        planName:'Plan Name', 
        insuranceType:'Off-Exchange Plan', 
        amount:'XXX.XX', 
        coverageDates:'XX/XX/XXXX-XX/XX/XXXX', 
        policyID:'XXXXXXXXX', 
        groupID:'XXXXXXXXX', 
        paymentID:'XXXXXXXXX', 
        pmtMethod:'ACH', 
        pmtStatus:'Recon', 
        PCA:'XXXXXX', 
        mailCode:'XXXX',   
        by: 'by',
      },
      {
        insuranceCarrier: 'Carrier Name',
        planName:'Plan Name', 
        insuranceType:'Off-Exchange Plan', 
        amount:'XXX.XX', 
        coverageDates:'XX/XX/XXXX-XX/XX/XXXX', 
        policyID:'XXXXXXXXX', 
        groupID:'XXXXXXXXX', 
        paymentID:'XXXXXXXXX', 
        pmtMethod:'ACH', 
        pmtStatus:'Recon', 
        PCA:'XXXXXX', 
        mailCode:'XXXX',   
        by: 'by',
      },
      {
        insuranceCarrier: 'Carrier Name',
        planName:'Plan Name', 
        insuranceType:'Off-Exchange Plan', 
        amount:'XXX.XX', 
        coverageDates:'XX/XX/XXXX-XX/XX/XXXX', 
        policyID:'XXXXXXXXX', 
        groupID:'XXXXXXXXX', 
        paymentID:'XXXXXXXXX', 
        pmtMethod:'ACH', 
        pmtStatus:'Recon', 
        PCA:'XXXXXX', 
        mailCode:'XXXX',   
        by: 'by',
      },
      {
        insuranceCarrier: 'Carrier Name',
        planName:'Plan Name', 
        insuranceType:'Off-Exchange Plan', 
        amount:'XXX.XX', 
        coverageDates:'XX/XX/XXXX-XX/XX/XXXX', 
        policyID:'XXXXXXXXX', 
        groupID:'XXXXXXXXX', 
        paymentID:'XXXXXXXXX', 
        pmtMethod:'ACH', 
        pmtStatus:'Recon', 
        PCA:'XXXXXX', 
        mailCode:'XXXX',   
        by: 'by',
      },
      
      
    ]);
  }

  loadReconcilePaymentBreakoutSummaryService(batchId: string, entityId: string): Observable<any> {
    return this.http.get<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/payment-batches/${batchId}/payment-entity/${entityId}/reconcile-summary`
    );
  }

  loadReconcilePaymentBreakoutListService(batchId: string, entityId: string, skipCount: number, maxResultCount: number, sort: string, sortType: string): Observable<any> {
    return this.http.get<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/payment-batches/${batchId}/payment-entity/${entityId}/reconcile-breakout?SortType=${sortType}&Sorting=${sort}&SkipCount=${skipCount}&MaxResultCount=${maxResultCount}`
    );
  }

  getMedicalClaimByPaymentRequestId(event : any)
  {
    return this.http.get<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}/case-management/MedicalClaim/Medicalclaim/${event}`
    )
  }

  searchcptcode(cptcode:string){
    return this.http.get<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}/case-management/MedicalClaim/cptcode/${cptcode}`
    )
  }

  searchPharmacies(searchText: string, typeCode: string) {
    return this.http.get<Pharmacy[]>(`${this.configurationProvider.appSettings.caseApiUrl}/case-management/pharmacies?searchText=${searchText}&typeCode=${typeCode}`);
  }

  loadClientBySearchText(text: string) {
    return this.http.get<ClientCase[]>(
      `${this.configurationProvider.appSettings.caseApiUrl}` +
      `/case-management/clients/SearchText=${text}`
    );
  }

  saveMedicalClaim(claim: any) {
    return this.http.post(`${this.configurationProvider.appSettings.caseApiUrl}/case-management/MedicalClaim`, claim)
  }
  
  updateMedicalClaim(claim: any) {
    return this.http.put(`${this.configurationProvider.appSettings.caseApiUrl}/case-management/MedicalClaim`, claim)
  }
}