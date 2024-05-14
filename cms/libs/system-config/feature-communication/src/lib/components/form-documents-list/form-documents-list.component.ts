import { Component, ChangeDetectionStrategy, OnInit, Input, EventEmitter, Output, TemplateRef, ViewChild } from '@angular/core';
import {
  TreeItemDropEvent,
  DropPosition,
  TreeItemLookup,
  DropAction,
} from '@progress/kendo-angular-treeview';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { FormsAndDocumentFacade } from '@cms/system-config/domain';
import { DialogService } from '@progress/kendo-angular-dialog';
const isOfType = (fileName: string, ext: string) =>
  new RegExp(`.${ext}\$`).test(fileName);
const isFile = (name: string) => name.split('.').length > 1;
@Component({
  selector: 'system-config-form-documents-list',
  templateUrl: './form-documents-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormDocumentsListComponent implements OnInit {
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  @Input() folderSortList$: any;
  @Input() folderFileList$: any;
  @Output() addFolder = new EventEmitter<any>();
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
  public formUiStyle: UIFormStyle = new UIFormStyle();
  @ViewChild('addFolderTemplate', { read: TemplateRef })
  addFolderTemplate!: TemplateRef<any>;

  @ViewChild('newVersionFile', { read: TemplateRef })
  newVersionFile!: TemplateRef<any>;
  fileName = ""
  addFolderDialog: any
  file: any
  documentTemplateId:any
  isAddNewEditFolderPopup = false;
  isFormsDocumentDeletePopupShow = false;
  isFormsDocumentDeactivatePopupShow = false;
  isFormsDocumentReactivatePopupShow = false;
  isUploadFileDetailPopup = false;
  isUploadFolderDetailPopup = false;
  isUploadFileVersionDetailPopup = false;
  isDragDropEnabled = false;
  selectedAttachedFile: any
  attachedFileValidatorSize = false;
  showAttachmentRequiredError = false;
  attachedFiles: any
  /** Public properties **/
  sortOrder: any;

  constructor(private readonly formsAndDocumentFacade: FormsAndDocumentFacade,
    private dialogService: DialogService,
  ) { }
  public moreActions = [
    {
      buttonType: 'btn-h-primary',
      text: 'Rename',
      icon: 'edit',
      click: (data: any): void => {
        this.onAddNewEditFolderClicked();
      },
    },
    {
      buttonType: 'btn-h-primary',
      text: 'Reorder',
      icon: 'format_list_numbered',
      click: (data: any): void => {
        this.isDragDropEnabled = true;
      },
    },
    {
      buttonType: 'btn-h-primary',
      text: 'New Version',
      icon: 'upload',
      click: (data: any): void => {
        console.log(data)
        this.onAddFolderClicked(this.newVersionFile)
        // this.onUploadFileVersionOpenClicked();
      },
    },
    {
      buttonType: 'btn-h-primary',
      text: 'Deactivate',
      icon: 'block',
      click: (data: any): void => {
        this.onFormsDocumentDeactivateClicked();
      },
    },
    {
      buttonType: 'btn-h-danger',
      text: 'Delete',
      icon: 'delete',
      click: (data: any): void => {
        this.onFormsDocumentDeleteClicked();
      },
    },
  ];


  /** Internal event methods **/
  onUploadFileVersionOpenClicked() {
    this.isUploadFileVersionDetailPopup = true;
  }

  onUploadFolderOpenClicked() {
    this.isUploadFolderDetailPopup = true;
  }
  onCloseUploadFolderDetailClicked() {
    this.isUploadFolderDetailPopup = false;
  }
  onUploadFileOpenClicked() {
    this.isUploadFileDetailPopup = true;
  }
  onCloseUploadFileDetailClicked() {
    this.isUploadFileDetailPopup = false;
  }

  onAddNewEditFolderClicked() {
    this.addFolderDialog.open();
  }
  onCloseAddNewEditFolderClicked() {
    this.addFolderDialog.close();
  }

  onFormsDocumentDeleteClicked() {
    this.isFormsDocumentDeletePopupShow = true;
  }
  onCloseFormsDocumentDeleteClicked() {
    this.isFormsDocumentDeletePopupShow = false;
  }

  onFormsDocumentDeactivateClicked() {
    this.isFormsDocumentDeactivatePopupShow = true;
  }
  onCloseFormsDocumentDeactivateClicked() {
    this.isFormsDocumentDeactivatePopupShow = false;
  }

  onFormsDocumentReactivateClicked() {
    this.isFormsDocumentReactivatePopupShow = true;
  }
  onCloseFormsDocumentReactivateClicked() {
    this.isFormsDocumentReactivatePopupShow = false;
  }

  onSortChange(event: any) {
    this.sortOrder = event;
  }
  addFolderData(payLoad: any) {
    this.addFolder.emit(payLoad);
  }
  onAddFolderClicked(template: TemplateRef<unknown>): void {
    this.addFolderDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-md app-c-modal-np',
    });
  }

  openNewFileVersion(event: any, newVersionFile: any) {
    if(event){
    this.fileName = event.text
    this.documentTemplateId = event.documentTemplateId
    this.onAddFolderClicked(this.newVersionFile);
    }
  }

  onCloseUploadFileVersionDetailClicked() {
    this.addFolderDialog.close()
    this.file = undefined
    this.fileName = ""
    this.isUploadFileVersionDetailPopup = false;
    this.attachedFileValidatorSize = false;
    this.showAttachmentRequiredError = false;
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


  uploadAttachments() {
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
      const request ={
        uploadedAttachments :formData, 
        fileDetail:{
            fileName : this.fileName,
            fileSize : this.selectedAttachedFile.size
        } 
    }
      this.formsAndDocumentFacade.uploadAttachments(formData, this.documentTemplateId);
    }

  }

}
