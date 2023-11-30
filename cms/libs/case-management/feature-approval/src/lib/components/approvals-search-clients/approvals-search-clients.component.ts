import {
  ChangeDetectionStrategy,
  Component,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';
import { Router } from '@angular/router';
import { CaseFacade, FinancialClaimsFacade, ImportedClaimFacade } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { LoaderService, LoggingService, NotificationSnackbarService, SnackBarNotificationType } from '@cms/shared/util-core';
@Component({
  selector: 'productivity-tools-approvals-search-clients',
  templateUrl: './approvals-search-clients.component.html',

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApprovalsSearchClientsComponent {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  @Output() closeSearchClientsDialogClickedEvent = new EventEmitter<any>();
  @Output() clientValueChangeEvent = new EventEmitter<any>();

  @Input() selectedClaim: any;
  isShownSearchLoader = false;
  clientSearchResult$ = this.financialClaimsFacade.clients$;
  selectedClient: any;
  isButtonDisable = true;

  constructor(private readonly financialClaimsFacade: FinancialClaimsFacade,
    private readonly importedClaimFacade: ImportedClaimFacade,
    private readonly loggingService : LoggingService,
    private readonly notificationSnackbarService : NotificationSnackbarService,
    private readonly loaderService: LoaderService,
    private route: Router,
    private caseFacade : CaseFacade){}

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

  closeSearchCase() {
    this.closeSearchClientsDialogClickedEvent.emit();
  }

  onClientValueChange(client: any){
    this.selectedClient = client;
    this.isButtonDisable = false;
  }

  loadClientBySearchText(clientSearchText: any) {
    if (!clientSearchText || clientSearchText.length == 0) {
      return;
    }
    clientSearchText = clientSearchText.replace("/", "-");
    clientSearchText = clientSearchText.replace("/", "-");
    this.financialClaimsFacade.loadClientBySearchText(clientSearchText);
  }

  onClientSaveClick(){
    let importedclaimDto = {
      dateOfService: this.selectedClaim.dateOfService,
      clientId: this.selectedClient.clientId,
      policyId: this.selectedClaim.policyId,
      importedClaimId: this.selectedClaim.importedClaimId,
      invoiceExceptionId: this.selectedClaim.invoiceExceptionId,
      entityTypeCode: this.selectedClaim.entityTypeCode,
    }
    this.clientValueChangeEvent.emit(importedclaimDto);
  }

  subscribeToPolicyUpdate(){
    this.showLoader();
    this.importedClaimFacade.clientPolicyUpdate$.subscribe({
      next:(response: any) => {
        this.hideLoader();
        if(response.status){
          this.closeSearchCase();
        }
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)
      }
    });
  }

  onGoToProfileClick() {
    this.caseFacade.onClientProfileTabSelect("clt-info" ,this.selectedClient.clientId, this.selectedClient.clientCaseEligibilityId, this.selectedClient.clientCaseId);
    this.closeSearchCase();
  }

  onCancelClick(){
    this.closeSearchCase();
  }
}
