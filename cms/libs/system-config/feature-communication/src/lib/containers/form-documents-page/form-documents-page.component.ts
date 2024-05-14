import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormsAndDocumentFacade, LovFacade } from '@cms/system-config/domain';

@Component({
  selector: 'system-config-form-documents-page',
  templateUrl: './form-documents-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormDocumentsPageComponent implements OnInit {
  folderSortList$ = this.lovFacade.folderSortLov$;;
  formsDocumentsList$ = this.formsAndDocumentFacade.formsDocumentsList$;
  constructor(private readonly formsAndDocumentFacade: FormsAndDocumentFacade, private readonly lovFacade: LovFacade) { }
  
  ngOnInit(): void {
    this.loadFolderSort();
  }

  addFolder(payload:any){
    this.formsAndDocumentFacade.addFolder(payload);
  }
  
  loadFolderSort() {
    this.lovFacade.getFolderSortLov()
  }
  loadFolderFiles(payload:any) {
    this.formsAndDocumentFacade.loadFolderFile(payload);
  }
}
