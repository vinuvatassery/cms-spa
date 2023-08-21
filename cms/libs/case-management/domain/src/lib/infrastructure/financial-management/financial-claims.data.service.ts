/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
/** External libraries **/
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
import { ConfigurationProvider } from '@cms/shared/util-core';
import { Pharmacy } from '../../entities/client-pharmacy';
import { ClientCase } from '../../entities/client-case';
import { FinancialProvider } from '../../enums/financial-provider.enum';
import { BatchClaim } from '../../entities/financial-management/batch-claim';
import { GridFilterParam } from '../../entities/grid-filter-param';

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
      `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/claims/${claimsType}`,
      MedicalClaimsPageAndSortedRequestDto
    );
  }

  loadFinancialClaimsInvoiceListService(paymentRequestId : string, skipcount: number,  maxResultCount: number,  sort: string,  sortType: string, claimsType : string) {

    return this.http.get<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/claims/${claimsType}/${paymentRequestId}/invoices?SortType=${sortType}&Sorting=${sort}&SkipCount=${skipcount}&MaxResultCount=${maxResultCount}`
    );
  }

  loadFinancialClaimsBatchListService(skipcount: number,  maxResultCount: number,  sort: string,  sortType: string, filter : string, claimsType : string ) {
    const MedicalClaimsBatchPageAndSortedRequestDto =
    {
      SortType : sortType,
      Sorting : sort,
      SkipCount : skipcount,
      MaxResultCount : maxResultCount,
      Filter : filter
    }

    return this.http.post<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/claims/${claimsType}/batches`,MedicalClaimsBatchPageAndSortedRequestDto
    );
  }
  loadFinancialClaimsAllPaymentsListService() {
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

  loadPaymentsByBatch(batchId: string, params:GridFilterParam, claimType:string){
    return this.http.post<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/claims/${claimType}/payment-batches/${batchId}/payments`, params);
  }

  loadBatchName(batchId: string){
    return this.http.get<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/payment-batches/${batchId}`);
  }

  loadServicesByPayment(paymentId: string, params:GridFilterParam, claimType:string){
    return this.http.post<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/claims/${claimType}/payments/${paymentId}/services`, params);
  }

  loadBatchItemsListService(paymentId: string, params: GridFilterParam, claimType:string){
    return this.http.post<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/claims/${claimType}/payments/${paymentId}/services?type=INDIVIDUAL`, params);
  }

  loadReconcileListService(batchId:any,claimsType:any,paginationParameters:any){
    return this.http.post(`${this.configurationProvider.appSettings.caseApiUrl}/financial-management/claims/${claimsType}/batches/${batchId}/reconcile-payments`,paginationParameters);
  }
  loadClaimsListService() {
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

  loadReconcilePaymentBreakoutSummaryService(
    batchId: string,
    entityId: string
  ): Observable<any> {
    return this.http.get<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/payment-batches/${batchId}/payment-entity/${entityId}/reconcile-summary`
    );
  }

  loadReconcilePaymentBreakoutListService(
    batchId: string,
    entityId: string,
    skipCount: number,
    maxResultCount: number,
    sort: string,
    sortType: string
  ): Observable<any> {
    return this.http.get<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/payment-batches/${batchId}/payment-entity/${entityId}/reconcile-breakout?SortType=${sortType}&Sorting=${sort}&SkipCount=${skipCount}&MaxResultCount=${maxResultCount}`
    );
  }

  getMedicalClaimByPaymentRequestId(paymentRequestId: any, typeCode: string) {
    let path;
    if (typeCode == FinancialProvider.MedicalProvider) {
      path = 'financial-management/claims/medical';
    } else {
      path = 'financial-management/claims/dental';
    }
    return this.http.get<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}/${path}/${paymentRequestId}`
    );
  }

  searchcptcode(cptcode: string) {
    return this.http.get<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/claims/medical/cpt-code/SearchText=${cptcode}`
    );
  }

  searchPharmacies(searchText: string, typeCode: string) {
    if (typeCode == FinancialProvider.MedicalProvider) {
      return this.http.get<Pharmacy[]>(
        `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/claims/medical/SearchText=${searchText}`
      );
    } else {
      return this.http.get<Pharmacy[]>(
        `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/claims/dental/SearchText=${searchText}`
      );
    }    
  }

  loadClientBySearchText(text: string) {
    return this.http.get<ClientCase[]>(
      `${this.configurationProvider.appSettings.caseApiUrl}` +
        `/financial-management/claims/medical/clients/SearchText=${text}`
    );
  }

  saveMedicalClaim(claim: any, typeCode: string) {
    let path;
    if (typeCode == FinancialProvider.MedicalProvider) {
      path = 'financial-management/claims/medical/save';
    } else {
      path = 'financial-management/claims/dental/save';
    }
    return this.http.post(
      `${this.configurationProvider.appSettings.caseApiUrl}/${path}`,
      claim
    );
  }

  updateMedicalClaim(claim: any, typeCode: string) {
    let path;
    if (typeCode == FinancialProvider.MedicalProvider) {
      path = 'financial-management/claims/medical';
    } else {
      path = 'financial-management/claims/dental';
    }
    return this.http.put(
      `${this.configurationProvider.appSettings.caseApiUrl}/${path}`,
      claim
    );
  }
  deleteClaims(Claims: any, claimsType: string) {
    const options = {
      body: {
        Claims: Claims,
      }
    }
    return this.http.delete(`${this.configurationProvider.appSettings.caseApiUrl}/financial-management/claims/${claimsType}`, options);
  }

  batchClaims(batchClaims: BatchClaim, claimsType: string) {
    return this.http.post(`${this.configurationProvider.appSettings.caseApiUrl}/financial-management/claims/${claimsType}/batch`, batchClaims);
  }
  loadRecentClaimListService(data:any): Observable<any> {  
    const recentClaimsPageAndSortedRequestDto =
    {
      VendorId : data.vendorId,
      ClientId : data.clientId,    
      SortType : data.sortType,
      Sorting : data.sort,
      SkipCount : data.skipCount,
      MaxResultCount : data.pageSize,
      Filter : data.filter
    }  
    return this.http.post<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/claims/${data.claimsType}/recent-claims`,recentClaimsPageAndSortedRequestDto
    );
  }
}
