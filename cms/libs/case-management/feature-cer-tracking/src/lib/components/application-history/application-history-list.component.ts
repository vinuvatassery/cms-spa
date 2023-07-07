/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
/** Facades **/
import { CaseFacade, DocumentFacade } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';

@Component({
  selector: 'case-management-app-history-list',
  templateUrl: './application-history-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppHistoryListComponent implements OnInit {

   /** Public properties **/
   documents$ = this.documentFacade.documents$;
   getCaseHistory$ =this.caseFacade.getCaseHistory$;
   isOpenDocAttachment = false;
   public sortValue = this.documentFacade.sortValue;
   public sortType = this.documentFacade.sortType;
   public pageSizes = this.documentFacade.gridPageSizes;
   public gridSkipCount = this.documentFacade.skipCount;
   public sort = this.documentFacade.sort;
   public state!: State;
   public formUiStyle : UIFormStyle = new UIFormStyle(); 
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
       buttonType:"",
       text: "Remove Doc",
       icon: "delete",
       click: (): void => {
       //  this.onDeactivatePhoneNumberClicked()
       },
     },
   ];
   /** Constructor **/
   constructor(private documentFacade: DocumentFacade, private caseFacade : CaseFacade) {}
 
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
     this.documentFacade.loadDocuments();
     this.caseFacade.loadCaseHistory();
   }
  
 
    
}
