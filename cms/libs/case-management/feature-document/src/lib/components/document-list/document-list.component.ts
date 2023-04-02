/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
/** Facades **/
import { DocumentFacade } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
import { SnackBarNotificationType, ConfigurationProvider, LoaderService } from '@cms/shared/util-core';
@Component({
  selector: 'case-management-document-list',
  templateUrl: './document-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentListComponent implements OnInit {
  @Input() clientId!: number; 
  @Input() caseEligibilityId!: string;
  @Input() clientCaseId!: string;
    /** Public properties **/
    documents$ = this.documentFacade.documents$;
    isOpenDocAttachment = false;
    public sortValue = this.documentFacade.sortValue;
    public sortType = this.documentFacade.sortType;
    public pageSizes = this.documentFacade.gridPageSizes;
    public gridSkipCount = this.documentFacade.skipCount;
    public sort = this.documentFacade.sort;
    public state!: State;
    public formUiStyle : UIFormStyle = new UIFormStyle(); 
    isEdit :boolean =false;
    documentId:string='';
    public isGridLoaderShow = true;
    popupClassAction = 'TableActionPopup app-dropdown-action-list';
    public actions = [
      {
        buttonType:"btn-h-primary",
        text: "Edit Attachment",
        icon: "edit",
        click: (document:any): void => {
          if(!this.isOpenDocAttachment){
            this.documentId = document.clientDocumentId;
            this.isEdit =true;
           this.isOpenDocAttachment = true
          }          
        },
      },
     
      {
        buttonType:"btn-h-primary",
        text: "Download",
        icon: "download",
        click: (document:any): void => {
          this.documentFacade.viewOrDownloadFile('download',document.clientDocumentId,document.documentName)
          //this.onDeactivatePhoneNumberClicked(document.clientDocumentId);
        },
      },
      {
        buttonType:"btn-h-primary",
        text: "View in New Tab",
        icon: "open in new tab",
        click: (document:any): void => {
          this.documentFacade.viewOrDownloadFile('view',document.clientDocumentId,document.documentName)
          //this.onDeactivatePhoneNumberClicked(document.clientDocumentId);
        },
      },
    ];
    /** Constructor **/
    constructor(private documentFacade: DocumentFacade,
      private readonly loaderService: LoaderService) {}
  
    /** Lifecycle hooks **/
    ngOnInit() {
      this.loadDocuments();
      this.state = {
        skip: this.gridSkipCount,
        take: this.pageSizes[0]?.value,
        sort: this.sort,
      };
    }

    /** Private methods **/
    private loadDocuments(): void {      
      this.loaderService.show();
      this.documentFacade.getDocumentsByClientCaseEligibilityId('5E49713D-3E7E-44FD-8197-023E200951B9'); 
      this.loaderService.hide();
      this.isGridLoaderShow = false;
    }
 
    closeAttachmentsPopup(){
          this.isEdit = false;
          this.isOpenDocAttachment = false;
          this.documentId = '';
          this.loadDocuments();
    } 
}
