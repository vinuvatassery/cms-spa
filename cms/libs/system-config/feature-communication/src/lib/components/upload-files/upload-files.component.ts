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
  public selectedAttachedFile: any = [];
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
  if (this.selectedAttachedFile?.length>0){
    this.showAttachmentRequiredError= false;
    for (let index = 0; index < this.selectedAttachedFile.length; index++) {
      const element = this.selectedAttachedFile[index];
      formData.append('uploadFiles', element);
    }
      formData.append("documentTemplateId",this.forms.controls["folderName"].value );
      this.uploadFilesEvent.emit(formData);
      this.isValidateForm= false;
      this.onCloseUploadFileClicked();
  }
  }
  handleFileSelected(event: any) 
  {  
    if(event != undefined)
     {
           event.files.forEach((option :any)=> {
              
                this.selectedAttachedFile.push(option.rawFile)
        });
           this.showAttachmentRequiredError = false;
           this.validateFileSize();
           
   }
 }
 validateFileSize(){
  this.attachedFileValidatorSize=false;
           let fileSize = 0;
          fileSize = this.selectedAttachedFile.map((item:any) => item.size).reduce((prev: any, next: any) => prev + next);
           if (fileSize > 25 * 1024 * 1024)
           {
            this.attachedFileValidatorSize = true;
           }
           else
           {
           this.attachedFileValidatorSize = false;
            }
            if(fileSize >0){
              this.showAttachmentRequiredError = false;
            }
 }
 handleFileRemoved(event: any) 
 {
  this.showAttachmentRequiredError = false;
   this.attachedFileValidatorSize=false;
  this.attachedFiles = null;
  let index = this.selectedAttachedFile.findIndex((x:any) =>x.name == event.files[0].rawFile?.name);
  this.selectedAttachedFile.splice(index,1);
  this.validateFileSize();
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