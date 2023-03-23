import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigurationProvider } from '../api/providers/configuration.provider';
import { LoaderService } from '../application/services/app-loader.service';
@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
 

  constructor(private readonly http: HttpClient,
    private configurationProvider: ConfigurationProvider,
    private readonly loaderService: LoaderService) { }




  getUserProfile() {  
   return this.http.get(`${this.configurationProvider.appSettings.sysConfigApiUrl}/system-config/users/user-profile`)
  }
}
