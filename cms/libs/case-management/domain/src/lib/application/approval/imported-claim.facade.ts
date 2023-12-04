import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { LoaderService, LoggingService, NotificationSnackbarService, SnackBarNotificationType } from '@cms/shared/util-core';
import { SortDescriptor } from '@progress/kendo-data-query';
import { ImportedClaimService } from '../../infrastructure/approval/imported-claim.data.service';

@Injectable({ providedIn: 'root' })
export class ImportedClaimFacade {

  public sortType = 'desc';
  public sortValueImportedClaimsApproval = 'entryDate';
  public sortImportedClaimsList: SortDescriptor[] = [{
    field: this.sortValueImportedClaimsApproval,
    dir: 'desc',
  }];

  /** Private properties **/
  private ImportedClaimsSubject =  new Subject<any>();
  private submitImportedClaimsSubject = new Subject<any>();
  private possibleMatchSubject =  new Subject<any>();
  private savePossibleMatchSubject =  new Subject<any>();
  private clientPolicyUpdateSubject = new Subject<any>();
  private updateExceptionModalSubject = new Subject<any>();
  private importedClaimsCountSubject = new Subject<any>();
  private clientSearchLoaderVisibilitySubject = new Subject<boolean>;
  public clientSubject = new Subject<any>();
  /** Public properties **/
  approvalsImportedClaimsLists$ = this.ImportedClaimsSubject.asObservable();
  submitImportedClaims$ = this.submitImportedClaimsSubject.asObservable();
  possibleMatchData$ = this.possibleMatchSubject.asObservable();
  savePossibleMatchData$ = this.savePossibleMatchSubject.asObservable();
  updateExceptionModalSubject$ = this.updateExceptionModalSubject.asObservable();
  clientPolicyUpdate$ = this.clientPolicyUpdateSubject.asObservable();
  importedClaimsCount$ = this.importedClaimsCountSubject.asObservable();
  clientSearchLoaderVisibility$= this.clientSearchLoaderVisibilitySubject.asObservable();  
  clients$ = this.clientSubject.asObservable();


  constructor(
    private readonly importedClaimService: ImportedClaimService,
    private readonly loggingService : LoggingService,
    private readonly notificationSnackbarService : NotificationSnackbarService,
    private readonly loaderService: LoaderService,
  ) {

  }

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

  showLoader()
  {
    this.loaderService.show();
  }

  hideLoader()
  {
    this.loaderService.hide();
  }

  loadImportedClaimsLists(gridSetupData: any) {
    this.importedClaimService.loadImportedClaimsListServices(gridSetupData).subscribe(
      {
        next: (dataResponse: any) => {
          const gridView = {
            data: dataResponse["items"],
            total: dataResponse["totalCount"]
          };
            this.ImportedClaimsSubject.next(gridView);
        },
        error: (err) => {
          this.showHideSnackBar(SnackBarNotificationType.ERROR , err)
        },
      }
    );
  }

  submitImportedClaims(claims: any) {
    this.showLoader();
    this.importedClaimService.submitImportedClaimsServices(claims).subscribe(
      {
        next: (response: any) => {
          this.hideLoader();
          this.notificationSnackbarService.manageSnackBar(
            SnackBarNotificationType.SUCCESS,
            response.message
          );
            this.submitImportedClaimsSubject.next(response);
            this.importedClaimsCountSubject.next(response);
        },
        error: (err) => {
          this.hideLoader();
          this.showHideSnackBar(SnackBarNotificationType.ERROR , err)
        },
      }
    );
  }

  loadPossibleMatch(event:any) {
    this.showLoader();
    this.importedClaimService.loadPossibleMatch(event).subscribe({
      next: (response: any) => {
        this.possibleMatchSubject.next(response);
        this.hideLoader();
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        this.hideLoader();
      },
    });
  }

  savePossibleMatch(event: any) {
    this.showLoader();
    this.importedClaimService.savePossibleMatch(event).subscribe({
      next: (response: any) => {
        this.hideLoader();
        if(response.status == 1)
        {
          this.showHideSnackBar(SnackBarNotificationType.SUCCESS,response.message);
        }
        else
        {
          this.showHideSnackBar(SnackBarNotificationType.WARNING,response.message);
        }
        this.savePossibleMatchSubject.next(response);
        this.importedClaimsCountSubject.next(response);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        this.hideLoader();
      },
    });
  }

  makeExceptionForExceedBenefits(exceptionObject: any) {
    this.showLoader();
    this.importedClaimService.makeExceptionForExceedBenefits(exceptionObject).subscribe({
      next: (response: any) => {
        if (response) {
          this.hideLoader();
          this.updateExceptionModalSubject.next(response);
          this.importedClaimsCountSubject.next(response);
          this.showHideSnackBar(SnackBarNotificationType.SUCCESS, response.message);
        }
      },
      error: (err: any) => {
        this.hideLoader();
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err.message);
      }
    });
  }

  updateClientPolicy(importedclaimDto : any){
    this.showLoader();
    this.importedClaimService.updateClientPolicy(importedclaimDto).subscribe(
      {
        next: (response: any) => {
          this.hideLoader();
          this.clientPolicyUpdateSubject.next(response);
          this.importedClaimsCountSubject.next(response);
          this.notificationSnackbarService.manageSnackBar(
            SnackBarNotificationType.SUCCESS,
            response.message
          );
        },
        error: (err) => {
          this.hideLoader();
          this.showHideSnackBar(SnackBarNotificationType.ERROR , err)
        },
      }
    );
  }

  loadClientBySearchText(text : string): void {
    this.clientSearchLoaderVisibilitySubject.next(true);
    if(text){
      this.importedClaimService.loadClientBySearchText(text).subscribe({

        next: (caseBySearchTextResponse) => {
          this.clientSubject.next(caseBySearchTextResponse);
          this.clientSearchLoaderVisibilitySubject.next(false);
        },
        error: (err) => {
          this.showHideSnackBar(SnackBarNotificationType.ERROR , err)
        },
      });
    }
    else{
      this.clientSubject.next(null);
      this.clientSearchLoaderVisibilitySubject.next(false);
    }
  }

}
