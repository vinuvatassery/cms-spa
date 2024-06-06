/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
/** External libraries **/
/** Providers **/
import { ConfigurationProvider } from '@cms/shared/util-core';

/** Data services **/
import { Lov } from '../entities/lov';

@Injectable({ providedIn: 'root' })
export class LovDataService {
  /** Constructor **/
  constructor(private readonly http: HttpClient,
    private configurationProvider : ConfigurationProvider) {}

  /** Public methods **/
  getLovsbyType(lovType : string) {

    return this.http.get<Lov[]>(
        `${this.configurationProvider.appSettings.sysConfigApiUrl}`+
        `/system-config/lovs/${lovType}`
    );
  }

  getLovsbyTypes(lovType : string) {

    return this.http.get<Lov[]>(
        `${this.configurationProvider.appSettings.sysConfigApiUrl}`+
        `/system-config/lovs/types/${lovType}`
    );
  }

  getLovsbyParent(lovType : string ,parentCode : string) {

    return this.http.get<Lov[]>(
        `${this.configurationProvider.appSettings.sysConfigApiUrl}`+
        `/system-config/lovs/${lovType}/${parentCode}`
    );
  }
  getLovTypesbyTypes(lovType : string ) {

    return this.http.get<Lov[]>(
      `${this.configurationProvider.appSettings.sysConfigApiUrl}`+
      `/system-config/lovs/lovtypes/${lovType}`
  );
  }

  getReorderListByType(lovType : string) {
    return this.http.get<Lov[]>(
        `${this.configurationProvider.appSettings.sysConfigApiUrl}`+
        `/system-config/lovs/${lovType}/config/order`
    );
  }

  loadReorderList(orderTypeCode: string) {
    return this.http.get<any>(
      `${this.configurationProvider.appSettings.sysConfigApiUrl}`+
      `/system-config/lovs/${orderTypeCode}`
  );
  }
}
