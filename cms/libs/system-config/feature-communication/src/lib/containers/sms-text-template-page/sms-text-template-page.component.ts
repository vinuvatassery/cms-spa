import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TemplateManagementFacade } from '@cms/system-config/domain';
import { State } from '@progress/kendo-data-query';

@Component({
  selector: 'system-config-sms-text-template-page',
  templateUrl: './sms-text-template-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SmsTextTemplatePageComponent {
  state!: State;
  sortType = this.templateManagementFacade.sortType;
  pageSizes = this.templateManagementFacade.gridPageSizes;
  gridSkipCount = this.templateManagementFacade.skipCount;
  sortValueSmsTextTemplates = this.templateManagementFacade.sortValueSmsTextTemplates;
  sortSmsTextTemplatesGrid = this.templateManagementFacade.sortSmsTextTemplatesGrid;
  smsTextTemplatesService$ = this.templateManagementFacade.smsTextTemplatesLists$; 
  /** Constructor **/
  constructor(private readonly templateManagementFacade: TemplateManagementFacade) { }


 
  loadSmsTextTemplateLists(data: any){
    this.templateManagementFacade.loadSmsTextTemplateLists();
  }
}
