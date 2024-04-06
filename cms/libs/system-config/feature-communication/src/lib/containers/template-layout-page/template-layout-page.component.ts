import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { TemplateManagementFacade } from '@cms/system-config/domain';
import { State } from '@progress/kendo-data-query';

@Component({
  selector: 'system-config-template-layout-page',
  templateUrl: './template-layout-page.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TemplateLayoutPageComponent {
  state!: State;
  sortType = this.templateManagementFacade.sortType;
  pageSizes = this.templateManagementFacade.gridPageSizes;
  gridSkipCount = this.templateManagementFacade.skipCount;
  sortValueLayoutTemplates = this.templateManagementFacade.sortValueLayoutTemplates;
  sortLayoutTemplatesGrid = this.templateManagementFacade.sortLayoutTemplatesGrid;
  layoutTemplatesService$ = this.templateManagementFacade.layoutTemplatesList$; 
  /** Constructor **/
  constructor(private readonly templateManagementFacade: TemplateManagementFacade) { }


 
  loadLayoutTemplateLists(data: any){
    this.templateManagementFacade.loadLayoutTemplateLists();
  }
}
