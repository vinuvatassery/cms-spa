/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
/** External libraries **/
import { of } from 'rxjs/internal/observable/of';
import { ConfigurationProvider } from '@cms/shared/util-core';
import { GridFilterParam } from '../../entities/grid-filter-param';
import { PcaDetails } from '../../entities/financial-management/pca-details';

@Injectable({ providedIn: 'root' })
export class FinancialPcaDataService {
  /** Constructor**/
  constructor(
    private readonly http: HttpClient,
    private readonly configurationProvider: ConfigurationProvider
  ) { }

  loadFinancialPcaAssignmentListService() {
    return of([
      {
        id: 1,
        priority: 1,
        pca: '123123`',
        object: 'Third Party',
        objectCode: '234234',
        amount: '43324342.33',
        openDate: 'MM/DD/YYYY',
        closeDate: 'MM/DD/YYYY',
        totalAmount: '43324342.33',
        amountUsed: '43324342.33',
        amountLeft: '43324342.33',
        isActive: true,
      },
      {
        id: 2,
        priority: 2,
        pca: '123123`',
        object: 'Third Party',
        objectCode: '234234',
        amount: '43324342.33',
        openDate: 'MM/DD/YYYY',
        closeDate: 'MM/DD/YYYY',
        totalAmount: '43324342.33',
        amountUsed: '43324342.33',
        amountLeft: '43324342.33',
        isActive: false,
      },

    ]);
  }
  loadFinancialPcaReassignmentListService() {
    return of([
      {
        batch: 'MMDDYYYY_XXX',
        vendor: 'Provider Name',
        type: 'TPA',
        clientName: 'FName LName',
        primaryInsurance: 'FName LName',
        memberID: 'FName LName',
        refundWarrant: 'address2',
        refundAmount: 'address2',
        depositDate: 'address2',
        depositMethod: 'address2',
        originalWarranty: 'XXXXXX',
        originalAmount: 'XXXXXX',
        indexCode: 'address2',
        pca: 'address2',
        grant: 'address2',
        vp: 'address2',
        refundNote: 'address2',
        entryDate: 'XX-XX-XXXX',
        by: 'by',
      },
      {
        batch: 'MMDDYYYY_XXX',
        vendor: 'Provider Name',
        type: 'TPA',
        clientName: 'FName LName',
        primaryInsurance: 'FName LName',
        memberID: 'FName LName',
        refundWarrant: 'address2',
        refundAmount: 'address2',
        depositDate: 'address2',
        depositMethod: 'address2',
        originalWarranty: 'XXXXXX',
        originalAmount: 'XXXXXX',
        indexCode: 'address2',
        pca: 'address2',
        grant: 'address2',
        vp: 'address2',
        refundNote: 'address2',
        entryDate: 'XX-XX-XXXX',
        by: 'by',
      },
      {
        batch: 'MMDDYYYY_XXX',
        vendor: 'Provider Name',
        type: 'TPA',
        clientName: 'FName LName',
        primaryInsurance: 'FName LName',
        memberID: 'FName LName',
        refundWarrant: 'address2',
        refundAmount: 'address2',
        depositDate: 'address2',
        depositMethod: 'address2',
        originalWarranty: 'XXXXXX',
        originalAmount: 'XXXXXX',
        indexCode: 'address2',
        pca: 'address2',
        grant: 'address2',
        vp: 'address2',
        refundNote: 'address2',
        entryDate: 'XX-XX-XXXX',
        by: 'by',
      },
      {
        batch: 'MMDDYYYY_XXX',
        vendor: 'Provider Name',
        type: 'TPA',
        clientName: 'FName LName',
        primaryInsurance: 'FName LName',
        memberID: 'FName LName',
        refundWarrant: 'address2',
        refundAmount: 'address2',
        depositDate: 'address2',
        depositMethod: 'address2',
        originalWarranty: 'XXXXXX',
        originalAmount: 'XXXXXX',
        indexCode: 'address2',
        pca: 'address2',
        grant: 'address2',
        vp: 'address2',
        refundNote: 'address2',
        entryDate: 'XX-XX-XXXX',
        by: 'by',
      },
    ]);
  }
  loadFinancialPcaReportListService() {
    return of([
      {
        vendorName: 'Address `',
        type: 'address2',
        clientName: 'address2',
        refundWarrant: 'address2',
        refundAmount: 'address2',
        depositDate: 'address2',
        depositMethod: 'address2',
        indexCode: 'address2',
        pca: 'address2',
        grant: 'address2',
        vp: 'address2',
        refundNote: 'address2',
        entryDate: 'address2',
        by: 'by',
      },
      {
        vendorName: 'Address `',
        type: 'address2',
        clientName: 'address2',
        refundWarrant: 'address2',
        refundAmount: 'address2',
        depositDate: 'address2',
        depositMethod: 'address2',
        indexCode: 'address2',
        pca: 'address2',
        grant: 'address2',
        vp: 'address2',
        refundNote: 'address2',
        entryDate: 'address2',
        by: 'by',
      },

    ]);
  }

  /* PCA setup */
  loadFinancialPcaSetupListService(params: GridFilterParam) {
    return this.http.post<any>(`${this.configurationProvider.appSettings.caseApiUrl}/financial-management/pca/search`, params);
  }

  loadPcaById(pcaId: string) {
    return this.http.get<any>(`${this.configurationProvider.appSettings.caseApiUrl}/financial-management/pca/${pcaId}`);
  }

  savePca(pcaModel: PcaDetails) {
    return this.http.post<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/pca`, pcaModel);
  }

  updatePca(pcaId: string, pcaModel: PcaDetails) {
    return this.http.put<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/pca/${pcaId}`, pcaModel);
  }

  deletePca(pcaId: string) {
    return this.http.delete<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/pca/${pcaId}`);
  }
}