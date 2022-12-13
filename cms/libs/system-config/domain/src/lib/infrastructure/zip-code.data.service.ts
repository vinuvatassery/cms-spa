/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

/** Internal libraries **/
import { ConfigurationProvider } from '@cms/shared/util-core';
import { State } from '../entities/state';
import { Counties } from '../entities/counties';

@Injectable({ providedIn: 'root' })
export class ZipCodeDataService {
  /** Constructor **/
  constructor(private readonly http: HttpClient,
    private configurationProvider : ConfigurationProvider) {}

  /** Public methods **/
  getSates() {
    return this.http.get<State[]>(
        `${this.configurationProvider.appSettings.sysConfigApiUrl}`+
        `/system-config/zip-code/states`
    );
  }

  getCounties(stateCode : string ) {
    return this.http.get<Counties[]>(
        `${this.configurationProvider.appSettings.sysConfigApiUrl}`+
        `/system-config/zip-code/states/${stateCode}/counties`
    );
  }
}
