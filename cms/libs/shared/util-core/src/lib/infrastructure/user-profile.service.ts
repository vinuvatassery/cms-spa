import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigurationProvider } from '../api/providers/configuration.provider';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { LoaderService } from '../application/services/app-loader.service';
import { OidcSecurityService } from '@cms/shared/util-core';
@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  private getUserProfileData = new BehaviorSubject<any>([]);
  getProfile$ = this.getUserProfileData.asObservable();
  userSubject!: BehaviorSubject<any>;

  constructor(private readonly http: HttpClient,
    private configurationProvider: ConfigurationProvider,
    private oidcSecurityService: OidcSecurityService,
    private readonly loaderService: LoaderService) { }


  showLoader() {
    this.loaderService.show();
  }

  hideLoader() {
    this.loaderService.hide();
  }

  getUserPermissons()
  {   
    return this.userSubject?.value?.permissions;
  }

  getUserData()
  {
    return this.userSubject?.value;
  }

  getUserProfile() {
    this.showLoader();
    this.http.get(`${this.configurationProvider.appSettings.sysConfigApiUrl}/system-config/users/user-profile`).subscribe({
      next: (response: any) => {
        if (response) {          
          this.getUserProfileData.next(response);          
          this.userSubject = new BehaviorSubject<any>(response);  
          this.userPhoto(response[0]);       
        }        
        this.hideLoader();
      },
      error: (err: any) => {
        this.hideLoader();
      }
    });
  }

  public userPhoto(response: any) {
    let url = `https://graph.microsoft.com/v1.0/users/${response.adUserId}/photo/$value`
    const headers = new HttpHeaders();
    let accessToken = '';
    this.oidcSecurityService.getAccessToken().subscribe(resp=>{
      accessToken = resp;
    });
    return this.http.get(url, {headers: {
      Authorization: `Bearer ${accessToken}`
    }, responseType: 'arraybuffer'}).subscribe(resp=>console.log(resp));
  }

}
