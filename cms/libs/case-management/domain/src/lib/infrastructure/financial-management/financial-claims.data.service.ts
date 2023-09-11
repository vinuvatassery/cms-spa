/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
/** External libraries **/
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
import { ConfigurationProvider } from '@cms/shared/util-core';
import { Pharmacy } from '../../entities/client-pharmacy';
import { ClientCase } from '../../entities/client-case';
import { BatchClaim } from '../../entities/financial-management/batch-claim';
import { GridFilterParam } from '../../entities/grid-filter-param';
import { ServiceSubTypeCode } from '../../enums/service-sub-type-code';

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

  loadFinancialClaimsAllPaymentsListService(skipcount: number, maxResultCount: number, sort: string, sortType: string, filter : string, claimsType : string) {
    const ClaimsAllPaymentsPageAndSortedRequestDto =
    {
      SortType : sortType,
      Sorting : sort,
      SkipCount : skipcount,
      MaxResultCount : maxResultCount,
      Filter : filter
    }

    return this.http.post<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/claims/${claimsType}/payments`,ClaimsAllPaymentsPageAndSortedRequestDto
    );
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

  loadReconcilePaymentBreakoutSummaryService(data:any): Observable<any> {
    const ReconcilePaymentResponseDto =
    {
      BatchId : data.batchId,
      EntityId : data.entityId,
      AmountTotal : data.amountTotal,
      WarrantTotal : data.warrantTotal,
      WarrantNbr : data.warrantNbr,
      PaymentToReconcileCount : data.paymentToReconcileCount
    }
    return this.http.post<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/claims/${data.claimsType}/payment-reconcile-summary`,ReconcilePaymentResponseDto
    );
  }

  loadReconcilePaymentBreakoutListService(data:any): Observable<any> {
    const BreakoutPanelPageAndSortedRequestDto =
    {
      BatchId : data.batchId,
      EntityId : data.entityId,
      SortType : data.sortType,
      Sorting : data.sort,
      SkipCount : data.skipCount,
      MaxResultCount : data.pageSize,
      Filter : data.filter
    }
    return this.http.post<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/claims/${data.claimsType}/payment-reconcile-breakout`,BreakoutPanelPageAndSortedRequestDto
    );
  }

  getMedicalClaimByPaymentRequestId(paymentRequestId: any, typeCode: string) {
    let path;
    if (typeCode == ServiceSubTypeCode.medicalClaim) {
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
    if (typeCode == ServiceSubTypeCode.medicalClaim) {
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
    if (typeCode == ServiceSubTypeCode.medicalClaim) {
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
    if (typeCode == ServiceSubTypeCode.medicalClaim) {
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
        paymentRequestIds: Claims,
      }
    }
    return this.http.delete(`${this.configurationProvider.appSettings.caseApiUrl}/financial-management/claims/${claimsType}`,options);
  }

  batchClaims(batchClaims: BatchClaim, claimsType: string) {
    return this.http.post(`${this.configurationProvider.appSettings.caseApiUrl}/financial-management/claims/${claimsType}/batch`, batchClaims);
  }

  unbatchEntireBatch(paymentRequestBatchIds: string[], claimsType: string) {
    return this.http.post(`${this.configurationProvider.appSettings.caseApiUrl}/financial-management/claims/${claimsType}/batches/unbatch`, paymentRequestBatchIds);
  }

  unbatchClaims(paymentRequestIds: string[], claimsType: string) {
    return this.http.post(`${this.configurationProvider.appSettings.caseApiUrl}/financial-management/claims/${claimsType}/payment-requests/unbatch`, paymentRequestIds);
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

  getPrintAdviceLetterData(batchId:any,selectedProviders: any, claimsType:any) {
    return this.http.post<any>(`${this.configurationProvider.appSettings.caseApiUrl}/financial-management/claims/${claimsType}/batches/${batchId}/print-advice-letter`,selectedProviders);
  }

  reconcilePaymentsAndLoadPrintAdviceLetterContent(batchId: any, reconcileData: any, claimsType:any) {
    return this.http.put(`${this.configurationProvider.appSettings.caseApiUrl}/financial-management/claims/${claimsType}/batches/${batchId}/reconcile-payments`,reconcileData);
  }

  viewPrintAdviceLetterData(batchId: any, printAdviceLetterData: any, claimsType:any) {
    return this.http.post(
      `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/claims/${claimsType}/batches/${batchId}/download-advice-letter`, printAdviceLetterData,
      { responseType: 'blob' }
    );
  }
  CheckExceededMaxBenefit(serviceCost: number, clientId: number, typeCode : string ) {
    let path;
    if (typeCode == ServiceSubTypeCode.medicalClaim) {
      path = 'financial-management/claims/medical';
    } else {
      path = 'financial-management/claims/dental';
    }
    return this.http.get(`${this.configurationProvider.appSettings.caseApiUrl}/${path}/exceeded-limit?servicesCost=${serviceCost}&clientId=${clientId}`
    );
  }
  CheckIneligibleException(startDtae: any,endDate: any, clientId: number, typeCode : string ) {
    let path;
    if (typeCode == ServiceSubTypeCode.medicalClaim) {
      path = 'financial-management/claims/medical';
    } else {
      path = 'financial-management/claims/dental';
    }
    return this.http.get(`${this.configurationProvider.appSettings.caseApiUrl}/${path}/check-ineligible?startDate=${startDtae}?endDate=${endDate}&clientId=${clientId}`
    );
  }
  checkBridgeUppEception(startDtae: any,endDate: any, clientId: number,cptCode:any, typeCode : string ) {
    let path;
    if (typeCode == ServiceSubTypeCode.medicalClaim) {
      path = 'financial-management/claims/medical';
    } else {
      path = 'financial-management/claims/dental';
    }
    return this.http.get(`${this.configurationProvider.appSettings.caseApiUrl}/${path}/check-bridge-upp?startDate=${startDtae}?endDate=${endDate}&clientId=${clientId}&cptCode=${cptCode}`
    );
  }
  checkDuplicatePaymentException(startDtae: any,endDate: any, vendorId: any,totalAmountDue:any, typeCode : string ) {
    let path;
    if (typeCode == ServiceSubTypeCode.medicalClaim) {
      path = 'financial-management/claims/medical';
    } else {
      path = 'financial-management/claims/dental';
    }
    return this.http.get(`${this.configurationProvider.appSettings.caseApiUrl}/${path}/check-duplicate-payment?startDate=${startDtae}?endDate=${endDate}&vendorId=${vendorId}&totalAmountDue=${totalAmountDue}`
    );
  }
}
