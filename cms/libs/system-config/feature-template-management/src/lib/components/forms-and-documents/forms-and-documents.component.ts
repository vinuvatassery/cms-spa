/** Angular **/
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { LoaderService, LoggingService, NotificationSnackbarService, SnackBarNotificationType } from '@cms/shared/util-core';
import { TemplateManagementFacade } from '@cms/system-config/domain';
import { map } from "rxjs/operators";

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
  isShowLoader: boolean = true;
  public constructor(
    private readonly templateManagementFacade: TemplateManagementFacade,
    private readonly loaderService: LoaderService,
    private readonly snackbarService: NotificationSnackbarService,
    private readonly loggingService: LoggingService,
  ) {
  }

  ngOnInit() {
    this.templateManagementFacade.getDirectoryContent('Forms','').subscribe((documentlist: any) => {
      this.isShowLoader = false;
      this.loaderService.hide();
      if (!!documentlist && this.foldersTree.length == 0) {
        this.foldersTree = this.folderstreeformatting(documentlist);
      }
    })
  }
  /** Internal event methods **/
  onCloseAttachmentClicked() {

    this.isOpenAttachment = false;
  }
  onOpenAttachmentClicked() {
    this.isOpenAttachment = true;
    if (this.isShowLoader)
      this.loaderService.show();
    else
      this.loaderService.hide();
  }

  fetchSubfolders = (node: any) =>
    this.templateManagementFacade.getDirectoryContent('Forms',node.documentTemplateId).pipe(map((response: any[]) => {
      return node.files = this.folderstreeformatting(response);
    }));

  hasFiles = function (data: any) {
    return data.folderName==null?false:true;
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
    element.isFolder=element.folderName!=null;
    element.templateSize=(element.templateSize/(1024 * 1024));
  });

  return folderdata;
  }
}
