import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoaderService, LoggingService, NotificationSnackbarService, SnackBarNotificationType } from '@cms/shared/util-core';

@Component({
  selector: 'app-client-attachment-model',
  templateUrl: './client-attachment-model.component.html'
})
export class ClientAttachmentModelComponent implements OnInit {

  ClientsAttachmentForm!:FormGroup;
  public uploadedAttachedFile: any[] = [];
  public selectedAttachedFile: any[] = [];
  public floatingLabel="Proof of school";

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly notificationSnackbarService : NotificationSnackbarService,
    private readonly loaderService: LoaderService,
    private readonly loggingService: LoggingService,
    private formBuilder: FormBuilder
  ) { }

@Input() clientId: any;
@Input() clientAllDocumentList$: any;
@Output() public closePopup = new EventEmitter<any>();
@Output() public clientAttachment = new EventEmitter<any>();

isProofOfSchoolDocumentUploaded = true;
  ngOnInit() {
    this.ClientsAttachmentForm = this.formBuilder.group({
      clientsAttachment:[]
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

  clientAttachmentChange(event: any) {
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
    if(this.selectedAttachedFile.length > 0){
      this.clientAttachment.emit(this.selectedAttachedFile[0]);
    }else{
      this.isProofOfSchoolDocumentUploaded=false;
    }
  }

}
