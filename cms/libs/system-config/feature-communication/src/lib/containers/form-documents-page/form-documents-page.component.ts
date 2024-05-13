import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormsAndDocumentFacade } from '@cms/system-config/domain';

@Component({
  selector: 'system-config-form-documents-page',
  templateUrl: './form-documents-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormDocumentsPageComponent implements OnInit {
  folderSortList$ = this.formsAndDocumentFacade.folderSort$;
  formsDocumentsList$ = this.formsAndDocumentFacade.formsDocumentsList$;
  constructor(private readonly formsAndDocumentFacade: FormsAndDocumentFacade) { }
  
  ngOnInit(): void {
    this.loadFolderSort();
    this.loadFolderFiles();
  }

  addFolder(payload:any){
    this.formsAndDocumentFacade.addFolder(payload);
  }
  
  loadFolderSort() {
    this.formsAndDocumentFacade.loadfolderSort();
  }
  loadFolderFiles() {
    this.formsAndDocumentFacade.loadFolderFile();
  }
}
