/** Angular **/
import { Component, ChangeDetectionStrategy , TemplateRef,} from '@angular/core';
import { LoaderService, LoggingService, NotificationSnackbarService, SnackBarNotificationType } from '@cms/shared/util-core';
import { FormsAndDocumentFacade, TemplateManagementFacade } from '@cms/system-config/domain';
import { map } from "rxjs/operators";
import { DialogService } from '@progress/kendo-angular-dialog';
import { ActiveInactiveFlag } from '@cms/shared/ui-common';

@Component({
  selector: 'system-config-forms-and-documents',
  templateUrl: './forms-and-documents.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormsAndDocumentsComponent {
  /** Public properties **/
  isOpenAttachment = false;
  foldersList: any = [];
  foldersTree: any = [];
  selectedfolder: string = "";
  public formsDocumentDialog : any;
  popupFormsDocumentsList$ = this.formsAndDocumentFacade.popupFormsDocumentsList$;
  public constructor(
    private readonly templateManagementFacade: TemplateManagementFacade,
    private readonly formsAndDocumentFacade: FormsAndDocumentFacade,
    private readonly loaderService: LoaderService,
    private readonly snackbarService: NotificationSnackbarService,
    private readonly loggingService: LoggingService,
    private dialogService: DialogService
  ) {
  }

  /** Internal event methods **/
  onCloseAttachmentClicked() {
    this.formsDocumentDialog.close()
    this.isOpenAttachment = false;
  }


  onOpenAttachmentClicked(template: TemplateRef<unknown>): void {
    this.formsDocumentDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-xls app-c-modal-np app-c-modal-top',
    });
    this.isOpenAttachment = true;
      this.loadFolderFiles();
  }

  fetchSubfolders = (node: any) =>
    this.templateManagementFacade.getDirectoryContent('Form',node.documentTemplateId).pipe(map((response: any[]) => {
      return this.folderstreeformatting(response);
    }));

    hasFiles = function (data: any) {
      return (data.typeCode.toUpperCase() === 'Form'.toUpperCase() && data.templateSize === 0) ? true : false;
    }
  /** Public methods **/
  showSnackBar(type: SnackBarNotificationType, subtitle: any) {
    if (type == SnackBarNotificationType.ERROR) {
      const err = subtitle;
      this.loggingService.logException(err)
    }
    this.snackbarService.manageSnackBar(type, subtitle);
  }

  onDownloadViewFileClick(viewType: string, templateId: string,templateName:string) {

    if (templateId === undefined || templateId === '') {
      return;
    }
    this.loaderService.show()
    this.templateManagementFacade.getFormsandDocumentsViewDownload(templateId).subscribe({
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
        this.showSnackBar(SnackBarNotificationType.ERROR, error)
      }
    })
  }

  folderstreeformatting(folderdata:any)
  {
  folderdata.forEach((element: any) => {
    element.isFolder = (element.typeCode.toUpperCase() === 'Form'.toUpperCase() && element.templateSize === 0);
    element.templateSize=(element.templateSize/(1024 * 1024));
  });

  return folderdata;
  }

  loadFolderFiles() {
    let payload={
      sort : true,
      active: ActiveInactiveFlag.Yes
    }
    this.loaderService.show();
    this.formsAndDocumentFacade.loadFolderFilePopup(payload); 
    this.popupFormsDocumentsList$.subscribe({
      next: (response) => {
        this.foldersTree =response;
        this.loaderService.hide()
      },
      error: (err) => {
          this.loaderService.hide()
      },
  })
  }
}
