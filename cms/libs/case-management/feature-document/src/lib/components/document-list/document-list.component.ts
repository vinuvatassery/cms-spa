/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
/** Facades **/
import { DocumentFacade } from '@cms/case-management/domain';

@Component({
  selector: 'case-management-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentListComponent {

    /** Public properties **/
    documents$ = this.documentFacade.documents$;
    isOpenDocAttachment = false;

    popupClassAction = 'TableActionPopup app-dropdown-action-list';
    public actions = [
      {
        buttonType:"btn-h-primary",
        text: "Edit Doc",
        icon: "edit",
        click: (): void => {
         this.isOpenDocAttachment = true
        },
      },
     
      {
        buttonType:"btn-h-danger",
        text: "Remove Doc",
        icon: "delete",
        click: (): void => {
        //  this.onDeactivatePhoneNumberClicked()
        },
      },
    ];
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
