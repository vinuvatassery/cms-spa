/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
/** Providers **/
import { ConfigurationProvider, LoaderService } from '@cms/shared/util-core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class CptCodeService {
  /** Constructor **/
  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
    private configurationProvider: ConfigurationProvider,
    private readonly loaderService: LoaderService
  ) {}

  showLoader() {
    this.loaderService.show();
  }

  hideLoader() {
    this.loaderService.hide();
  }

  loadCptCodeListsService(paginationParameters: any) {
    return this.http.post(`${this.configurationProvider.appSettings.sysConfigApiUrl}` + `/system-config/cpt-code/list`, paginationParameters);
  }

  addCptCode(cptCode: any) {
    return this.http.post(`${this.configurationProvider.appSettings.sysConfigApiUrl}` + `/system-config/cpt-code/`, cptCode);
  }
  
  editCptCode(cptCodeId: string, cptCode: any) {
    const body = {
      cptCode1: cptCode.cptCode1,
      serviceDesc: cptCode.serviceDesc,
      medicaidRate: cptCode.medicaidRate,
      brigeUppFlag: cptCode.brigeUppFlag
    }
    return this.http.put(`${this.configurationProvider.appSettings.sysConfigApiUrl}/system-config/cpt-code/${cptCodeId}`, body);
  }
  
  changeCptCodeStatus(cptCodeId: string, status: boolean) {
    const options = {
      status: status,
    }
    return this.http.patch(`${this.configurationProvider.appSettings.sysConfigApiUrl}/system-config/cpt-code/${cptCodeId}`, options);
  }

  checkHasPendingClaimsStatus(cptCodeId: string) {
    return this.http.get(`${this.configurationProvider.appSettings.sysConfigApiUrl}/system-config/cpt-code/${cptCodeId}`);
  }

}
