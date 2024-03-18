import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TemplateManagementFacade } from '@cms/system-config/domain';
import { State } from '@progress/kendo-data-query';

@Component({
  selector: 'system-config-letter-template-page',
  templateUrl: './letter-template-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LetterTemplatePageComponent {
  state!: State;
  sortType = this.templateManagementFacade.sortType;
  pageSizes = this.templateManagementFacade.gridPageSizes;
  gridSkipCount = this.templateManagementFacade.skipCount;
  sortValueLetterTemplates = this.templateManagementFacade.sortValueLetterTemplates;
  sortLetterTemplatesGrid = this.templateManagementFacade.sortLetterTemplatesGrid;
  letterTemplatesService$ = this.templateManagementFacade.letterTemplatesLists$; 
  /** Constructor **/
  constructor(private readonly templateManagementFacade: TemplateManagementFacade) { }


 
  loadLetterTemplateLists(data: any){
    this.templateManagementFacade.loadLetterTemplateLists();
  }
}
