/** Angular **/
import { Injectable } from '@angular/core';
import { Observable, of,Subject } from 'rxjs';
/** External libraries **/
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { ApplicantInfo } from '../entities/applicant-info';
/** Data services **/
import { ClientDataService } from '../infrastructure/client.data.service';
import { SnackBar } from '@cms/shared/ui-common';
import { NotificationSnackbarService,SnackBarNotificationType,LoggingService,LoaderService } from '@cms/shared/util-core';


@Injectable({ providedIn: 'root' })
export class ClientFacade {
  /** Private properties **/
  private ddlCaseOriginsSubject = new BehaviorSubject<any>([]);
  private ddlPrimaryIdentitiesSubject = new BehaviorSubject<any>([]);
  private ddlSpokenLanguagesSubject = new BehaviorSubject<any>([]);
  private ddlWrittenLanguagesSubject = new BehaviorSubject<any>([]);
  private ddlEnglishProficienciesSubject = new BehaviorSubject<any>([]);
  private ddlRacialIdentitiesSubject = new BehaviorSubject<any>([]);
  private rdoTransGendersSubject = new BehaviorSubject<any[]>([]);
  private rdoSexAssignedSubject = new BehaviorSubject<any[]>([]);
  private rdoMaterialsSubject = new BehaviorSubject<any[]>([]);
  private rdoInterpretersSubject = new BehaviorSubject<any[]>([]);
  private rdoDeafSubject = new BehaviorSubject<any[]>([]);
  private rdoBlindSubject = new BehaviorSubject<any[]>([]);
  private rdoWalkedSubject = new BehaviorSubject<any[]>([]);
  private rdoDressedorBathedSubject = new BehaviorSubject<any[]>([]);
  private rdoConcentrationSubject = new BehaviorSubject<any[]>([]);
  private rdoErrandsSubject = new BehaviorSubject<any[]>([]);
  private specialHandlingsSubject = new BehaviorSubject<any>([]);  
  appInfoFormSubject = new BehaviorSubject<any>([]);
  applicationInfoSubject = new BehaviorSubject<any>([]);
  pronounListSubject = new  BehaviorSubject<any>([]);

  /** Public properties **/
  ddlCaseOrigins$ = this.ddlCaseOriginsSubject.asObservable();
  ddlPrimaryIdentities$ = this.ddlPrimaryIdentitiesSubject.asObservable();
  ddlSpokenLanguages$ = this.ddlSpokenLanguagesSubject.asObservable();
  ddlWrittenLanguages$ = this.ddlWrittenLanguagesSubject.asObservable();
  ddlEnglishProficiencies$ = this.ddlEnglishProficienciesSubject.asObservable();
  ddlRacialIdentities$ = this.ddlRacialIdentitiesSubject.asObservable();
  rdoTransGenders$ = this.rdoTransGendersSubject.asObservable();
  rdoSexAssigned$ = this.rdoSexAssignedSubject.asObservable();
  rdoMaterials$ = this.rdoMaterialsSubject.asObservable();
  rdoInterpreters$ = this.rdoInterpretersSubject.asObservable();
  rdoDeaf$ = this.rdoDeafSubject.asObservable();
  rdoBlind$ = this.rdoBlindSubject.asObservable();
  rdoWalked$ = this.rdoWalkedSubject.asObservable();
  rdoDressedorBathed$ = this.rdoDressedorBathedSubject.asObservable();
  rdoConcentration$ = this.rdoConcentrationSubject.asObservable();
  rdoErrands$ = this.rdoErrandsSubject.asObservable();
  specialHandlings$ = this.specialHandlingsSubject.asObservable();
  appInfoForm$ = this.appInfoFormSubject.asObservable();
  applicantInfo$ = this.applicationInfoSubject.asObservable();
  pronounList$ = this.pronounListSubject.asObservable();

  snackbarMessage!: SnackBar;
  snackbarSubject = new Subject<SnackBar>();
  clientFacadesnackbar$ = this.snackbarSubject.asObservable();

  showHideSnackBar(type : SnackBarNotificationType , subtitle : any)
  {        
    if(type == SnackBarNotificationType.ERROR)
    {
       const err= subtitle;    
       this.loggingService.logException(err)
    }  
    this.notificationSnackbarService.manageSnackBar(type,subtitle)
    this.hideLoader();
       
  }

  /** Constructor**/
  constructor(private readonly clientDataService: ClientDataService,
    private readonly notificationSnackbarService : NotificationSnackbarService,
    private loggingService : LoggingService,
    private readonly loaderService: LoaderService) {}

