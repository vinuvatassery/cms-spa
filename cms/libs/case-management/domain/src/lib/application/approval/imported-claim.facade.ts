import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { LoaderService, LoggingService, NotificationSnackbarService, SnackBarNotificationType } from '@cms/shared/util-core';
import { SortDescriptor } from '@progress/kendo-data-query';
import { ImportedClaimService } from '../../infrastructure/approval/imported-claim.data.service';

@Injectable({ providedIn: 'root' })
export class ImportedClaimFacade {

  public sortValueImportedClaimsAPproval = 'clientName';
  public sortImportedClaimsList: SortDescriptor[] = [{
    field: this.sortValueImportedClaimsAPproval,
  }];

  /** Private properties **/
  private ImportedClaimsSubject =  new Subject<any>();
  private submitImportedClaimsSubject = new Subject<any>();
  private possibleMatchSubject =  new Subject<any>();
  private clientPolicyUpdateSubject = new Subject<any>();
  /** Public properties **/
  approvalsImportedClaimsLists$ = this.ImportedClaimsSubject.asObservable();
  submitImportedClaims$ = this.submitImportedClaimsSubject.asObservable();
  possibleMatchData$ = this.possibleMatchSubject.asObservable();
  clientPolicyUpdate$ = this.clientPolicyUpdateSubject.asObservable();

  constructor(
    private readonly ImportedClaimService: ImportedClaimService,
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
    this.ImportedClaimService.loadImportedClaimsListServices(gridSetupData).subscribe(
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
    this.ImportedClaimService.submitImportedClaimsServices(claims).subscribe(
      {
        next: (response: any) => {
          this.hideLoader();
          this.notificationSnackbarService.manageSnackBar(
            SnackBarNotificationType.SUCCESS,
            response.message
          );
            this.submitImportedClaimsSubject.next(response);
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
    this.ImportedClaimService.loadPossibleMatch(event).subscribe({
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
    this.ImportedClaimService.savePossibleMatch(event).subscribe({
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

  updateClientPolicy(importedclaimDto : any){
    this.ImportedClaimService.updateClientPolicy(importedclaimDto).subscribe(
      {
        next: (response: any) => {
          this.clientPolicyUpdateSubject.next(response);
          this.notificationSnackbarService.manageSnackBar(
            SnackBarNotificationType.SUCCESS,
            response.message
          );
        },
        error: (err) => {
          this.showHideSnackBar(SnackBarNotificationType.ERROR , err)
        },
      }
    );
  }
}
