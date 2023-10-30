import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ConfigurationProvider } from "@cms/shared/util-core";

@Injectable({ providedIn: 'root' })
export class DrugDataService {
  constructor(private readonly http: HttpClient, private configurationProvider: ConfigurationProvider) {

  }

  addDrug(dto: any) {
    return this.http.post(
      `${this.configurationProvider.appSettings.caseApiUrl}` +
      `/case-management/drugs`,
      dto
    );
  }
}