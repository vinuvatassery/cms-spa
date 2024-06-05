import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { NotificationSnackbarService, SnackBarNotificationType } from '@cms/shared/util-core';
import { FormsAndDocumentDataService } from '@cms/system-config/domain';
import { FileRestrictions, FileState, SelectEvent, UploadEvent, UploadProgressEvent } from '@progress/kendo-angular-upload';

@Component({
  selector: 'system-config-upload-files',
  styles: [
    `#uploadForm k-actions k-actions-end {
      display: none !important;
  }`
     
  ],
  templateUrl: './upload-files.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadFilesComponent implements OnInit {
  uploadingFiles : any[]=[]
  @ViewChild('upload') uploadControl!: ElementRef;
  uploadSaveUrl = 'saveUrl'; // should represent an actual API endpoint
  uploadRemoveUrl = 'removeUrl'; // should represent an actual API endpoint
  showAttachmentRequiredError: boolean = false;
  public selectedAttachedFile: any = [];
  public uploadedAttachedFile: any;
  attachedFileValidatorSize: boolean = false;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  value: any
  fileUploadError = false
  forms!: FormGroup;
  btnDisabled = false;
  @Input()getFolders$: any;
  attachedFiles: any;
  isValidateForm= false;
  multipleFilesUpload = true;
  fileUploadUrl =this.formsDocumentsService.fileUploadUrl
  @Output() uploadFilesEvent = new EventEmitter<any>();
  @Output () onCloseUploadFileDetailClicked = new EventEmitter<any>();
  @Output () reloadFilesEvent = new EventEmitter<any>();
  public myRestrictions: FileRestrictions = {
    maxFileSize: 26214400
};
  constructor(public formBuilder: FormBuilder, public  formsDocumentsService : FormsAndDocumentDataService,
    private readonly snackbarService: NotificationSnackbarService
  ){
}
 
  ngOnInit(): void {
    this.forms = this.formBuilder.group({
      folderName: ['', Validators.required],
    });
  }
  uploadFile(){
    this.isValidateForm= true;
    this.showAttachmentRequiredError= true;
    const formData = new FormData();
  if (this.selectedAttachedFile?.length>0){
    this.showAttachmentRequiredError= false;

    for (const element of this.selectedAttachedFile) {
      formData.append('uploadFiles', element);
    }
      formData.append("documentTemplateId",this.forms.controls["folderName"].value );
      this.uploadFilesEvent.emit(formData);
      this.isValidateForm= false;
      this.onCloseUploadFileClicked();
  }
  }

 validateFileSize(files : any){
  this.attachedFileValidatorSize=false;
          
           files.forEach((element: any) => {
            let fileSize = 0;
            fileSize = element?.size
            if (fileSize > 26214400)
              {
               this.attachedFileValidatorSize = true;
              }             
               if(fileSize >0){
                 this.showAttachmentRequiredError = false;
               }
           
            })
         
          
 }
 handleFileRemoved(event: any) 
 {
  this.showAttachmentRequiredError = false;
   this.attachedFileValidatorSize=false;
  this.attachedFiles = null;
  let index = this.selectedAttachedFile.findIndex((x:any) =>x.name == event.files[0].rawFile?.name);
  this.selectedAttachedFile.splice(index,1);

}
onCloseUploadFileClicked() {
  this.onCloseUploadFileDetailClicked.emit(false);
}
changeOnfolderName(){
  if(this.getFolders$){
    this.isValidateForm= false;
  }
}
public upload(e: UploadEvent): void {
  if(!this.forms.valid)
  {
    return
  }
  
  
}

public select(e: SelectEvent): void {
  this.validateFileSize(e?.files)

  e.files.forEach((element: any) => {
    this.uploadingFiles.push(element)
  })
  
  
}

public complete(e: any){
  
 

  if(this.fileUploadError === false)
    {
      this.snackbarService.manageSnackBar(SnackBarNotificationType.SUCCESS,'Files Uploaded Sucessfuly');
  this.reloadFilesEvent.emit()
  this.onCloseUploadFileDetailClicked.emit(false);
    }
}
onError(event :  any)
{
  this.fileUploadError =true
}

dropdownFilterChange(folderId : string)
{  
 this.fileUploadUrl = this.formsDocumentsService.fileUploadUrl +'/'+folderId.toString()+'/files'
}
uploadProgressEventHandler(e: UploadProgressEvent) {
  console.log(e.files[0].name + ' is ' + e.percentComplete + ' uploaded');
}

public showSuccess(state: FileState): boolean {
  return state === FileState.Uploaded ? true : false;
}
public onUploadButtonClick(upload : any): void {
  
  this.isValidateForm= true;
  if(!this.forms.valid)
    {
      return
    }
  if(upload.fileList.count === 0)
    {
      this.showAttachmentRequiredError = true
      return
    }
    this.showAttachmentRequiredError = false
     let fileList : any[]=[]
    upload.fileList.files.forEach((element: any) => {
      fileList.push(element[0])
    })
  this.validateFileSize(fileList)
  if(this.attachedFileValidatorSize=== true)
    {
      return
    }
    
    
    this.btnDisabled = true;
  upload.uploadFiles();
}

onRemoveEvent(event : any)
{
  
  
  this.uploadingFiles = this.uploadingFiles.filter((files : any) => files?.uid !== event?.files[0]?.uid);  

  this.validateFileSize(this.uploadingFiles.filter((files : any) => files?.uid !== event?.files[0]?.uid))
}
}