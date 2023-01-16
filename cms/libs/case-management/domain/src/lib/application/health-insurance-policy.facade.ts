/** Angular **/
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
/** Data services **/
import { SnackBar } from '@cms/shared/ui-common';
import { NotificationSnackbarService,SnackBarNotificationType,LoggingService,LoaderService } from '@cms/shared/util-core';
import { healthInsurancePolicy } from '../entities/health-insurance-policy';
import{HealthInsurancePolicyDataService} from '../infrastructure/health-insurance-policy.data.service';
import {
  fileInfo
} from '@cms/case-management/domain';


@Injectable({ providedIn: 'root' })
export class HealthInsurancePolicyFacade {

  /** Public properties **/
  snackbarMessage!: SnackBar;
  snackbarSubject = new Subject<SnackBar>();
  //healthInsurancePolicySubject = new Subject<SnackBar>();
  private healthInsurancePolicySubject = new Subject<healthInsurancePolicy>();
  healthFacadesnackbar$ = this.snackbarSubject.asObservable();
  healthInsurancePolicy$ = this.healthInsurancePolicySubject.asObservable();


  ShowHideSnackBar(type : SnackBarNotificationType , subtitle : any)
  {
    if(type == SnackBarNotificationType.ERROR)
    {
       const err= subtitle;
       this.loggingService.logException(err)
    }
    this.notificationSnackbarService.manageSnackBar(type,subtitle)
    this.HideLoader();

  }

  /** Constructor**/
  constructor( private readonly notificationSnackbarService : NotificationSnackbarService,
    private loggingService : LoggingService,private readonly loaderService: LoaderService,
   private healthInsurancePolicyService:HealthInsurancePolicyDataService) {}

  /** Public methods **/
  ShowLoader()
  {
    this.loaderService.show();
  }

  HideLoader()
  {
    this.loaderService.hide();
  }

  saveHealthInsurancePolicy(healthInsurancePolicy:any,insuranceCard:fileInfo,summaryFile:fileInfo) { 
    var healthInsuranceFormData = new FormData();
    for ( var key in healthInsurancePolicy ) {
      if(isNaN(Date.parse(healthInsurancePolicy[key])) || Date.parse(healthInsurancePolicy[key])<0){     
        if(healthInsurancePolicy[key] === null){
          healthInsuranceFormData.append(key, '');
        }
        else{
          healthInsuranceFormData.append(key, healthInsurancePolicy[key]);
        }
      }
      else{
        healthInsuranceFormData.append(key, (new Date(healthInsurancePolicy[key]).toLocaleDateString()));
      }
    }
    healthInsuranceFormData.append("insuranceCardFile", insuranceCard.file);
    healthInsuranceFormData.append("summaryFile", summaryFile.file);
    //healthInsuranceFormData = this.generateFormData(healthInsurancePolicy,insuranceCard,summaryFile);
    return this.healthInsurancePolicyService.saveHealthInsurancePolicy(healthInsuranceFormData);
  }
  updateHealthInsurancePolicy(healthInsurancePolicy:any,insuranceCard:fileInfo,summaryFile:fileInfo) {
    var healthInsuranceFormData = new FormData();
    for ( var key in healthInsurancePolicy ) {
      if(isNaN(Date.parse(healthInsurancePolicy[key])) || Date.parse(healthInsurancePolicy[key])<0){     
        if(healthInsurancePolicy[key] === null){
          healthInsuranceFormData.append(key, '');
        }
        else{
          healthInsuranceFormData.append(key, healthInsurancePolicy[key]);
        }
      }
      else{
        healthInsuranceFormData.append(key, (new Date(healthInsurancePolicy[key]).toLocaleDateString()));
      }
    }
    healthInsuranceFormData.append("insuranceCardFile", insuranceCard.file);
    healthInsuranceFormData.append("summaryFile", summaryFile.file);
    return this.healthInsurancePolicyService.updateHealthInsurancePolicy(healthInsuranceFormData);
  }

  generateFormData(healthInsurancePolicy:any,insuranceCard:fileInfo,summaryFile:fileInfo):FormData{
    var healthInsuranceFormData = new FormData();
    for ( var key in healthInsurancePolicy ) {
      if(isNaN(Date.parse(healthInsurancePolicy[key])) || Date.parse(healthInsurancePolicy[key])<0){     
        if(healthInsurancePolicy[key] === null){
          healthInsuranceFormData.append(key, '');
        }
        else{
          healthInsuranceFormData.append(key, healthInsurancePolicy[key]);
        }
      }
      else{
        healthInsuranceFormData.append(key, (new Date(healthInsurancePolicy[key]).toLocaleDateString()));
      }
    }
    healthInsuranceFormData.append("insuranceCardFile", insuranceCard.file);
    healthInsuranceFormData.append("summaryFile", summaryFile.file);
    return healthInsuranceFormData;
  }

  getCarrierContactInfo(carrierId:any)
  {
    return this.healthInsurancePolicyService.getCarrierContactInfo(carrierId);
  }

  getHealthInsurancePolicyById(clientInsurancePolicyId:string): void {
    this.healthInsurancePolicyService.getHealthInsurancePolicyById(clientInsurancePolicyId).subscribe({
      next: (response) => {
        this.healthInsurancePolicySubject.next(response);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

}
