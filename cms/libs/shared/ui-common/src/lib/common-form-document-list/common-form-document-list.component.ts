import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { LoaderService, LoggingService, NotificationSnackbarService, SnackBarNotificationType } from '@cms/shared/util-core';
import { FormsAndDocumentFacade, TemplateManagementFacade } from '@cms/system-config/domain';
import { DialogService } from '@progress/kendo-angular-dialog';
import { DropAction, DropPosition, TreeItemDropEvent, TreeItemLookup } from '@progress/kendo-angular-treeview';
import { ActiveInactiveFlag } from '../enums/active-inactive-flag.enum';
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
  @Input() children:any;
  @Input() isPopUp:any;
  @Output() newVersionFileUploadOpenEvent = new EventEmitter()
  selectedfolder: string = "";
  isShowLoader: boolean = true;
  @ViewChild('renameTemplate', { read: TemplateRef })
  renameTemplate!: TemplateRef<any>;
  renameDialog:any
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  public formUiStyle: UIFormStyle = new UIFormStyle();
  isAddNewEditFolderPopup = false;
  isFolder = false;
  temData ='';
  isFormsDocumentDeletePopupShow = false;
  isFormsDocumentDeactivatePopupShow = false;
  isFormsDocumentReactivatePopupShow = false;
  isUploadFileDetailPopup = false;
  isUploadFolderDetailPopup = false;
  isUploadFileVersionDetailPopup = false;
  documentTemplateId = '';
  isDragDropEnabled = false;
  templateDesc: any
  public constructor(
    private readonly formsAndDocumentFacade: FormsAndDocumentFacade,
    private readonly loaderService: LoaderService,
    private dialogService: DialogService,
    private readonly notificationSnackbarService: NotificationSnackbarService,
    private readonly loggingService: LoggingService,) {

  }
  ngOnInit(): void {
  }
  public moreActions = [
    {
      buttonType: 'btn-h-primary',
      text: 'Rename',
      icon: 'edit',
      click: (event: any, data:any): void => {
        this.templateDesc = data.isFolder ? data.description : data.text;
        this.documentTemplateId =data.documentTemplateId;
        this.isFolder = data.isFolder ? true: false;
        this.temData = data;
        this.onAddFolderClicked(this.renameTemplate);
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
  ];

  public fileMoreActions = [
    {
      buttonType: 'btn-h-primary',
      text: 'Rename',
      icon: 'edit',
      click: (event: any, data:any): void => {
        this.templateDesc = data.isFolder ? data.description : data.text;
        this.documentTemplateId =data.documentTemplateId;
        this.isFolder = data.isFolder ? true: false;
        this.temData = data;
        this.onAddFolderClicked(this.renameTemplate);
      },
    },
    {
      buttonType: 'btn-h-primary',
      text: 'New Version',
      icon: 'upload',
      click: (event: any, data:any): void => {
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
  onUploadFileVersionOpenClicked(data:any) {
    this.newVersionFileUploadOpenEvent.emit(data)
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
    this.renameDialog.close();
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

  onDownloadViewFileClick(viewType: string, templateId: string, templateName: string) {
    if (templateId === undefined || templateId === '') {
      return;
    }
    this.loaderService.show()
    this.formsAndDocumentFacade.getFormsandDocumentsViewDownload(templateId).subscribe({
      next: (data: any) => {
        const fileUrl = window.URL.createObjectURL(data);
        if (viewType === 'view') {
          window.open(fileUrl, "_blank");
        } else {
          const downloadLink = document.createElement('a');
          downloadLink.href = fileUrl;
          downloadLink.download = templateName;
          downloadLink.click();
        }
        this.loaderService.hide();
      },
      error: (error: any) => {
        this.loaderService.hide();
        this.showHideSnackBar(SnackBarNotificationType.ERROR, error)
      }
    })
  }

  showHideSnackBar(type: SnackBarNotificationType, subtitle: any) {
    if (type == SnackBarNotificationType.ERROR) {
      const err = subtitle;
      this.loggingService.logException(err)
    }
    this.notificationSnackbarService.manageSnackBar(type, subtitle)
  }
  onAddFolderClicked(template: TemplateRef<unknown>): void {
    this.renameDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-lg app-c-modal-np',
    });
  }
  updateTemplate(payload:any){
    this.formsAndDocumentFacade.updateTemplate(payload);
  }
  getFlagValue(flag:any){
    if(flag== ActiveInactiveFlag.Yes)
      return 'Active';
    else
      return 'Inactive';
  }
}

 

