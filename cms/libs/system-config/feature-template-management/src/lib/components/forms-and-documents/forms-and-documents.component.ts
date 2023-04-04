/** Angular **/
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { LoaderService, LoggingService, NotificationSnackbarService, SnackBarNotificationType } from '@cms/shared/util-core';
import { TemplateManagementFacade } from '@cms/system-config/domain';
import { ExpandEvent } from "@progress/kendo-angular-treelist";
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
  public constructor(
    private readonly templateManagementFacade: TemplateManagementFacade,
    private readonly loaderService: LoaderService,
    private readonly snackbarService: NotificationSnackbarService,
    private readonly loggingService: LoggingService
  ) {
  }

  ngOnInit() {
    this.templateManagementFacade.getDirectoryContent("").subscribe((templates: any) => {
      debugger;
      if (!!templates) {
        this.foldersList = templates;
        if (this.foldersTree.length == 0) {
          this.foldersTree = this.foldersList;
        }
        this.foldersTree.map((item: any) => {
          if (item.fileName == this.selectedfolder) {
            item.files = this.foldersList;
          }
        });
      }
    })
  }
  /** Internal event methods **/
  onCloseAttachmentClicked() {
    this.isOpenAttachment = false;
  }
  onOpenAttachmentClicked() {
    this.isOpenAttachment = true;
  }

  /** Public methods **/
  showSnackBar(type: SnackBarNotificationType, subtitle: any) {
    if (type == SnackBarNotificationType.ERROR) {
      const err = subtitle;
      this.loggingService.logException(err)
    }
    this.snackbarService.manageSnackBar(type, subtitle);
  }

  onDownloadViewTemplateClick(viewType: string, name: string) {

    if (name === undefined || name === '') {
      return;
    }
    this.loaderService.show()
    this.templateManagementFacade.getFormsandDocumentsViewDownload(name).subscribe({
      next: (data: any) => {

        const fileUrl = window.URL.createObjectURL(data);
        if (viewType === 'view') {
          window.open(fileUrl, "_blank");
        } else {
          const downloadLink = document.createElement('a');
          downloadLink.href = fileUrl;
          var filename = name.split("\\");
          downloadLink.download = filename[filename.length - 1];
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

  onFolderNameClicked(template: any) {

    this.selectedfolder = template.filePath;
    this.templateManagementFacade.getDirectoryContent(template == null ? '' : template.filePath).subscribe((templates: any) => {
      if (!!templates) {
        this.foldersList = templates;
        if (this.foldersTree.length == 0)
          this.foldersTree = this.foldersList;
        this.foldersTree.forEach((item: any) => {

if (item.filePath == this.selectedfolder) {
  item.files = this.foldersList;
}

        });
      }
    })
  }

  public onExpand(args: ExpandEvent): void {
    debugger;
    this.onFolderNameClicked(args.dataItem);
  }
}
