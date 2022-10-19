/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
/** Facades **/
import { TemplateManagementFacade } from '@cms/system-config/domain';

@Component({
  selector: 'system-config-forms-and-documents-page',
  templateUrl: './forms-and-documents-page.component.html',
  styleUrls: ['./forms-and-documents-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormsAndDocumentsPageComponent implements OnInit {
  /** Public properties **/
  templates$ = this.templateManagementFacade.templates$;

  /** Constructor **/
  constructor(
    private readonly templateManagementFacade: TemplateManagementFacade
  ) {}

  /** Lifecycle hooks **/
  ngOnInit() {
    this.loadTemplates();
  }

  /** Public methods **/
  loadTemplates(): void {
    this.templateManagementFacade.loadTemplates();
  }
}
