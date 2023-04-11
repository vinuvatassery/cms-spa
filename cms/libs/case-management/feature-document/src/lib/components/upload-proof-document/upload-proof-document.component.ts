/** Angular **/
import {
  Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter, ChangeDetectorRef
} from '@angular/core';
import { UIFormStyle, UploadFileRistrictionOptions } from '@cms/shared/ui-tpa';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SnackBarNotificationType, ConfigurationProvider, LoaderService } from '@cms/shared/util-core';
/** Internal Libraries **/
import { LovFacade } from '@cms/system-config/domain';
import {  DocumentFacade, Document } from '@cms/case-management/domain';
@Component({
  selector: 'case-management-upload-proof-document',
  templateUrl: './upload-proof-document.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadProofDocumentComponent implements OnInit {
  @Input() clientId: any;
  @Input() caseEligibilityId!: string;
  @Input() clientCaseId!: string;
  @Input() isEdit: boolean = false;
  @Input() documentId!: string;
  document$ = this.documentFacade.document$;

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter();

  public uploadFileSizeLimit = this.configurationProvider.appSettings.uploadFileSizeLimit;
  public uploadFileRestrictions: UploadFileRistrictionOptions = new UploadFileRistrictionOptions();
  public formUiStyle: UIFormStyle = new UIFormStyle();
  public uploadform!: FormGroup;
  public uploadRemoveUrl = 'removeUrl';
  ddlAttachmentTypes$ = this.lovFacade.attachmentTypeDroplistlov$;
  isSubmitted = false;
  isFileUploaded: boolean = true;
  copyOfUploadedFiles: any;
  btnDisabled = false;
  uploadedFileExceedsFileSizeLimit = false;  
  documentName?: string = '';
  clientDocumentId?: string = '';
  tareaNotesMaxLength = 200;
  tareaUploadNotesharactersCount!: number;
  tareaUploadNotesCounter!: string;
  tareaUploadNote = '';
  /** Constructor**/

  constructor(private readonly router: Router,
    private readonly lovFacade: LovFacade,
    private formBuilder: FormBuilder,
    private configurationProvider: ConfigurationProvider,
    public documentFacade: DocumentFacade,
    private readonly loaderService: LoaderService
  ) { }

  /** Lifecycle hooks **/
  ngOnInit() {
    this.loadAttachmentTypesDroplist();
    this.registerFormData();
    this.tAreaVariablesInitiation();
    if(this.documentId != null && this.documentId !=undefined && this.documentId != ''){
          this.getDocumentDataByDocumentId(); 
    } 
  }

  /** Private methods **/
  private registerFormData() {
    this.uploadform = this.formBuilder.group({
      concurrencyStamp: [''],
      attachmentType: ['', Validators.required],
      attachmentNote: ['', Validators.required],
      clientId: [0,]
    });

  }

  private tAreaVariablesInitiation() {
    this.tareaUploadNotesharactersCount = this.tareaUploadNotesCounter
      ? this.tareaUploadNote.length
      : 0;
    this.tareaUploadNotesCounter = `${this.tareaUploadNotesharactersCount}/${this.tareaNotesMaxLength}`;
  }

  private loadAttachmentTypesDroplist() {
    this.lovFacade.getAttachmentTypesLovs();
  }

  private populateModel(){
    if(!this.isEdit){
      let saveDocument : Document  = {
        clientId: this.clientId,
        clientCaseId: this.clientCaseId,
        clientCaseEligibilityId : this.caseEligibilityId,
        document: this.copyOfUploadedFiles[0].document.rawFile,
        documentName: this.copyOfUploadedFiles[0].name,       
        documentSize: this.copyOfUploadedFiles[0].size ,
        attachmentNote: this.uploadform.controls['attachmentNote'].value,
        documentTypeCode: this.uploadform.controls['attachmentType'].value        
      };
      return saveDocument;
    }
    else{
      let updateDocument : Document  = {
        clientDocumentId :this.clientDocumentId,
        clientId: this.clientId,
        clientCaseId: this.clientCaseId,
        clientCaseEligibilityId : this.caseEligibilityId,
        document: this.copyOfUploadedFiles[0].uid == ''? this.copyOfUploadedFiles[0].document.rawFile:'',
        documentName: this.copyOfUploadedFiles[0].name,       
        documentSize: this.copyOfUploadedFiles[0].size ,
        attachmentNote: this.uploadform.controls['attachmentNote'].value,
        documentTypeCode: this.uploadform.controls['attachmentType'].value        
      };
      return updateDocument;
    }
    
  } 
  
  private saveDocument(){
    this.clientDocumentId = '';
    const document = this.populateModel();
    this.loaderService.show();
    this.documentFacade
    .uploadDocument(document)
    .subscribe({
      next: (data: any) => {
        this.documentFacade.showHideSnackBar(
          SnackBarNotificationType.SUCCESS,
          'Document saved successfully.'
        );
        this.onAttachmentPopupClosed();
        this.loaderService.hide();
        this.btnDisabled = false;
      },
      error: (error: any) => {
        if (error) {
          this.btnDisabled = false;
          this.documentFacade.showHideSnackBar(
            SnackBarNotificationType.ERROR,
            error
          );
          this.loaderService.hide();
        }
      }
    });
  }

  private updateDocument(){
    const document = this.populateModel();
    this.loaderService.show();
    this.documentFacade
    .updateDocument(document)
    .subscribe({
      next: (data: any) => {
        this.documentFacade.showHideSnackBar(
          SnackBarNotificationType.SUCCESS,
          'Document Updated successfully.'
        );
        this.onAttachmentPopupClosed();
        this.loaderService.hide();
        this.btnDisabled = false;
      },
      error: (error: any) => {
        if (error) {
          this.btnDisabled = false;
          this.documentFacade.showHideSnackBar(
            SnackBarNotificationType.ERROR,
            error
          );
          this.loaderService.hide();
        }
      }
    });
  }

  private validateForm() {    
    this.isSubmitted = true;
    this.isFileUploaded = true;
    this.uploadform.markAllAsTouched();
    this.validateFileSize();   
  }

  private validateFileSize() {
    this.isFileUploaded = (this.copyOfUploadedFiles?.length > 0 && !!this.copyOfUploadedFiles[0].name) ? true : false;
    if (!this.isFileUploaded) {
      this.uploadedFileExceedsFileSizeLimit = false;
    }
  }

  private getDocumentDataByDocumentId(){
    this.loaderService.show();
    this.documentFacade.getDocumentByDocumentId(this.documentId).subscribe({
      next: (data) => {
        if(data){
          this.bindValues(data);
          this.loaderService.hide();
        }
        else{
          this.documentFacade.showHideSnackBar(
            SnackBarNotificationType.WARNING,
            'Data Not Found'
          );
          this.loaderService.hide();
        }
      },
      error: (err) => {
        if (err) {
          this.documentFacade.showHideSnackBar(
            SnackBarNotificationType.ERROR,
            err
          );
          this.loaderService.hide();
        }
      },
    });
  }
 
  private bindValues(document:Document){  
    this.clientDocumentId = document.clientDocumentId;    
    this.uploadform.controls['attachmentType'].setValue(document.documentTypeCode);
    this.documentName = document.documentName;
    this.uploadform.controls['attachmentNote'].setValue(document.attachmentNote);
    this.tareaUploadNote = this.uploadform.controls['attachmentNote'].value;
    this.tareaUploadNotesharactersCount = this.tareaUploadNote.length;
    this.tareaUploadNotesCounter = `${this.tareaUploadNotesharactersCount}/${this.tareaNotesMaxLength}`;
    this.copyOfUploadedFiles = [
      {
        name: document.documentName,
        src: document.documentPath,
        uid: document.clientDocumentId,
        size: document?.documentSize,
        documentId: document.clientDocumentId
      },
    ];
  }

/** Public methods **/
  onAttachmentPopupClosed() {
    this.closeModal.emit(true);
  }

  SubmitForm() {
    this.validateForm();
    if (this.uploadform.valid && this.isFileUploaded && !this.uploadedFileExceedsFileSizeLimit) {      
      this.btnDisabled = true;
      if(this.isEdit){
        this.updateDocument();
      }
      else{
        this.saveDocument();
      }
    }
  } 

  handleFileSelected(event: any) {
    this.copyOfUploadedFiles = null;
    this.uploadedFileExceedsFileSizeLimit = false;
    this.copyOfUploadedFiles = [{
      document: event.files[0],
      size: event.files[0].size,
      name: event.files[0].name,
      uid: ''
    }];
    this.isFileUploaded = true;
    if (this.copyOfUploadedFiles[0].size > this.uploadFileSizeLimit) {
      this.handleFileRemoved(this.copyOfUploadedFiles);
      this.uploadedFileExceedsFileSizeLimit = true;
    }
  }

  handleFileRemoved(files: any) {    
      this.copyOfUploadedFiles = [];
      this.isFileUploaded = false;
      this.uploadedFileExceedsFileSizeLimit = false; 
  } 

  OnNoteValueChange(event: any): void{
    this.tareaUploadNotesharactersCount = event.length;
    this.tareaUploadNotesCounter = `${this.tareaUploadNotesharactersCount}/${this.tareaNotesMaxLength}`;
  }  
}
