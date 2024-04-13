/** Angular **/
import { Injectable } from '@angular/core';
/** External Libraries **/
import { Observable, Subject } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

/** Internal Libraries **/
import { NotificationSnackbarService, SnackBarNotificationType, LoggingService, LoaderService } from '@cms/shared/util-core';
import { ClientHivVerification } from '../entities/client-hiv-verification';
import { VerificationDataService } from '../infrastructure/verification.data.service';

@Injectable({ providedIn: 'root' })
export class VerificationFacade {

  /** Private properties **/
  hivVerificationSaveSubject = new Subject<boolean>();
  private removeHivVerificationAttachmentSubject = new Subject<any>();
  private clientHivDocumentsListSubject = new Subject<any>();
  hivVerificationUploadedDocument = new Subject<any>();
  showAttachmentOptions = new BehaviorSubject<boolean>(false);
  showHideAttachment = new BehaviorSubject<boolean>(false);
  isSaveandContinueSubject = new BehaviorSubject<boolean>(true);
  formChangeEventSubject = new BehaviorSubject<boolean>(false);


  /** Public properties **/
  hivVerificationSave$ = this.hivVerificationSaveSubject.asObservable();
  showAttachmentOptions$ = this.showAttachmentOptions.asObservable();
  showHideAttachment$ = this.showHideAttachment.asObservable();
  hivUploadedDocument$ = this.hivVerificationUploadedDocument.asObservable();
  clientHivDocumentsList$ = this.clientHivDocumentsListSubject.asObservable();
  isSaveandContinue$ = this.isSaveandContinueSubject.asObservable();
  formChangeEvent$ = this.formChangeEventSubject.asObservable();




  constructor(private readonly verificationDataService: VerificationDataService,
    private readonly loaderService: LoaderService,
    private readonly notificationSnackbarService: NotificationSnackbarService,
    private readonly loggingService: LoggingService) { }

  showHideSnackBar(type: SnackBarNotificationType, subtitle: any) {
    if (type == SnackBarNotificationType.ERROR) {
      const err = subtitle;
      this.loggingService.logException(err)
    }
    this.notificationSnackbarService.manageSnackBar(type, subtitle)
    this.hideLoader();

  }
  showLoader() {
    this.loaderService.show();
  }

  hideLoader() {
    this.loaderService.hide();
  }
  private providerChange = new Subject<string>();

  /** Public properties **/
  providerValue$ = this.providerChange.asObservable();
  removeHivVerification$ = this.removeHivVerificationAttachmentSubject.asObservable();

  providerValueChange(provider: string) {
    this.providerChange.next(provider);
  }
  save(clientHivVerification: FormData): Observable<any> {
    return this.verificationDataService.save(clientHivVerification);
  }
  getHivVerification(clientId:any){
    return this.verificationDataService.getHivVerification(clientId);
  }
  removeHivVerificationAttachment(hivVerificationId:any, clientId:any){
    this.showLoader();
    this.verificationDataService.removeHivVerificationAttachment(hivVerificationId,clientId).subscribe({
      next: (response: any) => {
        if (response) {
          this.removeHivVerificationAttachmentSubject.next(response);
          this.showHideSnackBar(SnackBarNotificationType.SUCCESS, "HIV Verification attachment removed Successfully");
        }
        this.hideLoader()
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        this.hideLoader();
      },
    });
  }

  saveHivVerification(clientHivVerification: ClientHivVerification): Observable<any> {
    return this.verificationDataService.saveHivVerification(clientHivVerification);
  }
  getHivVerificationWithAttachment(clientId:any, clientCaseEligibilityId : any){
    return this.verificationDataService.getHivVerificationWithAttachment(clientId, clientCaseEligibilityId);
  }
  getClientHivDocuments(clientId:any): void{
    this.verificationDataService.getClientHivDocuments(clientId).subscribe({
      next: (response) => {
        this.clientHivDocumentsListSubject.next(response);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err)
      }
    });
  }

  loadHealthCareProviders(clientId : number,skipcount : number,maxResultCount : number ,sort : string, sortType : string, showDeactivated = false) {
    return this.verificationDataService.loadHealthCareProviders(clientId , skipcount ,maxResultCount  ,sort , sortType, showDeactivated);
  }
}
