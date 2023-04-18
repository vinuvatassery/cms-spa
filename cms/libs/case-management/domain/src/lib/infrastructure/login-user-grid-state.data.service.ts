import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ConfigurationProvider } from "@cms/shared/util-core";
import { LoginUserGridState } from "../entities/login-user-grid-state";

@Injectable({ providedIn: 'root' })
export class LoginUserGridStateDataService {
  constructor(private readonly http: HttpClient, private configurationProvider: ConfigurationProvider) {

  }


  loadLoginUserGridState() {
    return this.http.get<LoginUserGridState>(
      `${this.configurationProvider.appSettings.caseApiUrl}/case-management//login-user-grid-state`);
  }
  createLoginUserGridState(loginUserGridState: LoginUserGridState) {
    return this.http.post<LoginUserGridState>(
      `${this.configurationProvider.appSettings.caseApiUrl}/case-management/login-user-grid-state`,
      loginUserGridState,

    )
  }
}