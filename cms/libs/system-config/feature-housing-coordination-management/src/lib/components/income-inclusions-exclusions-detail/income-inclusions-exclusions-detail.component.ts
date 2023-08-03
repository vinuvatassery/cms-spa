import { Component, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { CommunicationFacade } from '@cms/case-management/domain';

@Component({
  selector: 'system-config-income-inclusions-exclusions-detail',
  templateUrl: './income-inclusions-exclusions-detail.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IncomeInclusionsExclusionsDetailComponent {

  letterEditorValue!: any;
  ddlEditorVariables$ = this.communicationFacade.ddlEditorVariables$;
  constructor(private readonly communicationFacade: CommunicationFacade) { }
}
