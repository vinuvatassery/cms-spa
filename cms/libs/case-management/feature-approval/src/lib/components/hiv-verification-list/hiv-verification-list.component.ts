import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CommunicationEventTypeCode, HivVerificationApprovalFacade } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { DocumentFacade, NotificationSnackbarService, NotificationSource, SnackBarNotificationType } from '@cms/shared/util-core';
import { DialogService } from '@progress/kendo-angular-dialog';

@Component({
  selector: 'case-management-hiv-verification-list',
  templateUrl: './hiv-verification-list.component.html',
  styleUrls: ['./hiv-verification-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HivVerificationListComponent implements OnInit {

  @ViewChild('submitRequestModalDialog', { read: TemplateRef })
  submitRequestModalDialog!: TemplateRef<any>;
  
  /** Output Properties **/
  @Output() getHivVerification = new EventEmitter<any>();
  @Output() saveHivVerificationApproval = new EventEmitter<any>();
  @Output() selectedItemEligibilityIdSet = new EventEmitter<any>();

  /** Input Properties **/
  @Input() hivVerificationApproval$: any;

  hivVerificationApproval:any;
  tAreaCessationMaxLength: any = 250;
  acceptStatus: string = 'ACCEPT';
  rejectStatus: string = 'REJECT';
  hasDisabledSubmit = true;
  formValid = true;
  submit ="SUBMIT";
  saveToApplication="SAVED TO APPLICATION"
  submitButtonText:any ="SUBMIT"
  toSave:
  {
    clientHivVerificationId: any,
    status: any,
    reasonForRejection: any,
    assignedCwName :any,
    templateTypeCode:any,
    resentEmail:any,
    clientId:any
    eligibilityId:any
  } = {
    clientHivVerificationId: undefined,
    status: undefined,
    reasonForRejection: undefined,
    assignedCwName: undefined,
    templateTypeCode:undefined,
    resentEmail:undefined,
    clientId:undefined,
    eligibilityId:undefined
  };

  private submitRequestDialogService: any;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  
    /** Constructor **/
    constructor(private readonly cd: ChangeDetectorRef, private readonly router: Router,
      public readonly documentFacade: DocumentFacade, 
      private dialogService: DialogService, private notificationSnackbarService: NotificationSnackbarService){}
    
  ngOnInit(): void {
    this.getHivVerification.emit(true);
    this.hivVerificationApproval$.subscribe((response:any)=>{
      this.hivVerificationApproval = response;
      this.tAreaVariablesInitiation(this.hivVerificationApproval );
      this.cd.detectChanges();
    });
  }

  /** Public Methods **/
  onRowLevelStatusChange(event:any, item:any,status:any){
    item.reasonForRejectionInValid = false;
    if(status === this.rejectStatus) {
      this.submitButtonText = this.submit;
      item.resentEmail = true;
      if(item.status === this.rejectStatus){
        item.status = '';
        item.toSave = false;
      }
      else{
        item.status = status;
        item.toSave = true;
      }
    }
    if(status === this.acceptStatus) {
      this.submitButtonText = this.saveToApplication;
      if(item.status === this.acceptStatus){
        item.status = '';
        item.toSave = false;
      }
      else{
        item.status = status;
        item.toSave = true;
      }  
    }
    if(item.reasonForRejection === undefined){
      item.reasonForRejection = '';
    } 

    this.hivVerificationApproval.filter((x:any)=> {
      if(x.clientHivVerificationId != item.clientHivVerificationId){
        x.status = '';
        x.toSave = false;
      }
    });
    this.hasDisabledSubmit = !(this.hivVerificationApproval.filter((x:any)=> x.toSave).length>0);
    
  }

  onPanelExpand(item: any){   
      item.isExpanded = true;
  }

  calculateCharacterCount(dataItem: any) {
    dataItem.reasonForRejectionInValid = false;
    let tAreaCessationCharactersCount = dataItem.reasonForRejection
      ? dataItem.reasonForRejection.length
      : 0;
    dataItem.tAreaCessationCounter = `${tAreaCessationCharactersCount}/${this.tAreaCessationMaxLength}`;
  }

  navigateIncompleteApplication(item : any){
    this.selectedItemEligibilityIdSet.emit(item.clientCaseEligibilityId);
    
  }

  openInNewTabOrDownload(View: boolean , item : any){
    if(item.documentId !== null){
      this.documentFacade.viewOrDownloadFile(View,item.documentId,item.fileName)
    }
    else{
      this.notificationSnackbarService.manageSnackBar(SnackBarNotificationType.ERROR, 
        'Not found any attached documents.', NotificationSource.UI);
    }
  }

  onSubmitHivVerificationOtherTab(){
    this.formValid = true;
    this.validateItems();  
    let saveItems = this.hivVerificationApproval.filter((x:any)=> x.toSave);
    this.formValid =   !(saveItems.filter((x:any) => x.reasonForRejectionInValid).length>0);   
    if(this.formValid){
      this.onSubmitConfirmClicked(this.submitRequestModalDialog);     
    }   
  }

  validateItems() {
    this.hivVerificationApproval.filter((x: any) => {
      if (x.status === this.rejectStatus) {
        if (x.reasonForRejection === '' || x.reasonForRejection === undefined) {
          x.reasonForRejectionInValid = true;
        }
      }
      else {
        x.reasonForRejectionInValid = false;
        x.reasonForRejection = '';
      }
    })
  }

  saveHivVerification() {
    let saveItems = this.hivVerificationApproval.filter((x: any) => x.toSave);
    this.toSave.clientHivVerificationId = saveItems[0].clientHivVerificationId;
    this.toSave.reasonForRejection = saveItems[0].reasonForRejection;
    this.toSave.status = saveItems[0].status;
    this.toSave.assignedCwName = saveItems[0].assignedCwName;
    this.toSave.resentEmail = saveItems[0].resentEmail?? false;
    this.toSave.templateTypeCode = this.getTemplateTypeCode( saveItems[0].status);
    this.toSave.clientId =  saveItems[0].clientId;
    this.toSave.eligibilityId = saveItems[0].clientCaseEligibilityId;
    this.saveHivVerificationApproval.emit(this.toSave);
    this.onCloseSubmitConfirmClicked();
  }

  getTemplateTypeCode(status: any): string {
    let templateTypeCode = '';
    switch (status) {
      case this.acceptStatus:
        templateTypeCode = CommunicationEventTypeCode.HivVerificationAccepted;
        break;
      case this.rejectStatus:
        templateTypeCode = CommunicationEventTypeCode.HivVerificationRejected;
        break;

    }
    return templateTypeCode;
  }

  ngDirtyInValid(dataItem: any, control: any, rowIndex: any) {
    let inValid = false;
    if (control === 'reasonForRejection') {
      inValid = dataItem.reasonForRejectionInValid;
    }
    if (inValid) {
      document.getElementById(control + rowIndex)?.classList.remove('ng-valid');
      document.getElementById(control + rowIndex)?.classList.add('ng-invalid');
      document.getElementById(control + rowIndex)?.classList.add('ng-dirty');
    } else {
      document
        .getElementById(control + rowIndex)
        ?.classList.remove('ng-invalid');
      document.getElementById(control + rowIndex)?.classList.remove('ng-dirty');
      document.getElementById(control + rowIndex)?.classList.add('ng-valid');
    }
    return 'ng-dirty ng-invalid';
  }

  onSubmitConfirmClicked(template: TemplateRef<unknown>): void {
    this.submitRequestDialogService = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    });
  }

  onCloseSubmitConfirmClicked() {
    this.submitRequestDialogService.close();
  }

  /** Private Methods **/

  private tAreaVariablesInitiation(dataItem: any) {
    dataItem.forEach((dataItem: any) => {
      this.calculateCharacterCount(dataItem);
    });
  }


}
