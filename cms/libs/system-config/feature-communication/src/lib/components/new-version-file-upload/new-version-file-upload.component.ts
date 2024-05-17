import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UIFormStyle } from '@cms/shared/ui-tpa';

@Component({
  selector: 'new-version-file-upload',
  templateUrl: './new-version-file-upload.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewVersionFileUploadComponent implements OnInit {
  showAttachmentRequiredError: boolean = false;
  public selectedAttachedFile: any = [];
  public uploadedAttachedFile: any;
  attachedFileValidatorSize: boolean = false;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  value: any
  forms!: FormGroup;

  @Input() fileName =""
  attachedFiles: any;
  isValidateForm= false;
  multipleFilesUpload = true;
  file:any
  @Output () onCloseUploadFileVersionClicked = new EventEmitter<any>();
  @Output () onNewVersionUploadButtonClicked = new EventEmitter<any>();
  constructor(public formBuilder: FormBuilder){
}
 
  ngOnInit(): void {

  }

 handleFileSelected(event: any) {
  if (event != undefined) {
    this.selectedAttachedFile = event.files[0].rawFile;
    this.showAttachmentRequiredError = false;
    this.attachedFileValidatorSize = false;
    if (this.selectedAttachedFile.size > 25 * 1024 * 1024) {
      this.attachedFileValidatorSize = true;
    }
    else {
      this.attachedFileValidatorSize = false;
    }
  }
}

 handleFileRemoved(event: any) {
  this.selectedAttachedFile = undefined;
  this.showAttachmentRequiredError = true;
  this.attachedFileValidatorSize = false;
  this.attachedFiles = null;
}



onCloseUploadFileVersionDetailClicked(){
  this.onCloseUploadFileVersionClicked.emit(false)
}


uploadClicked() {
  if(this.attachedFileValidatorSize || this.showAttachmentRequiredError){
    return;
  }
  let SystemAttachmentsRequests: any = {};
  const formData = new FormData();
  if (!this.selectedAttachedFile) {
    this.showAttachmentRequiredError = true;
    return;
  }
  this.showAttachmentRequiredError = false;
  if (this.selectedAttachedFile) {
    if (!this.attachedFileValidatorSize) {
      formData.append("UploadedAttachments", this.selectedAttachedFile);

    }
    formData.append("fileNameDesc", this.fileName)
    formData.append("fileSize", "0")

  this.onNewVersionUploadButtonClicked.emit(formData);

  }

}

}