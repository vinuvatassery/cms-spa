import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { TemplateManagementFacade } from '@cms/system-config/domain';
import { DropAction, DropPosition, TreeItemDropEvent, TreeItemLookup } from '@progress/kendo-angular-treeview';
import { map } from 'rxjs';
const isOfType = (fileName: string, ext: string) =>
  new RegExp(`.${ext}\$`).test(fileName);
const isFile = (name: string) => name.split('.').length > 1;
@Component({
  selector: 'system-config-common-form-document-list',
  templateUrl: './common-form-document-list.component.html',
})
export class CommonFormDocumentListComponent implements OnInit {

  /** Public properties **/
  isOpenAttachment = false;
  @Input() foldersTree: any = [];
  @Input() treeViewSize: any;
  @Input() hasChildren: any;
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
  public constructor(
    private readonly templateManagementFacade: TemplateManagementFacade) {

  }
  ngOnInit(): void {
  }
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
        this.onUploadFileVersionOpenClicked();
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
  public data: any[] = [
    {
      id: 2,
      text: 'Kendo UI Project',
      isFolder: true,
      lastModificationTime: new Date('2019-01-15'),
      fileCount: 3,
      items: [
        {
          id: 3,
          text: 'about.html',
          isFolder: false,
          lastModificationTime: new Date('2019-01-15'),
          fileSize: 23,
        },
        {
          id: 4,
          text: 'index.html',
          isFolder: false,
          lastModificationTime: new Date('2019-01-15'),
          fileSize: 23,
        },
        {
          id: 5,
          text: 'logo.png',
          isFolder: false,
          lastModificationTime: new Date('2019-01-15'),
          fileSize: 23,
        },
      ],
    },
    {
      id: 6,
      text: 'New Web Site',
      isFolder: true,
      lastModificationTime: new Date('2019-01-15'),
      fileCount: 3,
      items: [
        {
          id: 7,
          text: 'mockup.jpg',
          isFolder: false,
          lastModificationTime: new Date('2019-01-15'),
          fileSize: 23,
        },
        {
          id: 8,
          text: 'Research.pdf',
          isFolder: false,
          lastModificationTime: new Date('2019-01-15'),
          fileSize: 23,
        },
      ],
    },
    {
      id: 9,
      text: 'Reports',
      isFolder: true,
      lastModificationTime: new Date('2019-01-15'),
      fileCount: 3,
      items: [
        {
          id: 10,
          text: 'February.pdf',
          isFolder: false,
          lastModificationTime: new Date('2019-01-15'),
          fileSize: 23,
        },
        {
          id: 11,
          text: 'March.pdf',
          isFolder: false,
          lastModificationTime: new Date('2019-01-15'),
          fileSize: 23,
        },
        {
          id: 12,
          text: 'April.pdf',
          isFolder: false,
          lastModificationTime: new Date('2019-01-15'),
          fileSize: 23,
        },
      ],
    },
  ];

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

  fetchSubfolders = (node: any) =>
    this.templateManagementFacade.getDirectoryContent('Form', node.documentTemplateId).pipe(map((response: any[]) => {
      return this.folderstreeformatting(response);
    }));
  hasFiles = function (data: any) {
    debugger;
    return (data.typeCode.toUpperCase() === 'Form'.toUpperCase() && data.templateSize === 0) ? true : false;
  }

  folderstreeformatting(folderdata: any) {
    folderdata.forEach((element: any) => {
      element.isFolder = (element.typeCode.toUpperCase() === 'Form'.toUpperCase() && element.templateSize === 0);
      element.templateSize = (element.templateSize / (1024 * 1024));
    });
  }
}
