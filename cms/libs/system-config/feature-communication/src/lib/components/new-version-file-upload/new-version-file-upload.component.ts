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
  isSubmitted = false;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  value: any
  forms!: FormGroup;

  @Input() fileName =""
  fileNameRegex =/^[A-Za-z0-9-_,\s]$/
  attachedFiles: any;
  isValidateForm= false;
  multipleFilesUpload = true;
  file:any
  @Output () onCloseUploadFileVersionClicked = new EventEmitter<any>();
  @Output () onNewVersionUploadButtonClicked = new EventEmitter<any>();
  constructor(public formBuilder: FormBuilder){
}
 
  ngOnInit(): void {
    this.forms = this.formBuilder.group({
      fileName: [this.fileName, Validators.pattern('^[A-Za-z0-9-_,.()\s ]+$')],
      uploadedFile:[[], [Validators.required, Validators.maxLength(25 * 1024 * 1024)]]
    });

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
  this.isSubmitted= true
  this.forms.markAllAsTouched()
  if(this.forms.invalid ||(this.selectedAttachedFile && this.selectedAttachedFile.length <=0)||this.attachedFileValidatorSize || this.showAttachmentRequiredError || this.forms.controls["fileName"].invalid){
    this.showAttachmentRequiredError = true;
    return;
  }
  const formData = new FormData();
  if (this.selectedAttachedFile) {
    if (!this.attachedFileValidatorSize) {
      formData.append("UploadedAttachments", this.selectedAttachedFile);

    }
    formData.append("fileNameDesc", this.forms.controls["fileName"].value)
  this.onNewVersionUploadButtonClicked.emit(formData);

  }

}

}