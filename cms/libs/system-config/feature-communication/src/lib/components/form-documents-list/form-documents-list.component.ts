import { Component, ChangeDetectionStrategy, OnInit, Input, EventEmitter, Output, TemplateRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import {
  TreeItemDropEvent,
  DropPosition,
  TreeItemLookup,
  DropAction,
} from '@progress/kendo-angular-treeview';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { FormsAndDocumentFacade } from '@cms/system-config/domain';
import { DialogService } from '@progress/kendo-angular-dialog';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActiveInactiveFlag } from '@cms/shared/ui-common';
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
  @Input() folderFileList$:any;
  @Input() uploadNewVersionDocument$ :any
  @Input() gridState$:any
  @Output() addFolder = new EventEmitter<any>();
  @Output() loadFolders = new EventEmitter<any>();
  @Output() uploadFiles = new EventEmitter<any>();
  @Output() sortChangeEvent = new EventEmitter<any>();
  @Output() newVersionFileUploadEvent = new EventEmitter<any>();
  @Input() getFolders$: any; 
  @Output() getGridState = new EventEmitter<any>()
  uploadFileDialog :any
  showDragEnabledText = false
  isActiveChecked: boolean = false;

  folderSortLovSubscription!: Subscription;
  folderSortLovList : any;
  ngOnInit(): void {
    this.loadSortDropDown(); 
    this.loadFoldersTree();
    this.uploadNewVersionDocument$.subscribe((res:any) =>{
      this.uploadFileDialog?.close()
    })
    this.onShowActiveClickedEvent();
    this.gridState$.subscribe((res:any)=>{
      if(res){
      this.sortOrder = this.folderSortLovList.filter((x :any)=> x.lovCode == res.gridState)[0]
      this.isShowDragEnabledText()
      this.cdr.detectChanges();
      }
    })
  }
  fileName =""
  file!:any
  selectedDocument!:any
  public formUiStyle: UIFormStyle = new UIFormStyle();
  @ViewChild('addFolderTemplate', { read: TemplateRef })
  addFolderTemplate!: TemplateRef<any>;
  @ViewChild('uploadFileTemplate', { read: TemplateRef })
  uploadFileTemplate!: TemplateRef<any>;
  addFolderDialog:any
  isAddNewEditFolderPopup = false;
  isFormsDocumentDeletePopupShow = false;
  isFormsDocumentDeactivatePopupShow = false;
  isFormsDocumentReactivatePopupShow = false;
  isUploadFileDetailPopup = false;
  isUploadFolderDetailPopup = false;
  isUploadFileVersionDetailPopup = false;
  isDragDropEnabled = false;
  showAttachmentRequiredError: boolean = false;
	public selectedAttachedFile: any;
  public uploadedAttachedFile: any;
	attachedFileValidatorSize: boolean = false;
  value: any
  forms!: FormGroup;
  attachedFiles: any;
  isValidateForm= false;
  /** Public properties **/ 
  sortOrder : any;

  constructor( private readonly formsAndDocumentFacade:FormsAndDocumentFacade,
    public formBuilder: FormBuilder,
    private dialogService: DialogService,private readonly cdr: ChangeDetectorRef, 
  ) {}

  public iconClass({ text }: any): any {
    return {
      'k-i-folder': !isFile(text),
      'k-icon': true,
      'k-font-icon': true,
    };
  }

  public getDragStatus(
    action: DropAction,
    destinationItem: TreeItemLookup
  ): string {
    if (
      destinationItem &&
      action === DropAction.Add &&
      isFile(destinationItem.item.dataItem.text)
    ) {
      return 'k-i-cancel';
    }

    switch (action) {
      case DropAction.Add:
        return 'k-i-plus';
      case DropAction.InsertTop:
        return 'k-i-insert-top';
      case DropAction.InsertBottom:
        return 'k-i-insert-bottom';
      case DropAction.InsertMiddle:
        return 'k-i-insert-middle';
      case DropAction.Invalid:
      default:
        return 'k-i-cancel';
    }
  }

  public log(event: string, args?: any): void {
    console.log(event, args);
  }

  public handleDrop(event: TreeItemDropEvent): void {
    this.log('nodeDrop', event);

    // prevent drop if attempting to add to file
    if (
      isFile(event.destinationItem.item.dataItem.text) &&
      event.dropPosition === DropPosition.Over
    ) {
      event.setValid(false);
    }
  }

  /** Internal event methods **/
  onUploadFileVersionOpenClicked() {
    this.isUploadFileVersionDetailPopup = true;
  }
  onCloseUploadFileVersionDetailClicked($event:any) {
    this.file = undefined
    this.fileName = ""
    this.isUploadFileVersionDetailPopup = false;
    this.attachedFileValidatorSize = false;
    this.showAttachmentRequiredError = false;
  this.uploadFileDialog.close()
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

  onSortChange(event:any){
    this.sortOrder = event;
    var filter={
      sort : this.sortOrder.lovCode.toLowerCase(),
      active: ActiveInactiveFlag.Yes
    }
    this.sortChangeEvent.emit(this.sortOrder.lovCode.toLowerCase())
    this.isShowDragEnabledText()
   this.loadFolders.emit(filter);
  }
  addFolderData(payLoad:any){
    this.addFolder.emit(payLoad);
   }
   onAddFolderClicked(template: TemplateRef<unknown>): void {
    this.addFolderDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-md app-c-modal-np',
    });
  }
  loadSortDropDown(){
    this.folderSortLovSubscription = this.folderSortList$.subscribe({
      next:(response: any[]) => {
        if(response.length > 0){
          this.folderSortLovList = response;
          this.getGridState.emit(true)
        
        }
      }
    });
  }
  loadFoldersTree(){
    var filter={
      sort : true,
      active: this.isActiveChecked ? 'A' : 'Y',
    }
    this.loadFolders.emit(filter);
  }

  uploadFilesEvent(formdata: any)
  {
   this.uploadFiles.emit(formdata);
  }


uploadFilesClicked(template: TemplateRef<unknown>): void
 {
  this.uploadFileDialog = this.dialogService.open({
    content: template,
    cssClass:'app-c-modal app-c-modal-lg app-c-modal-np'
  });
}
onCloseUploadFileDetailClicked() {
  this.uploadFileDialog.close();
}
onReloadFiles()
{
  this.loadFoldersTree()
}

newVersionFileUploadClick(data:any, template: TemplateRef<unknown>){
if(data){
this.selectedDocument = data;
this.fileName =data.text
this.uploadFilesClicked(template);

}

}

onNewVersionUploadButtonClicked(event:any){
  this.newVersionFileUploadEvent.emit({
    data:event,
    documentTemplateId : this.selectedDocument.documentTemplateId
  })
}
onShowActiveClickedEvent(){
  const payload = {
    active: this.isActiveChecked ? 'A' : 'Y',
    sort : true,
    isActiveChecked:this.isActiveChecked,
    ischecked : this.isActiveChecked ? true:false
  };
  this.formsAndDocumentFacade.isShowInActive =  this.isActiveChecked
  this.isShowDragEnabledText();
  this.loadFolders.emit(payload);
}

isShowDragEnabledText(){
  if(!this.isActiveChecked && this.sortOrder.lovCode.toLowerCase()=='cust'){
    this.showDragEnabledText = true
  }else{
    this.showDragEnabledText = false
  }
}
}