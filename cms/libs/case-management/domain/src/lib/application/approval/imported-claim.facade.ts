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
  private updateExceptionModalSubject = new Subject<any>();
  /** Public properties **/
  approvalsImportedClaimsLists$ = this.ImportedClaimsSubject.asObservable();
  submitImportedClaims$ = this.submitImportedClaimsSubject.asObservable();
  possibleMatchData$ = this.possibleMatchSubject.asObservable();
  updateExceptionModalSubject$ = this.updateExceptionModalSubject.asObservable();

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
        this.possibleMatchSubject.next(response);
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
          this.showHideSnackBar(SnackBarNotificationType.SUCCESS, response.message);
        }
      },
      error: (err: any) => {
        this.hideLoader();
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err.message);
      }
    });
  }
}
