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
  @Output() addFolder = new EventEmitter<any>();
  @Output() loadFolders = new EventEmitter<any>();

  folderSortLovSubscription!: Subscription;
  folderSortLovList : any;
  ngOnInit(): void {
    this.loadSortDropDown(); 
    this.loadFoldersTree();
  }
  public formUiStyle: UIFormStyle = new UIFormStyle();
  @ViewChild('addFolderTemplate', { read: TemplateRef })
  addFolderTemplate!: TemplateRef<any>;
  addFolderDialog:any
  isAddNewEditFolderPopup = false;
  isFormsDocumentDeletePopupShow = false;
  isFormsDocumentDeactivatePopupShow = false;
  isFormsDocumentReactivatePopupShow = false;
  isUploadFileDetailPopup = false;
  isUploadFolderDetailPopup = false;
  isUploadFileVersionDetailPopup = false;
  isDragDropEnabled = false;
  /** Public properties **/ 
  sortOrder : any;

  constructor( private readonly formsAndDocumentFacade:FormsAndDocumentFacade,
    private dialogService: DialogService,private readonly cdr: ChangeDetectorRef, 
  ) {}
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
    this.loadFolders.emit(this.sortOrder.lovCode.toLowerCase());
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
          this.sortOrder = response[0];
          this.folderSortLovList = response;
          this.cdr.detectChanges();
        }
      }
    });
  }
  loadFoldersTree(){
    this.loadFolders.emit(true);
  }
}
