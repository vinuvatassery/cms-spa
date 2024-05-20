import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActiveInactiveFlag } from '@cms/shared/ui-common';
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
  uploadNewVersionDocument$ = this.formsAndDocumentFacade.uploadNewVersionDocument$
fileFolderPayload :any
  constructor(private readonly formsAndDocumentFacade: FormsAndDocumentFacade, private readonly lovFacade: LovFacade) { }
  
  ngOnInit(): void {
    this.loadFolderSort();
    this.getFolderName();
    this.formsAndDocumentFacade.uploadNewVersionDocument$.subscribe(res =>{
      if(res){
        var filter={
          sort : true,
          active: ActiveInactiveFlag.All
        }
        this.formsAndDocumentFacade.loadFolderFile(filter)
      }
  })
  }

  addFolder(payload:any){
    this.formsAndDocumentFacade.addFolder(payload);
  }
  
  loadFolderSort() {
    this.lovFacade.getFolderSortLov()
  }
  loadFolderFiles(payload:any) {
    this.fileFolderPayload = payload
    this.formsAndDocumentFacade.loadFolderFile(payload);
  }

  getFolderName(){
    this.formsAndDocumentFacade.getFolderName();
  }
  uploadFiles(formData: any){
    this.formsAndDocumentFacade.uploadFiles(formData);
  }

  uploadNewVersionFile(event:any){
  this.formsAndDocumentFacade.uploadAttachments(event.data, event.documentTemplateId);

  }
}
