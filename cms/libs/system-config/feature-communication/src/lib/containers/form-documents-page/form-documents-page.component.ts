import { ChangeDetectionStrategy, Component } from '@angular/core';
import {FormsAndDocumentFacade } from '@cms/system-config/domain';

@Component({
  selector: 'system-config-form-documents-page',
  templateUrl: './form-documents-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class FormDocumentsPageComponent {
  constructor( private readonly formsAndDocumentFacade:FormsAndDocumentFacade,
     ) {}

    addFolder(payload:any){
    debugger
    this.formsAndDocumentFacade.addFolder(payload);
   }

}
