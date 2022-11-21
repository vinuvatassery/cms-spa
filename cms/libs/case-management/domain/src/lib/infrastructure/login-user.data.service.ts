/** Angular **/
import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';

/** Providers **/
import { ConfigurationProvider } from "@cms/shared/util-core";

/** Entities **/
import { LoginUser } from "../entities/login-user";


@Injectable({ providedIn: 'root' })
export class LoginUserDataService {
  /** Constructor**/
  constructor(private readonly http: HttpClient,
    private configurationProvider : ConfigurationProvider) {}

    getUsersByRole(roleCode : string) {
        return this.http.get<LoginUser[]>(
          `${this.configurationProvider.appSettings.sysConfigApiUrl}`+
          `/user-management/users/roleCode=${roleCode}`
        );
      }  

  }