/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
/** External libraries **/
import { of } from 'rxjs/internal/observable/of';
import { ConfigurationProvider } from '@cms/shared/util-core';
import { GridFilterParam } from '../../entities/grid-filter-param';
import { BatchPharmacyClaims } from '../../entities/financial-management/batch-pharmacy-claims';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FinancialPharmacyClaimsDataService {
  /** Constructor**/
  constructor(
    private readonly http: HttpClient,
    private readonly configurationProvider: ConfigurationProvider
  ) {}



  loadPharmacyClaimsProcessListService(params: GridFilterParam) {
    return this.http.post<any>(`${this.configurationProvider.appSettings.caseApiUrl}/financial-management/claims/pharmacies`, params);
  }

  loadPrescriptions(paymentId: string, params: GridFilterParam) {
    return this.http.get<any>(`${this.configurationProvider.appSettings.caseApiUrl}/financial-management/claims/pharmacies/payments/${paymentId}/prescriptions${params.convertToQueryString()}`);
  }
  batchClaims(batchPharmacyClaims: BatchPharmacyClaims) {
    return this.http.post(`${this.configurationProvider.appSettings.caseApiUrl}/financial-management/claims/pharmacy/payments/batches/batch`, batchPharmacyClaims);
  }
  deleteClaims(batchPharmacyClaims: BatchPharmacyClaims) {
      const options = {
        body: {
          paymentRequestIds: batchPharmacyClaims,
        }      
   }
    return this.http.delete(`${this.configurationProvider.appSettings.caseApiUrl}/financial-management/claims/pharmacy/payments`, options);
  }

  loadPharmacyClaimsBatchListService(params: GridFilterParam) {
    return this.http.post<any>(`${this.configurationProvider.appSettings.caseApiUrl}/financial-management/claims/pharmacies/batches`, params);
  }
  loadPharmacyClaimsAllPaymentsListService(params: any) {
    return this.http.post<any>(`${this.configurationProvider.appSettings.caseApiUrl}/financial-management/claims/pharmacies/payments`, params);
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

  loadReconcileListService(batchId:any,paginationParameters:any){
    return this.http.post(`${this.configurationProvider.appSettings.caseApiUrl}/financial-management/claims/pharmacy/payments/batches/${batchId}/reconcile-payments`,paginationParameters);
  }

  addPharmacyClaim(data: any) {
    return this.http.put<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/claims/pharmacies`,      data    );
  }

  updatePharmacyClaim(data: any) {
    return this.http.patch<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/claims/pharmacies`,      data    );
  }

  getPharmacyClaim(paymentRequestId: string) {
    return this.http.get<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/claims/pharmacies/${paymentRequestId}`);
  }

  unbatchEntireBatch(paymentRequestBatchId: string) {
    return this.http.post(`${this.configurationProvider.appSettings.caseApiUrl}/financial-management/claims/pharmacy/payments/batches/${paymentRequestBatchId}/unbatch`, null);
  }

  unbatchClaim(paymentRequestId: string) {
    return this.http.post(`${this.configurationProvider.appSettings.caseApiUrl}/financial-management/claims/pharmacy/payments/payment-requests/${paymentRequestId}/unbatch`, null);
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
    loadPaymentsByBatch(batchId: string, isReconciled: boolean, params:GridFilterParam, claimType:string){
    return this.http.post<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/claims/${claimType}/payment-batches/${batchId}/payments?isReconciled=${isReconciled}`, params);
  }
  loadPharmacyPrescriptionsServices(batchId: string, params:GridFilterParam, claimType:string){
    return this.http.post<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/claims/${claimType}/payments/${batchId}/prescriptions`, params);
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
      `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/claims/pharmacy/payments/recent-claims`,recentClaimsPageAndSortedRequestDto
    );
  }

  loadEachLetterTemplate(templateParams:any){
    return this.http.post(`${this.configurationProvider.appSettings.caseApiUrl}/financial-management/claims/pharmacy/payments/batches/print-advice-letter`,templateParams);
  }

  getPrintAdviceLetterData(selectedProviders: any) {
    return this.http.post<any>(`${this.configurationProvider.appSettings.caseApiUrl}/financial-management/claims/pharmacy/payments/batches/print-advice-letter-summary?isReconciled=${selectedProviders.isReconciled}`,selectedProviders);
  }

  viewPrintAdviceLetterData(printAdviceLetterData: any) {
    return this.http.post(
      `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/claims/pharmacy/payments/batches/download-advice-letter`, printAdviceLetterData,
      { responseType: 'blob' }
    );
  }

  reconcilePaymentsAndLoadPrintAdviceLetterContent(reconcileData: any) {
    return this.http.put(`${this.configurationProvider.appSettings.caseApiUrl}/financial-management/claims/pharmacy/payments/batches/all/reconcile-payments`,reconcileData);
  }

  loadReconcilePaymentBreakoutSummaryService(data:any): Observable<any> {
    const ReconcilePaymentResponseDto =
    {
      BatchId : data.batchId,
      EntityId : data.entityId,
      AmountTotal : data.amountTotal,
      WarrantTotal : data.warrantTotal,
      WarrantNbr : data.warrantNbr,
      PaymentToReconcileCount : data.paymentToReconcileCount,
      warrantCalculation:data.warrantCalculation,
      loadType:data.loadType
    }
    return this.http.post<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/claims/pharmacy/payments/reconcile-breakout-summary`,ReconcilePaymentResponseDto
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
      Filter : data.filter,
      loadType:data.loadType
    }
    return this.http.post<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/claims/pharmacy/payments/reconcile-breakout`,BreakoutPanelPageAndSortedRequestDto
    );
  }


  loadBatchName(batchId: string){
    return this.http.get<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/payment-batches/${batchId}`);
  }
}
