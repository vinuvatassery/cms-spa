/** Angular **/
import {
  Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter, ChangeDetectorRef,
} from '@angular/core';
import { UIFormStyle, UploadFileRistrictionOptions } from '@cms/shared/ui-tpa';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfigurationProvider, LoaderService } from '@cms/shared/util-core';
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
  saveDocumentResponse$ = this.documentFacade.saveDocumentResponse$;
  updateDocumentResponse$ = this.documentFacade.updateDocumentResponse$;
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
  documentTypeCode!: any;
  selectedTypeCode!: any;
  /** Constructor**/

  constructor(private readonly router: Router,
    private readonly lovFacade: LovFacade,
    private formBuilder: FormBuilder,
    private configurationProvider: ConfigurationProvider,
    public documentFacade: DocumentFacade,
    private readonly loaderService: LoaderService,
    private readonly cdr: ChangeDetectorRef,
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
      clientDocumentDescription: ['', Validators.required],
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
        clientDocumentDescription: this.uploadform.controls['clientDocumentDescription'].value,
        documentTypeCode: this.documentTypeCode ?? this.selectedTypeCode
      };
      this.documentFacade.saveDocument(saveDocument);
      this.btnDisabled = false;
      this.documentFacade.saveDocumentResponse$.subscribe((saveResponse: any) => {
        if(saveResponse){
          this.onAttachmentPopupClosed();
        }
      })
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
        clientDocumentDescription: this.uploadform.controls['clientDocumentDescription'].value,
        documentTypeCode: this.documentTypeCode ?? this.selectedTypeCode
      };
      this.documentFacade.updateDocument(updateDocument);
      this.btnDisabled = false;
      this.documentFacade.updateDocumentResponse$.subscribe((updateResponse: any) => {
        if(updateResponse){
          this.onAttachmentPopupClosed();
        }
      })
    }
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
    this.documentFacade.getDocumentByDocumentId(this.documentId)
    this.documentFacade.document$.subscribe((documentData: any) => {
        this.bindValues(documentData);
      });
  }

  private bindValues(document:Document){
    this.clientDocumentId = document.clientDocumentId;
    this.uploadform.controls['attachmentType'].setValue(document.documentTypeCode);
    this.selectedTypeCode = document.documentTypeCode;
    this.documentTypeCode = document.documentTypeCode;
    this.documentName = document.documentName;
    this.uploadform.controls['clientDocumentDescription'].setValue(document.clientDocumentDescription);
    this.tareaUploadNote = this.uploadform.controls['clientDocumentDescription'].value;
    this.tareaUploadNotesharactersCount = (this.tareaUploadNote?.length===undefined)?0:this.tareaUploadNote?.length;
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

  submitForm() {
    if(this.documentTypeCode){
      this.uploadform.controls['attachmentType'].setValue(this.documentTypeCode);
    }else{
      this.uploadform.controls['attachmentType'].setErrors({ 'incorrect': true });
      this.selectedTypeCode = null;
    }
    this.cdr.detectChanges();
    this.validateForm();
    if (this.uploadform.valid && this.isFileUploaded && !this.uploadedFileExceedsFileSizeLimit) {
      if (this.isFileUploaded && !this.uploadedFileExceedsFileSizeLimit) {
      this.btnDisabled = true;
      if(!this.isEdit){
        this.clientDocumentId = '';
      }
      this.populateModel();
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
  handleTypeCodeEvent(e:any)
  {
    this.documentTypeCode = e;
  }
  OnNoteValueChange(event: any): void{
    this.tareaUploadNotesharactersCount = event.length;
    this.tareaUploadNotesCounter = `${this.tareaUploadNotesharactersCount}/${this.tareaNotesMaxLength}`;
  }
}
