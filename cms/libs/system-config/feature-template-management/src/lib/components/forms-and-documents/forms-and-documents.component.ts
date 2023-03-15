/** Angular **/
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TemplateManagementFacade } from '@cms/system-config/domain';

@Component({
  selector: 'system-config-forms-and-documents',
  templateUrl: './forms-and-documents.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormsAndDocumentsComponent {
  /** Public properties **/
  isOpenAttachment = false;
  foldersList: any = [];

  public constructor(
    private readonly templateManagementFacade: TemplateManagementFacade
  ) {
  }

  ngOnInit() {
    this.templateManagementFacade.getTemplates();
    this.templateManagementFacade.templatesList$.subscribe((templates) => {
      if (!!templates) {
        this.foldersList = templates;
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

  //NOSONAR TODO - Add the download or view API call
  onDownloadViewTemplateClick(viewType: string, documentTemplateId: string, name: string) {
  }

}