  /** Public methods **/
  showLoader()
  {
    this.loaderService.show();
  }

  hideLoader()
  {
    this.loaderService.hide();
  }

  loadDdlCaseOrigin(): void {
    this.clientDataService.loadDdlCaseOrigin().subscribe({
      next: (ddlCaseOriginsResponse) => {
        this.ddlCaseOriginsSubject.next(ddlCaseOriginsResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  loadDdlPrimaryIdentities(): void {
    this.clientDataService.loadDdlPrimaryIdentities().subscribe({
      next: (ddlPrimaryIdentitiesResponse) => {
        this.ddlPrimaryIdentitiesSubject.next(ddlPrimaryIdentitiesResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  loadRdoTransGenders(): void {
    this.clientDataService.loadRdoTransGenders().subscribe({
      next: (rdoTransGendersResponse) => {
        this.rdoTransGendersSubject.next(rdoTransGendersResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  loadDdlSpokenLanguages(): void {
    this.clientDataService.loadDdlSpokenLanguages().subscribe({
      next: (ddlSpokenLanguagesResponse) => {
        this.ddlSpokenLanguagesSubject.next(ddlSpokenLanguagesResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  loadDdlWrittenLanguages(): void {
    this.clientDataService.loadDdlWrittenLanguages().subscribe({
      next: (ddlWrittenLanguagesResponse) => {
        this.ddlWrittenLanguagesSubject.next(ddlWrittenLanguagesResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  loadDdlEnglishProficiencies(): void {
    this.clientDataService.loadDdlEnglishProficiencies().subscribe({
      next: (ddlEnglishProficienciesResponse) => {
        this.ddlEnglishProficienciesSubject.next(
          ddlEnglishProficienciesResponse
        );
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  loadDdlRacialIdentities(): void {
    this.clientDataService.loadDdlRacialIdentities().subscribe({
      next: (ddlRacialIdentityOptionsResponse) => {
        this.ddlRacialIdentitiesSubject.next(ddlRacialIdentityOptionsResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  loadRdoSexAssigned(): void {
    this.clientDataService.loadRdoSexAssigned().subscribe({
      next: (rdoSexAssignedResponse) => {
        this.rdoSexAssignedSubject.next(rdoSexAssignedResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  loadRdoMaterials(): void {
    this.clientDataService.loadRdoMaterials().subscribe({
      next: (rdoMaterialsResponse) => {
        this.rdoMaterialsSubject.next(rdoMaterialsResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  loadRdoInterpreter(): void {
    this.clientDataService.loadRdoInterpreter().subscribe({
      next: (rdoInterpreterResponse) => {
        this.rdoInterpretersSubject.next(rdoInterpreterResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  loadRdoDeaf(): void {
    this.clientDataService.loadRdoDeaf().subscribe({
      next: (rdoDeafResponse) => {
        this.rdoDeafSubject.next(rdoDeafResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  loadRdoBlind(): void {
    this.clientDataService.loadRdoBlind().subscribe({
      next: (rdoBlindResponse) => {
        this.rdoBlindSubject.next(rdoBlindResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  loadRdoWalking(): void {
    this.clientDataService.loadRdoWalking().subscribe({
      next: (rdoWalkingResponse) => {
        this.rdoWalkedSubject.next(rdoWalkingResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  loadRdoDressingorBathing(): void {
    this.clientDataService.loadRdoDressingOrBathing().subscribe({
      next: (rdoDressingorBathingResponse) => {
        this.rdoDressedorBathedSubject.next(rdoDressingorBathingResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  loadRdoConcentration(): void {
    this.clientDataService.loadRdoConcentration().subscribe({
      next: (rdoConcentrationDataResponse) => {
        this.rdoConcentrationSubject.next(rdoConcentrationDataResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  loadRdoErrands(): void {
    this.clientDataService.loadRdoErrands().subscribe({
      next: (rdoErrandsResponse) => {
        this.rdoErrandsSubject.next(rdoErrandsResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  loadSpecialHandlings(): void {
    this.clientDataService.loadSpecialHandlings().subscribe({
      next: (specialHandlingsResponse) => {
        this.specialHandlingsSubject.next(specialHandlingsResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }
  save(applicantInfo:ApplicantInfo) {
      return this.clientDataService.save(applicantInfo);
  }
  load(clientCaseId:any,eligibilityId:any) {
      return this.clientDataService.load(clientCaseId,eligibilityId);
  }
  update(applicantInfo:ApplicantInfo) {
    return this.clientDataService.update(applicantInfo);
  }
}
