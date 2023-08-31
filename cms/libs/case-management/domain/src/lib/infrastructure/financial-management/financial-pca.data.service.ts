/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
/** External libraries **/
import { ConfigurationProvider } from '@cms/shared/util-core';
import { GridFilterParam } from '../../entities/grid-filter-param';
import { PcaDetails } from '../../entities/financial-management/pca-details';

@Injectable({ providedIn: 'root' })
export class FinancialPcaDataService {
  /** Constructor**/
  constructor(
    private readonly http: HttpClient,
    private readonly configurationProvider: ConfigurationProvider
  ) {}

  loadFinancialPcaReassignmentListService(gridValuesInput:any) {
    return this.http.get<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/pca-reassignments`,gridValuesInput);
  }

  loadFinancialPcaReportListService(
    skipcount: number,
    maxResultCount: number,
    sort: string,
    sortType: string,
    filter: string
  ) {
    const PcaAssignmentsPageAndSortedRequestDto = {
      SortType: sortType,
      Sorting: sort,
      SkipCount: skipcount,
      MaxResultCount: maxResultCount,
      Filter: filter,
    };

    return this.http.post<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/pca-assignments/report`,
      PcaAssignmentsPageAndSortedRequestDto
    );
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
  pcaReassignmentCount(){
    return this.http.get<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/pca-reassignments/count`
    )
  }

  getPcaAssignmentById(pcaAssignmentId:any){
    return this.http.get<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/pca-reassignments/${pcaAssignmentId}`);
   }
}
