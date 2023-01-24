/** Angular **/
import { Injectable } from '@angular/core';
/** External libraries **/
import { HttpClient } from '@angular/common/http';
import { ConfigurationProvider } from '@cms/shared/util-core';
import { PrescriptionDrug } from '../entities/prescription-drug';

@Injectable({ providedIn: 'root' })
export class PrescriptionDrugDataService {
  /** Constructor**/
  constructor(private readonly http: HttpClient, private readonly configurationProvider: ConfigurationProvider) { }

  /** Public methods **/
  updatePrescriptionDrugService(clientId: Number,prescriptionDrug: any) {
    return this.http.put(
      `${this.configurationProvider.appSettings.caseApiUrl}/case-management/clients/${clientId}/drugs`, prescriptionDrug);
  }
  
  loadPrescriptionDrug(clientId: Number, clientCaseEligibilityId: any) {
    return this.http.get<PrescriptionDrug>(
      `${this.configurationProvider.appSettings.caseApiUrl}/case-management/clients/${clientId}/drugs?clientCaseEligibilityId=${clientCaseEligibilityId}`);
  }

}
