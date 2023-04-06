/** Angular **/
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { LoaderService, LoggingService, NotificationSnackbarService, SnackBarNotificationType } from '@cms/shared/util-core';
import {TemplateManagementFacade } from '@cms/system-config/domain';
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
  isShowLoader:boolean=true;
  public constructor(
    private readonly templateManagementFacade: TemplateManagementFacade,
    private readonly loaderService: LoaderService,
    private readonly snackbarService: NotificationSnackbarService,
    private readonly loggingService: LoggingService,
  ) {
  }

  ngOnInit() {
    this.templateManagementFacade.getDirectoryContent("").subscribe((templates: any) => {
      
      this.isShowLoader=false;
      this.loaderService.hide();
      if (!!templates && this.foldersTree.length == 0) {
          this.foldersTree = templates;
      }
    })
  }
  /** Internal event methods **/
  onCloseAttachmentClicked() {
    
    this.isOpenAttachment = false;
  }
  onOpenAttachmentClicked() {
    this.isOpenAttachment = true;
    if(this.isShowLoader)
    this.loaderService.show();
    else
    this.loaderService.hide();
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


 public fetchChildren=(node: any) =>
 this.templateManagementFacade.getDirectoryContent(node.filePath).pipe( map((response: any[]) => 
 {
  return  node.files=response;
}) );

 hasChildren= function (data:any) {
   
   return data.isDirectory;
}
  
}
