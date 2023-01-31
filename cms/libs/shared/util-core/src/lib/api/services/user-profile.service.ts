import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigurationProvider } from '../providers/configuration.provider';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {

  constructor(private readonly http: HttpClient,
    private configurationProvider: ConfigurationProvider) { }

  getUserProfile() {
   this.http.get(`${this.configurationProvider.appSettings.sysConfigApiUrl}/system-config/users/user-profile`).subscribe({
    next:(response:any)=>{
      debugger
      },
    error:(err:any)=>{
      debugger
    }
    });
  }
}
