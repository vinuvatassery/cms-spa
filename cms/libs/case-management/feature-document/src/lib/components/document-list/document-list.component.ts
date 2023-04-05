/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs';
import {  Subject } from 'rxjs';
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
/** Public properties **/    
    public sortValue = this.documentFacade.sortValue;
    public sortType = this.documentFacade.sortType;
    public pageSizes = this.documentFacade.gridPageSizes;
    public gridSkipCount = this.documentFacade.skipCount;
    public sort = this.documentFacade.sort;
    public state!: State;
    public formUiStyle : UIFormStyle = new UIFormStyle();     
    public isGridLoaderShow = true;
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
        },
      },
      {
        buttonType:"btn-h-primary",
        text: "View in Tab",
        icon: "launch",
        click: (document:any): void => {
          this.documentFacade.viewOrDownloadFile('view',document.clientDocumentId,document.documentName)
        },
      },
    ];

    documentGridLoader$ = this.documentFacade.documentGridLoader$;
    clientId!: number; 
    caseEligibilityId!: string;
    clientCaseId!: string;
    documents$ = this.documentFacade.documents$;
    isOpenDocAttachment = false;
    isEdit :boolean =false;
    documentId:string='';    
    popupClassAction = 'TableActionPopup app-dropdown-action-list';
    tabIdSubject = new Subject<string>();
     tabId$ = this.tabIdSubject.asObservable();
     tabId!: any;
    
    /** Constructor **/
    constructor(private documentFacade: DocumentFacade,
      private readonly loaderService: LoaderService,
      private route: ActivatedRoute, private readonly router: Router) {}
  
    /** Lifecycle hooks **/
    ngOnInit() {
      this.clientId = this.route.snapshot.queryParams['id'];
      this.caseEligibilityId = this.route.snapshot.queryParams['e_id'];
      this.clientCaseId = this.route.snapshot.queryParams['cid'];
      this.tabId = this.route.snapshot.queryParams['tid'];
      this.tabIdSubject.next(this.tabId);
      this.loadDocuments();
      this.state = {
        skip: this.gridSkipCount,
        take: this.pageSizes[0]?.value,
        sort: this.sort,
      };
    }

    /** Private methods **/
    private loadDocuments(): void { 
      this.documentFacade.getDocumentsByClientCaseEligibilityId(this.caseEligibilityId); 
      this.documentGridLoader$.subscribe((data : any) => {
        this.isGridLoaderShow = data;
      });
    }
 
    closeAttachmentsPopup(){
          this.isEdit = false;
          this.isOpenDocAttachment = false;
          this.documentId = '';
          this.loadDocuments();
    } 
}
