/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
/** Facades **/
import { CaseFacade, DocumentFacade } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { CompositeFilterDescriptor, State } from '@progress/kendo-data-query';
import { ConfigurationProvider } from '@cms/shared/util-core';
import { IntlService } from '@progress/kendo-angular-intl';
@Component({
  selector: 'case-management-document-list',
  templateUrl: './document-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentListComponent implements OnInit {
  /** Public properties **/
  pageSizes = this.documentFacade.gridPageSizes;
  sortValue = this.documentFacade.sortValue;
  sortType = this.documentFacade.sortType;
  sort = this.documentFacade.sort;
  state!: State;
  isReadOnly$=this.caseFacade.isCaseReadOnly$;
  formUiStyle: UIFormStyle = new UIFormStyle();
  isGridLoaderShow = true;
  actions = [
    {
      buttonType: "btn-h-primary",
      text: "Edit Attachment",
      icon: "edit",
      click: (document: any): void => {
        if (!this.isOpenDocAttachment) {
          this.documentId = document.clientDocumentId;
          this.isEdit = true;
          this.isOpenDocAttachment = true
        }
      },
    },

    {
      buttonType: "btn-h-primary",
      text: "Download",
      icon: "download",
      click: (document: any): void => {
        this.documentFacade.viewOrDownloadFile('download', document.clientDocumentId, document.documentName)
      },
    },
    {
      buttonType: "btn-h-primary",
      text: "View in Tab",
      icon: "launch",
      click: (document: any): void => {
        this.documentFacade.viewOrDownloadFile('view', document.clientDocumentId, document.documentName)
      },
    },
  ];
  columnOptionDisabled = false;
  documentGridLoader$ = this.documentFacade.documentGridLoader$;
  clientId!: number;
  caseEligibilityId!: string;
  clientCaseId!: string;
  documentsList$ = this.documentFacade.documentsList$;
  isOpenDocAttachment = false;
  isEdit: boolean = false;
  documentId: string = '';
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  tabIdSubject = new Subject<string>();
  tabId$ = this.tabIdSubject.asObservable();
  tabId!: any;
  gridFilter: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  filteredBy = "";
  searchValue = "";
  isFiltered = false;
  filter!: any
  columnName : any;
  dateFormat = this.configurationProvider.appSettings.dateFormat;
  documentListUserProfilePhoto$ = this.documentFacade.documentListUserProfilePhotoSubject
  /** Constructor **/
  constructor(private documentFacade: DocumentFacade,
    private caseFacade: CaseFacade,    
    private route: ActivatedRoute, private readonly router: Router,public intl: IntlService,
    private readonly configurationProvider: ConfigurationProvider,) { }

  /** Lifecycle hooks **/
  ngOnInit() {
    this.clientId = this.route.snapshot.queryParams['id'];
    this.caseEligibilityId = this.route.snapshot.queryParams['e_id'];
    this.clientCaseId = this.route.snapshot.queryParams['cid'];
    this.tabId = this.route.snapshot.queryParams['tid'];
    this.tabIdSubject.next(this.tabId);
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort
    };
    this.filter = '';
    this.columnName = '';
    this.loadData();
  }

  /** Public Methods */
  // updating the pagination infor based on dropdown selection
  pageselectionchange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadData();
  }

  closeAttachmentsPopup() {
    this.isEdit = false;
    this.isOpenDocAttachment = false;
    this.documentId = '';
    this.loadData();
  }

  dataStateChange(stateData: any): void {
    if (stateData.filter?.filters.length > 0) {
      let stateFilter = stateData.filter?.filters.slice(-1)[0].filters[0];
      this.filter = stateFilter.value;
      this.columnName = stateFilter.field
      this.isFiltered = true;
    }
    else {
      this.filter = "";
      this.isFiltered = false
    }
    if(this.columnName === 'creationDate')
      {
        let date = this.intl.formatDate(this.filter, this.dateFormat);
        this.filter = date;
      }
    this.sort = stateData.sort;
    if(stateData.sort[0]?.field === 'documentSizeInMB'){
      this.sortValue = 'DocumentSize';
    }
    else if(stateData.sort[0]?.field === 'creationDate'){
      this.sortValue = 'creationTime';
    }
    else if(stateData.sort[0]?.field === 'by'){
      this.sortValue = 'createdUser';
    }
    else{
      this.sortValue = stateData.sort[0]?.field;
    }
    this.sortType = stateData.sort[0]?.dir ?? 'asc';
    this.state = stateData;
    this.loadData();
  }

  filterChange(filter: CompositeFilterDescriptor): void {
    this.gridFilter = filter;
  }

  /** Private methods **/
  private loadData() {
    this.loadDocuments(this.state.skip ?? 0, this.state.take ?? 0, this.sortValue, this.sortType, this.filter,this.columnName)
  }

  private loadDocuments(skipCount: number, pageSize: number, sort: string, sortType: string, filter: string,columnName: string): void {
    const gridDataRefinerValue =
    {
      skipcount: skipCount,
      maxResultCount: pageSize,
      sort: sort,
      sortType: sortType,
      filter: filter,
      columnName : columnName
    };
    this.pageSizes = this.documentFacade.gridPageSizes;
    this.documentFacade.getDocumentsByClientCaseEligibilityId(this.clientId,
      gridDataRefinerValue.skipcount,
      gridDataRefinerValue.maxResultCount,
      gridDataRefinerValue.sort,
      gridDataRefinerValue.sortType,
      gridDataRefinerValue.filter,
      gridDataRefinerValue.columnName);//this.caseEligibilityId); 
    this.documentGridLoader$.subscribe((data: any) => {
      this.isGridLoaderShow = data;
    });
  }
}
