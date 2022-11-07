import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommunicationFacade } from '@cms/case-management/domain';

@Component({
  selector: 'cms-income-inclusions-exclusions-detail',
  templateUrl: './income-inclusions-exclusions-detail.component.html',
  styleUrls: ['./income-inclusions-exclusions-detail.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class IncomeInclusionsExclusionsDetailComponent implements OnInit {
  letterEditorValue!: any;
  ddlEditorVariables$ = this.communicationFacade.ddlEditorVariables$;
  constructor(private readonly communicationFacade: CommunicationFacade) { }

  ngOnInit(): void {
  }

}
