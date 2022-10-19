/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
/** Facades **/
import { DocumentFacade } from '@cms/case-management/domain';

@Component({
  selector: 'case-management-document-page',
  templateUrl: './document-page.component.html',
  styleUrls: ['./document-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentPageComponent implements OnInit {
  /** Public properties **/
  documents$ = this.documentFacade.documents$;

  /** Constructor **/
  constructor(private documentFacade: DocumentFacade) {}

  /** Lifecycle hooks **/
  ngOnInit() {
    this.loadDocuments();
  }

  /** Private methods **/
  private loadDocuments(): void {
    this.documentFacade.loadDocuments();
  }
}
