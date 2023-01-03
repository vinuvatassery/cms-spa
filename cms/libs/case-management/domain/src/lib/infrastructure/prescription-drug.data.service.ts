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
    return this.http.put(
      `${this.configurationProvider.appSettings.caseApiUrl}` +
        `/case-management/prescription-drug/prescription`, prescriptionDrug
    );
  }
  FormData_append_object(fd: FormData, obj: any, key?: any) {
    var i, k;
    for (i in obj) {
      k = key ? key + '[' + i + ']' : i;
      if (obj[i] instanceof File) {
        continue;
      }
      else if (typeof obj[i] == 'object') {
        this.FormData_append_object(fd, obj[i], k);
      }
      else {
        fd.append(k, obj[i]);
        console.log(obj[i])
      }
    }
  }
  loadPrescriptionDrug(clientCaseEligibilityId:any){
    return this.http.get<PrescriptionDrug>(
      `${this.configurationProvider.appSettings.caseApiUrl}/case-management/prescription-drug?clientCaseEligibilityId=${clientCaseEligibilityId}`,);
  }

}
