import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigurationProvider } from '../api/providers/configuration.provider';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { LoaderService } from '../application/services/app-loader.service';
@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  private getUserProfileData = new BehaviorSubject<any>([]);
  getProfile$ = this.getUserProfileData.asObservable();
  private user: any;

  constructor(private readonly http: HttpClient,
    private configurationProvider: ConfigurationProvider,
    private readonly loaderService: LoaderService) { }


  showLoader() {
    this.loaderService.show();
  }

  hideLoader() {
    this.loaderService.hide();
  }

  getUserDetails()
  {
    return this.user;
  }

  getLogedinUserRoleCode()
  {
    return this.user?.roleCode;
  }

  getUserProfile() {
    this.showLoader();       
    if(this.user?.loginUserId)
    {
      this.getUserProfileData.next(this.user);
    }
    else
    {      
      this.http.get(`${this.configurationProvider.appSettings.sysConfigApiUrl}/system-config/users/user-profile`).subscribe({
        next: (response: any) => {
          if (response) {            
            this.user = response;
            this.getUserProfileData.next(response);
          }
          this.hideLoader();
        },
        error: (err: any) => {
          this.hideLoader();
        }
      });
    }
  }
}
