/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
/** External libraries **/
import { of } from 'rxjs/internal/observable/of';
import { ConfigurationProvider } from '@cms/shared/util-core';
import { ClientCase } from '../../entities/client-case';
import { Pharmacy } from '../../entities/client-pharmacy';
import { Observable } from 'rxjs';
import { GridFilterParam } from '../../entities/grid-filter-param';

@Injectable({ providedIn: 'root' })
export class FinancialVendorRefundDataService {
  /** Constructor**/
  constructor(
    private readonly http: HttpClient,
    private readonly configurationProvider: ConfigurationProvider
  ) {}

  addInsuranceRefundClaim(data:any){
    return this.http.post(`${this.configurationProvider.appSettings.caseApiUrl}/financial-management/vendor-refunds/insurance-refund`, data);
  }

  addTpaRefundClaim(data:any){
    return this.http.post(`${this.configurationProvider.appSettings.caseApiUrl}/financial-management/vendor-refunds/add-tpa-refund`, data);
  }

  updateTpaRefundClaim(data:any){
    return this.http.put(`${this.configurationProvider.appSettings.caseApiUrl}/financial-management/vendor-refunds/tpa-refund`, data);
  }


  getInsuranceRefundEditInformation(vendorId :any, clientId :any ,paginationSortingDto:any){
    return this.http.post(`${this.configurationProvider.appSettings.caseApiUrl}/financial-management/vendor-refunds/${vendorId}/insurance-premiums/${clientId}`, paginationSortingDto);
  }

  updateInsuranceRefundEditInformation(paginationSortingDto:any){
    return this.http.put(`${this.configurationProvider.appSettings.caseApiUrl}/financial-management/vendor-refunds/insurance-premiums`, paginationSortingDto);
  }

  getInsurnaceRefundInformation(insuranceRefundInformation:any){
    return this.http.post(`${this.configurationProvider.appSettings.caseApiUrl}/financial-management/vendor-refunds/insurance-premiums`, insuranceRefundInformation);
  }

  getTPaRefundInformation(tpaPaymentIds:any){
    return this.http.post(`${this.configurationProvider.appSettings.caseApiUrl}/financial-management/vendor-refunds/tpa/refund-information`, tpaPaymentIds);
  }

  getTpaEditRefundInformation(paymentRequestId :any){
    return this.http.post(`${this.configurationProvider.appSettings.caseApiUrl}/financial-management/vendor-refunds/${paymentRequestId}/tpa/refund-information`,null);

  }

