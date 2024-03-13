import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TemplateManagementFacade } from '@cms/system-config/domain';
import { State } from '@progress/kendo-data-query';

@Component({
  selector: 'system-config-email-template-page',
  templateUrl: './email-template-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmailTemplatePageComponent {

  state!: State;
  sortType = this.templateManagementFacade.sortType;
  pageSizes = this.templateManagementFacade.gridPageSizes;
  gridSkipCount = this.templateManagementFacade.skipCount;
  sortValueEmailTemplates = this.templateManagementFacade.sortValueEmailTemplates;
  sortEmailTemplatesGrid = this.templateManagementFacade.sortEmailTemplatesGrid;
  emailTemplatesService$ = this.templateManagementFacade.emailTemplatesLists$; 
  /** Constructor **/
  constructor(private readonly templateManagementFacade: TemplateManagementFacade) { }


 
  loadEmailTemplateLists(data: any){
    this.templateManagementFacade.loadEmailTemplateLists();
  }
}
