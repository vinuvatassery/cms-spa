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
  getFolders$ = this.formsAndDocumentFacade. getFolder$;
  constructor(private readonly formsAndDocumentFacade: FormsAndDocumentFacade, private readonly lovFacade: LovFacade) { }
  
  ngOnInit(): void {
    this.loadFolderSort();
    this.getFolderName();
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

  getFolderName(){
    this.formsAndDocumentFacade.getFolderName();
  }
  uploadFiles(files: File[], documentTemplateId: string){
    this.formsAndDocumentFacade.uploadFiles(files,documentTemplateId);
  }
}
