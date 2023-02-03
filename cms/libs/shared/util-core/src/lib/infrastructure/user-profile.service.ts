import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigurationProvider } from '../api/providers/configuration.provider';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { LoggingService } from '../api/services/logging.service';
import { LoaderService } from '../application/services/app-loader.service';
@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  private getUserProfileData = new BehaviorSubject<any>([]);
  getProfile$ = this.getUserProfileData.asObservable();

  constructor(private readonly http: HttpClient,
    private configurationProvider: ConfigurationProvider,
    private readonly loaderService: LoaderService) { }


  showLoader() {
    this.loaderService.show();
  }

  hideLoader() {
    this.loaderService.hide();
  }

  getUserProfile() {
    this.showLoader();
    this.http.get(`${this.configurationProvider.appSettings.sysConfigApiUrl}/system-config/users/user-profile`).subscribe({
      next: (response: any) => {
        if (response) {
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
