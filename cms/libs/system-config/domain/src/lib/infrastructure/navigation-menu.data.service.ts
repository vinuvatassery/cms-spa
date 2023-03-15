/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

/** Internal libraries **/
import { ConfigurationProvider } from '@cms/shared/util-core';
import { NavigationMenu } from '../entities/navigation-menu';

@Injectable({ providedIn: 'root' })
export class NavigationMenuService {
  /** Constructor **/
  constructor(private readonly http: HttpClient,
    private configurationProvider : ConfigurationProvider) {}

  /** Public methods **/
  getNavigationMenu() {
    return this.http.get<NavigationMenu[]>(
        `${this.configurationProvider.appSettings.sysConfigApiUrl}`+
        `/system-config/navigation-menus`
    );
  }
}