  loadVendorRefundProcessListService( ) {
    return of([
      {
        vendorId:1,
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
        vendorId:2,
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
        vendorId:3,
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
  loadVendorRefundBatchListService(loadBatchListRequestDto : any ) {
    return this.http.post<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/vendor-refunds/batches`,loadBatchListRequestDto
    );
  }


  loadVendorRefundAllPaymentsListService(recentClaimsPageAndSortedRequestDto : any) {
       return this.http.post<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/vendor-refunds/payments`,recentClaimsPageAndSortedRequestDto
    );
  }


  loadBatchLogListService(loadBatchLogListRequestDto : any ,batchId : string) {
    return this.http.post<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/vendor-refunds/refund-batches/${batchId}/payments`,loadBatchLogListRequestDto
    );
  }

  loadClaimsListService( ) {
    return of([
      {
        invoiceId: '#213213213',
        providerName:'providerName',
        taxID:'234234',
        paymentMethod:'XXXX',
        serviceStartDate:'XX/XX/XXXX',
        serviceEndDate:'XX/XX/XXXX',
        serviceCost:'XXXX.XX',
        totalCost:'XXXX.XX',
        totalDue:'XXXX.XX',
        paymentStatus:'XXXX',
        pcaCode:'XXXXXX',
        entryDate:'XX/XX/XXXX',
        by: 'by',
      },
      {
        invoiceId: '#213213213',
        providerName:'providerName',
        taxID:'234234',
        paymentMethod:'XXXX',
        serviceStartDate:'XX/XX/XXXX',
        serviceEndDate:'XX/XX/XXXX',
        serviceCost:'XXXX.XX',
        totalCost:'XXXX.XX',
        totalDue:'XXXX.XX',
        paymentStatus:'XXXX',
        pcaCode:'XXXXXX',
        entryDate:'XX/XX/XXXX',
        by: 'by',
      },
      {
        invoiceId: '#213213213',
        providerName:'providerName',
        taxID:'234234',
        paymentMethod:'XXXX',
        serviceStartDate:'XX/XX/XXXX',
        serviceEndDate:'XX/XX/XXXX',
        serviceCost:'XXXX.XX',
        totalCost:'XXXX.XX',
        totalDue:'XXXX.XX',
        paymentStatus:'XXXX',
        pcaCode:'XXXXXX',
        entryDate:'XX/XX/XXXX',
        by: 'by',
      },


    ]);
  }


  loadPremiumsListService( ) {
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
  loadClientClaimsListService( ) {
    return of([
      {
        id:1,
        item:1,
        PharmacyName: 'XXXXXX XXXXXX',
        paymentMethod: 'paymentMethod',
        clientName:'XXXXXX XXXXXX XXXX',
        nameOnPrimaryInsuranceCard:'address2',
        clientId:'XXXXXX',
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
  loadPharmacyPaymentsListService( ) {
    return of([
      {
        id:1,
        item:1,
        PharmacyName: 'XXXXXX XXXXXX',
        paymentMethod: 'paymentMethod',
        clientName:'XXXXXX XXXXXX XXXX',
        nameOnPrimaryInsuranceCard:'address2',
        clientId:'XXXXXX',
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

  loadFinancialRefundProcessListService(skipcount: number,  maxResultCount: number,  sort: string,  sortType: string, filter : string) {
    const RefundPageAndSortedRequestDto =
    {
      sortType : sortType,
      sorting : sort,
      skipCount : skipcount,
      maxResultCount : maxResultCount,
      Filter : filter
    }
    return this.http.post<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/vendor-refunds`,
      RefundPageAndSortedRequestDto
    );
  }

  deleteRefunds(paymentRequestIds: string[]) {
    const options = {
      body: {
        paymentRequestIds: paymentRequestIds,
      }
    }
    return this.http.delete(`${this.configurationProvider.appSettings.caseApiUrl}/financial-management/vendor-refunds`,options);
  }

  batchRefunds(PaymentRequestIds: string[]) {
    return this.http.post(`${this.configurationProvider.appSettings.caseApiUrl}/financial-management/vendor-refunds/payment-requests/batch`, {PaymentRequestIds});
  }

  batchAllRefunds(filterParams: GridFilterParam) {
    return this.http.post(`${this.configurationProvider.appSettings.caseApiUrl}/financial-management/vendor-refunds/payment-requests/batch-all`, filterParams);
  }

  unbatchRefunds(paymentRequestIds: string[]) {
    return this.http.post(`${this.configurationProvider.appSettings.caseApiUrl}/financial-management/vendor-refunds/payment-requests/unbatch`, paymentRequestIds);
  }

  loadRefundClaimsService(data:any): Observable<any> {
    const ClaimsPageAndSortedRequestDto =
    {
      VendorId : data.vendorId,
      ClientId : data.clientId,
      refundType:data.refundType,
      SortType : data.sortType,
      Sorting : data.sort,
      SkipCount : data.skipCount,
      MaxResultCount : data.pageSize,
      Filter : data.filter
    }
    return this.http.post<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/claims/pharmacies/${data.clientId}/${data.vendorId}`,
      ClaimsPageAndSortedRequestDto
    );
  }
  loadClientBySearchText(text: string) {
    return this.http.get<ClientCase[]>(
      `${this.configurationProvider.appSettings.caseApiUrl}` +
        `/financial-management/claims/medical/clients/SearchText=${text}`
    );
  }
  loadPharmacyBySearchText(searchText: string , clientId:number) {
    return this.http.get<Pharmacy[]>(
      `${this.configurationProvider.appSettings.caseApiUrl}` +
        `/financial-management/claims/pharmacies/pharmacy/SearchText=${searchText}/${clientId}`
    );
  }
  loadTpavendorBySearchText(searchText: string,clientId:number) {
    return this.http.get<Pharmacy[]>(
      `${this.configurationProvider.appSettings.caseApiUrl}` +
  `/financial-management/claims/medical/tpa-vendor/SearchText=${searchText}/${clientId}`
    );
  }
  loadInsurancevendorBySearchText(searchText: string,clientId:number) {
    return this.http.get<Pharmacy[]>(
      `${this.configurationProvider.appSettings.caseApiUrl}` +
  `/financial-management/claims/medical/insurance-vendor/SearchText=${searchText}/${clientId}`
    );
  }
  loadMedicalPremiumList(data:any): Observable<any> {

    const ClaimsPageAndSortedRequestDto =
    {
      VendorId : data.vendorId,
      ClientId : data.clientId,
      SortType : data.sortType,
      Sorting : data.sort,
      SkipCount : data.skipCount,
      MaxResultCount : data.maxResultCount,
      Filter : data.filter
    }

      return this.http.post<any>(`${this.configurationProvider.appSettings.caseApiUrl}/financial-management/premiums/medical/vendors/${data.vendorId}/clients/${data.clientId}/refund-ins`,ClaimsPageAndSortedRequestDto);
  }
  loadTPARefundList(data:any): Observable<any> {

    const ClaimsPageAndSortedRequestDto =
    {
      VendorId : data.vendorId,
      ClientId : data.clientId,
      SortType : data.sortType,
      Sorting : data.sort,
      SkipCount : data.skipCount,
      MaxResultCount : data.pageSize,
      Filter : data.filter
    }
      return this.http.post<any>(`${this.configurationProvider.appSettings.caseApiUrl}/financial-management/premiums/medical/vendors/${data.vendorId}/clients/${data.clientId}/refund-tpa`,ClaimsPageAndSortedRequestDto);
  }

  loadTPARefundLists(data:any): Observable<any> {

    const ClaimsPageAndSortedRequestDto =
    {
      VendorId : data.vendorId,
      ClientId : data.clientId,
      SortType : data.sortType,
      Sorting : data.sort,
      SkipCount : data.skipCount,
      MaxResultCount : data.pageSize,
      Filter : data.filter
    }
      return this.http.post<any>(`${this.configurationProvider.appSettings.caseApiUrl}/financial-management/vendor-refunds/vendors/${data.vendorId}/clients/${data.clientId}/refund-tpa`,ClaimsPageAndSortedRequestDto);
  }

  loadFinancialRecentRefundListService(data:any):Observable<any> {
    const RefundPageAndSortedRequestDto =
    {
      VendorId : data.vendorId,
      ClientId : data.clientId,
      refundType:data.refundType,
      SortType : data.sortType,
      Sorting : data.sort,
      SkipCount : data.skipCount,
      MaxResultCount : data.pageSize,
      Filter : data.filter
    }
    return this.http.post<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/vendor-refunds/recent-refunds`,
      RefundPageAndSortedRequestDto
    );
  }
  addNewRefundRx(refundRx: any): any {
    return this.http.post(
      `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/vendor-refunds/add`,
      refundRx
    );
  }
  editNewRefundRx(refundRx: any): any {
    return this.http.post(
      `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/vendor-refunds/update `,
      refundRx
    );
  }
  loadPharmacyRefundEditList(paymentRequestId: string) {
    return this.http.get<any[]>(
      `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/vendor-refunds/pharmacy/${paymentRequestId}`
    );
  }
}
