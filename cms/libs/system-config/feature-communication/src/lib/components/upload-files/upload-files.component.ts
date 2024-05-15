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
      this.selectedAttachedFile.forEach((file:any) => { formData.append('uploadFiles', file); });
      formData.append("documentTemplateId",this.forms.controls["folderName"].value );
      this.uploadFilesEvent.emit(formData);
      this.isValidateForm= false;
  }
  }
  handleFileSelected(event: any) 
  {  
    if(event != undefined)
     {
           this.selectedAttachedFile=event.files.map(function (option :any) {
                return option.rawFile;
        });   ;
           this.showAttachmentRequiredError = false;
           this.attachedFileValidatorSize=false;
           let fileSize = 0;
           this.selectedAttachedFile.forEach((file:any) => 
            { fileSize =+ file.size});
           if (fileSize > 25 * 1024 * 1024)
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
changeOnfolderName(){
  if(this.getFolders$){
    this.isValidateForm= false;
  }
}
}