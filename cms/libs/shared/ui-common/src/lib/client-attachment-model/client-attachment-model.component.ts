import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommunicationFacade } from '@cms/case-management/domain';
import { LoaderService, LoggingService, NotificationSnackbarService, SnackBarNotificationType } from '@cms/shared/util-core';

@Component({
  selector: 'app-client-attachment-model',
  templateUrl: './client-attachment-model.component.html'
})
export class ClientAttachmentModelComponent implements OnInit {

  clientAllDocumentList$!: any;
  ClientsAttachmentForm!:FormGroup;
  public uploadedAttachedFile: any[] = [];
  public selectedAttachedFile: any[] = [];

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly communicationFacade: CommunicationFacade,
    private readonly notificationSnackbarService : NotificationSnackbarService,
    private readonly loaderService: LoaderService,
    private readonly loggingService: LoggingService,
    private formBuilder: FormBuilder
  ) { }

@Input() clientId: any;
@Output() public closePopup = new EventEmitter<any>();
@Output() public clientAttachment = new EventEmitter<any>();

isProofOfSchoolDocumentUploaded = true;
  ngOnInit() {
    this.ClientsAttachmentForm = this.formBuilder.group({
      clientsAttachment:[]
    });
    this.loadClientAttachments(this.clientId);
  }

  loadClientAttachments(clientId: any) {
    this.loaderService.show();
    this.communicationFacade.loadClientAttachments(clientId)
      .subscribe({
        next: (attachments: any) => {
          if (attachments.totalCount > 0) {
            this.clientAllDocumentList$ = attachments?.items;
            this.cdr.detectChanges();
          }
          this.loaderService.hide();
        },
        error: (err: any) => {
          this.loaderService.hide();
          this.loggingService.logException(err);
          this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        },
      });
  }

  showHideSnackBar(type: SnackBarNotificationType, subtitle: any) {
    if (type == SnackBarNotificationType.ERROR) {
      const err = subtitle;
      this.loggingService.logException(err)
    }
    this.notificationSnackbarService.manageSnackBar(type, subtitle)
  }

  closeIncomeDetailPoup(): void {
    this.ClientsAttachmentForm.reset();
    this.closePopup.emit(true);
  }

  clientAttachmentChange(event: any) {debugger;
    if (event != undefined) {
      this.selectedAttachedFile=[];
      const isFileExists = this.selectedAttachedFile?.some((file: any) => file.name === event.documentName);
      if (!isFileExists) {
        this.uploadedAttachedFile = [{
          files: [event],
          size: event.documentSize,
          name: event.documentName,
          clientDocumentId: event.clientDocumentId,
          concurrencyStamp: event.concurrencyStamp,
          uid: '',
          documentPath: event.documentPath
        }];
        if (this.selectedAttachedFile.length == 0) {
          this.selectedAttachedFile = this.uploadedAttachedFile;
        } else {
          for (let file of this.uploadedAttachedFile) {
            this.selectedAttachedFile.push(file);
          }
        }
        this.uploadedAttachedFile = [];
        this.isProofOfSchoolDocumentUploaded=true;
      }
     }else{
      this.selectedAttachedFile=[];
      this.isProofOfSchoolDocumentUploaded=false;
     }
  }
  attachClientAttachment($event:any){
    debugger;
    if(this.selectedAttachedFile.length > 0){
      this.clientAttachment.emit(this.selectedAttachedFile[0]);
    }else{
      this.isProofOfSchoolDocumentUploaded=false;
    }
  }

}
