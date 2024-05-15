import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UIFormStyle } from '@cms/shared/ui-tpa';

@Component({
  selector: 'system-config-upload-files',
  templateUrl: './upload-files.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadFilesComponent implements OnInit {
  showAttachmentRequiredError: boolean = false;
  public selectedAttachedFile: any;
  public uploadedAttachedFile: any;
  attachedFileValidatorSize: boolean = false;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  value: any
  forms!: FormGroup;
  @Input()getFolders$: any;
  attachedFiles: any;
  isValidateForm= false;
  multipleFilesUpload = true;
  @Output() uploadFilesEvent = new EventEmitter<any>();
  @Output () onCloseUploadFileDetailClicked = new EventEmitter<any>();
  constructor(public formBuilder: FormBuilder){
    this.forms = this.formBuilder.group({})
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
  if (this.selectedAttachedFile){
    this.showAttachmentRequiredError= false;
    this.isValidateForm= false;
      formData.append("uploadFiles",this.selectedAttachedFile );
      formData.append("documentTemplateId", "63E485AE-4CE9-42D1-ACBC-60812F32220B");
      this.uploadFilesEvent.emit(formData);
  }
  }
  handleFileSelected(event: any) 
  {  
    if(event != undefined)
     {
           this.selectedAttachedFile=event.files[0].rawFile;
           this.showAttachmentRequiredError = false;
           this.attachedFileValidatorSize=false;
           if (this.selectedAttachedFile.size > 25 * 1024 * 1024)
           {
            this.attachedFileValidatorSize = true;
           }
           else
           {
           this.attachedFileValidatorSize = false;
            }
   }
 }
 handleFileRemoved(event: any) 
 {
  this.selectedAttachedFile= undefined;
  this.showAttachmentRequiredError = true;
   this.attachedFileValidatorSize=false;
  this.attachedFiles = null;
}
onCloseUploadFileClicked() {
  this.onCloseUploadFileDetailClicked.emit(false);
}
}
 