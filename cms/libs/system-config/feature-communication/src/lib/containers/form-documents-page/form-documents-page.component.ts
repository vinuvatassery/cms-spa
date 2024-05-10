import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormsAndDocumentFacade } from '@cms/system-config/domain';

@Component({
  selector: 'system-config-form-documents-page',
  templateUrl: './form-documents-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormDocumentsPageComponent implements OnInit {
  folderSortList$ = this.formsAndDocumentFacade.folderSort$;
  
  constructor(private readonly formsAndDocumentFacade: FormsAndDocumentFacade) { }
  
  ngOnInit(): void {
    this.loadFolderSort();
  }

  loadFolderSort() {
    this.formsAndDocumentFacade.loadfolderSort();
  }
}
