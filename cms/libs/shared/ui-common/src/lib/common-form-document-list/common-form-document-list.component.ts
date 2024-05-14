import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { DropAction, DropPosition, TreeItemDropEvent, TreeItemLookup } from '@progress/kendo-angular-treeview';
const isOfType = (fileName: string, ext: string) =>
new RegExp(`.${ext}\$`).test(fileName);
const isFile = (name: string) => name.split('.').length > 1;
@Component({
  selector: 'system-config-common-form-document-list',
  templateUrl: './common-form-document-list.component.html',
})
export class CommonFormDocumentListComponent {

  /** Public properties **/
  isOpenAttachment = false;
  @Input() foldersTree: any = [];
  @Input() treeViewSize: any;
  @Input() hasChildren:any;
  @Output() newFileVersionUpload= new EventEmitter<any>();
  selectedfolder: string = "";
  isShowLoader: boolean = true;

  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  public formUiStyle: UIFormStyle = new UIFormStyle();
  isAddNewEditFolderPopup = false;
  isFormsDocumentDeletePopupShow = false;
  isFormsDocumentDeactivatePopupShow = false;
  isFormsDocumentReactivatePopupShow = false;
  isUploadFileDetailPopup = false;
  isUploadFolderDetailPopup = false;
  isUploadFileVersionDetailPopup = false;
  isDragDropEnabled = false;
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
      click: ($event :any,data: any): void => {
        console.log(data)
        this.onUploadFileVersionOpenClicked(data);
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
    onUploadFileVersionOpenClicked(data:any) {
      this.isUploadFileVersionDetailPopup = true;
      this.newFileVersionUpload.emit(data)
    }
    onCloseUploadFileVersionDetailClicked() {
      this.isUploadFileVersionDetailPopup = false;
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
      this.isAddNewEditFolderPopup = true;
    }
    onCloseAddNewEditFolderClicked() {
      this.isAddNewEditFolderPopup = false;
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

    public log(event: string, args?: any): void {
      console.log("addin")
      console.log(event, args);
    }
  
    public handleDrop(event: TreeItemDropEvent): void {
      this.log("nodeDrop", event);
  
      // prevent drop if attempting to add to file
      if (
        isFile(event.destinationItem.item.dataItem.text) &&
        event.dropPosition === DropPosition.Over
      ) {
        event.setValid(false);
      }
    }

    
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
      isFile(destinationItem.item.dataItem.templatePath.substring(destinationItem.item.dataItem.templatePath.lastIndexOf('$')))
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

    console.log(action)
  }

}
