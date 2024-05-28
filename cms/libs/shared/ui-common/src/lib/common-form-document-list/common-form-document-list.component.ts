import { Component, EventEmitter, Input, OnChanges,  Output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { LoaderService, LoggingService, NotificationSnackbarService, SnackBarNotificationType } from '@cms/shared/util-core';
import { FormsAndDocumentFacade } from '@cms/system-config/domain';
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
export class CommonFormDocumentListComponent implements OnChanges {

  /** Public properties **/
  isOpenAttachment = false;
  @Input() foldersTree: any = [];
  @Input() treeViewSize: any;
  @Input() hasChildren: any;
  @Input() children:any;
  @Input() isPopUp:any;
  @Input() filter =""
  @Output() newVersionFileUploadOpenEvent = new EventEmitter()
  @Input() isShowInActiveChecked = false;
  selectedfolder: string = "";
  isShowLoader: boolean = true;
  @ViewChild('renameTemplate', { read: TemplateRef })
  renameTemplate!: TemplateRef<any>;
  @ViewChild('deactivateTemplates', { read: TemplateRef })
  deactivateTemplates!: TemplateRef<any>;
  @ViewChild('activateTemplates', { read: TemplateRef })
  activateTemplates!: TemplateRef<any>;
  renameDialog:any
  deactivateDialog:any
  activateDialog:any
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  public formUiStyle: UIFormStyle = new UIFormStyle();
  isAddNewEditFolderPopup = false;
  isFolder = false;
  templateData = '';
  temData ='';
  isFormsDocumentDeletePopupShow = false;
  isFormsDocumentDeactivatePopupShow = false;
  isFormsDocumentReactivatePopupShow = false;
  isUploadFileDetailPopup = false;
  isUploadFolderDetailPopup = false;
  isUploadFileVersionDetailPopup = false;
  documentTemplateId = '';
  SubtypeCode=' ';

  isDragDropEnabled = false;
  templateDesc: any
  activeflag:any;
  isdeactivateOpen = false;
  reactivateOpen=false;
  filterValue="";
  activeFlag = false;
  public constructor(
    private readonly formsAndDocumentFacade: FormsAndDocumentFacade,
    private readonly loaderService: LoaderService,
    private dialogService: DialogService,
    private readonly notificationSnackbarService: NotificationSnackbarService,
    private readonly loggingService: LoggingService,) {

  }
  ngOnChanges(changes: SimpleChanges): void {
    if(changes['filter']){
    if (!changes['filter'].firstChange) { 
        this.filterValue = changes['filter'].currentValue
    }
  }
    if(changes['isShowInActiveChecked']){
    if (!changes['isShowInActiveChecked'].firstChange) {  
        this.activeFlag = changes['isShowInActiveChecked'].currentValue
    }
  }
    if(this.filterValue == 'cust' && !this.activeFlag){
          this.isDragDropEnabled = true;
    }else{
      this.isDragDropEnabled = false;
    }
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
      click: (event: any, data:any): void => {
        this.temData = data;
        if(!this.isdeactivateOpen)
          {  this.isFolder = data.isFolder ? true: false;
            this.documentTemplateId =data.documentTemplateId;
            this.SubtypeCode=data.SubtypeCode;
            this.isdeactivateOpen = true;
            this.deactivateTemplate(this.deactivateTemplates);
          }
      },
    },
    {
      buttonType: 'btn-h-primary',
      text: 'Reactivate',
      icon: 'block',
      click: (event: any, data:any): void => {
        if(!this.reactivateOpen)
          {
            this.isFolder = data.isFolder ? true: false;
            this.documentTemplateId =data.documentTemplateId;
            this.SubtypeCode=data.SubtypeCode;
            this.reactivateOpen = true;
            this.reactivateTemplate(this.activateTemplates);
          }
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
      click: (event: any, data:any): void => {
        this.temData = data;
        if(!this.isdeactivateOpen)
          {  this.isFolder = data.isFolder ? true: false;
            this.documentTemplateId =data.documentTemplateId;
            this.SubtypeCode=data.SubtypeCode;

            this.isdeactivateOpen = true;
            this.deactivateTemplate(this.deactivateTemplates);
          }
      },
    },
    {
      buttonType: 'btn-h-primary',
      text: 'Reactivate',
      icon: 'block',
      click: (event: any, data:any): void => {
        if(!this.reactivateOpen)
          {
            this.isFolder = data.isFolder ? true: false;
            this.documentTemplateId =data.documentTemplateId;
            this.SubtypeCode=data.SubtypeCode;
            this.reactivateOpen = true;
            this.reactivateTemplate(this.activateTemplates);
          }
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
    destinationItem: TreeItemLookup,
    sourceItem : TreeItemLookup
  ): string {
    if (
      destinationItem &&
      action === DropAction.Add &&
      !destinationItem.item.dataItem.isFolder
    ) {
      return 'k-i-cancel';
    }

    if (
      destinationItem &&
      (action === DropAction.Add 
        ||action === DropAction.InsertBottom 
        || action === DropAction.InsertTop 
       || action === DropAction.InsertMiddle )
      && !destinationItem.item.dataItem.isFolder
      && sourceItem.item.dataItem.isFolder
    ) {
      return 'k-i-cancel';
    }

    if (
      destinationItem &&
      (action === DropAction.Add)
      && destinationItem.item.dataItem.isFolder
      && sourceItem.item.dataItem.isFolder
    ) {
      return 'k-i-cancel';
    }

    if (
      destinationItem &&
      (action === DropAction.InsertBottom 
        ||action === DropAction.InsertTop
      || action === DropAction.InsertMiddle 
       )
      && destinationItem.item.dataItem.isFolder
      && !sourceItem.item.dataItem.isFolder
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

  public logAdd(event: string, args?: any): void {
    console.log(event, args);
    const payload={
      destinationItem: args.destinationItem.item.dataItem,
      sourceItem :args.sourceItem.item.dataItem,
      dropPosition :args.dropPosition
    }
    this.formsAndDocumentFacade.reOrder(payload)
  }

  public logRemove(event: string, args?: any): void {
    console.log(event, args);
  }

  public handleDrop(event: TreeItemDropEvent): void {

    // prevent drop if attempting to add to file
    if (
      !event.destinationItem.item.dataItem.isFolder &&
      event.dropPosition === DropPosition.Over
    ) {
      event.setValid(false);
    }

    if (
     event.sourceItem.item.dataItem.isFolder 
      && !event.destinationItem.item.dataItem.isFolder
      && (event.dropPosition === DropPosition.Over
        || event.dropPosition === DropPosition.Before
        || event.dropPosition === DropPosition.After
      )
    ) {
      event.setValid(false);
    }

    if (
      event.sourceItem.item.dataItem.isFolder 
       && event.destinationItem.item.dataItem.isFolder
       && event.dropPosition === DropPosition.Over
         
       )
     {
       event.setValid(false);
     }

     
    if (
      !event.sourceItem.item.dataItem.isFolder 
       && event.destinationItem.item.dataItem.isFolder
       && (event.dropPosition === DropPosition.After
       || event.dropPosition === DropPosition.Before
       )
         
       )
     {
       event.setValid(false);
     }

 

  }

  public handlestart(event: any)
    {
       if(!this.isDragDropEnabled){
       event.preventDefault();
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

  onCloseFormsDocumentDeactivateClicked() {
    this.isdeactivateOpen = false;
    this.deactivateDialog.close();
  }

  onFormsDocumentReactivateClicked() {
    this.isFormsDocumentReactivatePopupShow = true;
  }
  onCloseFormsDocumentReactivateClicked() {
    this.reactivateOpen = false;
    this.activateDialog.close();
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
  deactivateTemplate(template: TemplateRef<unknown>): void {
    this.deactivateDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    });
  }

  reactivateTemplate(template: TemplateRef<unknown>): void {
    this.activateDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    });
  }

  deactivateTemplateStatus(payload:any){
    this.formsAndDocumentFacade.deactiveTemplateStatus(payload)

  }
  reactivateTemplateStatus(payload:any){
    this.formsAndDocumentFacade.reactiveTemplateStatus(payload)

  }
  onFormsDocumentDeactivateClicked() {
    this.isFormsDocumentDeactivatePopupShow = true;
  }
}

 

