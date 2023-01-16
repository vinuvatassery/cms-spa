/** Angular **/
import { Injectable } from '@angular/core';
/** External libraries **/
import { HttpClient } from '@angular/common/http';
import { ConfigurationProvider } from '@cms/shared/util-core';
import { PrescriptionDrug } from '../entities/prescription-drug';

@Injectable({ providedIn: 'root' })
export class PrescriptionDrugDataService {
  /** Constructor**/
  constructor(private readonly http: HttpClient, private readonly configurationProvider: ConfigurationProvider) {}

  /** Public methods **/
  updatePrescriptionDrugService(prescriptionDrug: any) {
    debugger;
    return this.http.put(
      `${this.configurationProvider.appSettings.caseApiUrl}` +
        `/case-management/drugs`, prescriptionDrug
    );
  }
  loadPrescriptionDrug(clientCaseEligibilityId:any){
    return this.http.get<PrescriptionDrug>(
      `${this.configurationProvider.appSettings.caseApiUrl}/case-management/drugs/`+ clientCaseEligibilityId);
  }

}
