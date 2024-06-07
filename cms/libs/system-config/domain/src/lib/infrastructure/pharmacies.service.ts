/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
/** Providers **/
import { ConfigurationProvider, LoaderService } from '@cms/shared/util-core';

@Injectable({ providedIn: 'root' })
export class PharmaciesService {
  /** Constructor **/
  constructor(
    private readonly http: HttpClient,
    private configurationProvider: ConfigurationProvider,
    private readonly loaderService: LoaderService
  ) {}

  showLoader() {
    this.loaderService.show();
  }

  hideLoader() {
    this.loaderService.hide();
  }

  loadPharmaciesListsService(paginationParameters: any) {
    return this.http.post(`${this.configurationProvider.appSettings.sysConfigApiUrl}` + `/system-config/pharmacy/list`, paginationParameters);
  }

}
