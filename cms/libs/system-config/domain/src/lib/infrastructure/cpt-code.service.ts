/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
/** External libraries **/
import { of } from 'rxjs/internal/observable/of';
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
    debugger;
    return this.http.post(`${this.configurationProvider.appSettings.sysConfigApiUrl}` + `/system-config/cpt-code/`, cptCode);
  }
  

}
