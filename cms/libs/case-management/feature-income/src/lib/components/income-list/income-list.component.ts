/** Angular **/
import {
  Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter, ChangeDetectorRef, ViewChild
} from '@angular/core';
/** External Libraries **/
import { Subject } from 'rxjs/internal/Subject';
import { State } from '@progress/kendo-data-query';
/** Internal Libraries **/
import { CompletionChecklist, ScreenType, WorkflowFacade, ClientDocumentFacade, IncomeFacade, FamilyAndDependentFacade, CaseFacade } from '@cms/case-management/domain';
import { DeleteRequest, SnackBar, StatusFlag } from '@cms/shared/ui-common';
import { UIFormStyle ,UploadFileRistrictionOptions} from '@cms/shared/ui-tpa';
import { ConfigurationProvider, LoaderService,  LoggingService,  NotificationSource,  SnackBarNotificationType,} from '@cms/shared/util-core';
import { DropDownListComponent } from '@progress/kendo-angular-dropdowns';
@Component({
  selector: 'case-management-income-list',
  templateUrl: './income-list.component.html',
  styleUrls: ['./income-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IncomeListComponent implements OnInit {
  /** Input properties **/
  @ViewChild("proofSchoolDropdownOne") public proofSchoolDropdownOne!: DropDownListComponent;
  @Input() data!: any;
  @Input() hasNoIncome!: boolean;
  @Input() clientCaseEligibilityId: string="";
  @Input() clientId: any;
  @Input() clientCaseId: any;
  @Input() isClientProfileTab: boolean = false;
  @Input() isCerForm: boolean = false;
  @Output() public sendDetailToIncomeList = new EventEmitter<any>();
  @Output() loadIncomeListEvent = new EventEmitter<any>();
  public formUiStyle: UIFormStyle = new UIFormStyle();
  public pageSizes = this.incomeFacade.gridPageSizes;
  public gridSkipCount = this.incomeFacade.skipCount;
  public state!: State;
  sort!:any;
  /** Public properties **/
  incomes$ = this.incomeFacade.incomes$;
  incomesTotal:any={};
  columnOptionDisabled = false;
  dependentsProofofSchools:any = [];
  isEdit!: boolean;
  selectedIncome: any;
  showRemoveUpoadProofDoc = false;
  isOpenedIncome = false;
  isAddIncomeButtonAndFooterNoteDisplay!: boolean;
  isIncludeNote!: boolean;
  deleteRequestSubject = new Subject<DeleteRequest>();
  deleteRequest$ = this.deleteRequestSubject.asObservable();
  isRemoveIncomeConfirmationPopupOpened = false;
  snackbarMessage!: SnackBar;
  snackbarSubject = new Subject<SnackBar>();
  snackbar$ = this.snackbarSubject.asObservable();
  proofOfSchoolDocument!:any
  incomeValid$ = this.incomeFacade.incomeValid$;
  isIncomeAvailable:boolean = true;
  isReadOnly$=this.caseFacade.isCaseReadOnly$;
  public uploadFileRestrictions: UploadFileRistrictionOptions =
    new UploadFileRistrictionOptions();
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  public actions = [
    {
      buttonType:"btn-h-primary",
      text: "Attach from computer",
      id: "proofOfSchoolUploaded",
      click: (event: any,dataItem: any): void => {
      },
    },
    {
      buttonType:"btn-h-primary",
      text: "Attach from client/'s attachments",
      id: "attachfromclient",
      click: (event: any,dataItem: any): void => {
        this.onProofSchoolDropdownOneBlur();
      },
    },

    {
      buttonType:"btn-h-danger",
      text: "Remove file",
      id: "removefile",
      click: (event: any,dataItem: any): void => {
      this.removeDependentsProofofSchoool(dataItem.clientDocumentId)
      this.onProofSchoolDropdownOneBlur();
      },
    },


  ];

  public actionsmore = [
    {
      buttonType:"btn-h-primary",
      text: "Edit Income",
        icon: "edit",
        type: 'edit',
    },


    {
      buttonType:"btn-h-danger",
      text: "Delete Income",
      icon: "delete",
      type: 'delete',
    },



  ];
  /** Constructor **/
  constructor(
      private readonly incomeFacade: IncomeFacade,
      private readonly workflowFacade: WorkflowFacade,
      private readonly loggingService: LoggingService,
      private readonly loaderService: LoaderService,
      private readonly clientDocumentFacade: ClientDocumentFacade,
      private readonly dependentFacade:FamilyAndDependentFacade,
      private readonly cdr: ChangeDetectorRef,
      private caseFacade: CaseFacade,
      private readonly configurationProvider: ConfigurationProvider) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadIncomes();
    this.loadDependents();
    this.includeAddIncomeButtonAndFooterNote();
    this.incomeValid$.subscribe(response=>{
      this.isIncomeAvailable = response;
      this.cdr.detectChanges();
    })    
  }

  ngOnChanges(){
    this.state = {
      skip: this.gridSkipCount,
      take: this.pageSizes[0]?.value
    };
  }
  /** Private methods **/
  private loadIncomes() {
    this.incomeFacade.incomesResponse$.subscribe({
      next:(incomeResponse:any)=>{
        this.incomesTotal=incomeResponse;
        this.cdr.detectChanges();
      },
      error:(error: any) => {
        this.loggingService.logException(error);
      }
    });

    this.incomes$.subscribe({
      next:(income:any) => {
        this.updateWorkFlowStatus(income?.total > 0);
      },
      error:()=>{
        this.updateWorkFlowStatus(false);
      }
    })
  }
  /** Private methods **/
  public onProofSchoolDropdownOneClose(event: any) {
    event.preventDefault();
    // Close the list if the component is no longer focused
    setTimeout(() => {
      if ( !this.proofSchoolDropdownOne.wrapper.nativeElement.contains(   document.activeElement  ) ) {
        this.proofSchoolDropdownOne.toggle(false); 
      }
    });
  }

  public onProofSchoolDropdownOneBlur() {
    this.proofSchoolDropdownOne.toggle(false);
  }
// Grid More action clicl function
onIncomeActionClicked(
  selectedincome : any, modalType: string = '') {
    this.selectedIncome = selectedincome;
  if (modalType == 'edit') {
 this.onIncomeClicked(true);
  }
  if (modalType == 'delete') {
    this.isRemoveIncomeConfirmationPopupOpened = true;
  }
}
  private loadDependentsProofofSchools() {
    this.incomeFacade.showLoader();
    this.incomeFacade.loadDependentsProofofSchools();
    this.incomeFacade.hideLoader();
  }

  private includeAddIncomeButtonAndFooterNote() {
    if (this.data === ScreenType.Case360Page) {
      this.isAddIncomeButtonAndFooterNoteDisplay = false;
    } else {
      this.isAddIncomeButtonAndFooterNoteDisplay = true;
    }
    this.cdr.detectChanges();
  }
  private updateWorkFlowStatus(isCompleted:boolean)
  {
    const workFlowdata: CompletionChecklist[] = [{
      dataPointName: 'income',
      status: isCompleted ? StatusFlag.Yes :StatusFlag.No
    }];

    this.workflowFacade.updateChecklist(workFlowdata);
  }

  /** Internal event methods **/
  onIncomeClosed() {
    this.isOpenedIncome = false;
  }

  onIncomeClicked(editValue: boolean) {
    this.isOpenedIncome = true;
    this.isEdit = editValue;
  }

  closeIncomePopup($event:any){
    this.isOpenedIncome = $event.popupState;
  }

  updateIncomeHandle(icome: any) {
    this.loadIncomes();
  }

  handleDeleteConfirmationClicked(event: any) {
    console.log('Response Data :', event);
  }

  onRemoveIncomeConfirmationClosed() {
    this.isRemoveIncomeConfirmationPopupOpened = false;
}
  // updating the pagination infor based on dropdown selection
  pageselectionchange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.sort ={ field : 'incomeSourceCodeDesc' ,  dir: 'asc' };
    this.loadIncomeData();
  }

  public dataStateChange(stateData: any): void {
    this.state = stateData;
    this.sort ={ field : stateData?.sort[0]?.field ?? 'incomeSourceCodeDesc' ,  dir: stateData?.sort[0]?.dir  ?? 'asc'  };
    this.loadIncomeData();
  }
  // Loading the grid data based on pagination
  private loadIncomeData(): void {
    this.LoadIncomeList(
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sort?.field ?? 'incomeSourceCodeDesc',
      this.sort?.dir ?? 'asc'
    );
  }

  LoadIncomeList(
    skipCountValue: number,
    maxResultCountValue: number,
    sortColumn: any,
    sortType: any
  ) {
    const gridDataRefinerValue = {
      skipCount: skipCountValue,
      pagesize: maxResultCountValue,
      sortColumn: sortColumn,
      sortType: sortType
    };
    this.loadIncomeListEvent.next(gridDataRefinerValue);
  }

  incomeDetailResponseHandle(event:any){
    if(event){
      this.loadIncomeData();
    }
  }

  handleFileSelected(event: any, dataItem: any) {    
    this.dependentFacade.showLoader();
    
    if (event && event.files.length > 0) {     
      const formData: any = new FormData();
      let file = event.files[0].rawFile
      if(file.size > this.configurationProvider.appSettings.uploadFileSizeLimit)
      {
        this.dependentFacade.showHideSnackBar(SnackBarNotificationType.ERROR, "File is too large. Cannot be more than 25 MB.",NotificationSource.UI);
      }
      else
      {
      if(dataItem.clientDocumentId){
        formData.append("clientDocumentId", dataItem.clientDocumentId);
        formData.append("concurrencyStamp", dataItem.documentConcurrencyStamp);
      }
      formData.append("document", file)
      formData.append("clientId", this.clientId)
      formData.append("clientCaseEligibilityId", this.clientCaseEligibilityId)
      formData.append("clientCaseId", this.clientCaseId)
      formData.append("EntityId", dataItem.clientDependentId)
      formData.append("documentTypeCode", "DEPENDENT_PROOF_OF_SCHOOL")
      this.showHideImageUploadLoader(true, dataItem);
      this.dependentFacade.uploadDependentProofOfSchool(this.clientCaseEligibilityId, dataItem.clientDependentId, formData).subscribe({
        next: (response: any) => {
          this.loadIncomeData();
          this.loadDependentsProofofSchools();
          this.dependentFacade.showHideSnackBar(SnackBarNotificationType.SUCCESS, "Dependent proof of school uploaded successfully.");
          this.dependentFacade.hideLoader();
          this.showHideImageUploadLoader(false, dataItem);

        },
        error: (err: any) => {
          this.dependentFacade.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        }
      })
    }
    }

  }
  viewOrDownloadFile(type: string, clientDocumentId: string, documentName: string) {
    this.loaderService.show()
    this.clientDocumentFacade.getClientDocumentsViewDownload(clientDocumentId)
    .subscribe({
      next: (data: any) => {
        const fileUrl = window.URL.createObjectURL(data);
        if (type === 'download') {
          const downloadLink = document.createElement('a');
          downloadLink.href = fileUrl;
          downloadLink.download = documentName;
          downloadLink.click();
        } else {
          window.open(fileUrl, "_blank");
        }
        this.loaderService.hide();
      }, 
      error: (error) => {
        this.loaderService.hide();
        this.incomeFacade.showHideSnackBar(SnackBarNotificationType.ERROR, error)
      }
    });
  }

  loadDependents(){
    this.incomeFacade.dependentsProofofSchools$.subscribe((response:any)=>{
      if(response&&response.length>0){
        this.dependentsProofofSchools=response;
        this.cdr.detectChanges();
      }
      else{
        this.dependentsProofofSchools = [];
      }
    })
  }

 removeDependentsProofofSchoool(documentid: string){
    if (documentid) {
      this.incomeFacade.showLoader();
      this.clientDocumentFacade.removeDocument(documentid).subscribe({
        next: (response: any) => {
          this.loadIncomeData();
          this.loadDependentsProofofSchools();
          this.incomeFacade.hideLoader();
          this.incomeFacade.showHideSnackBar(SnackBarNotificationType.SUCCESS , 'Proof of school attachment removed successfully') ;
          this.sendDetailToIncomeList.next(true);
        },
        error: (err: any) => {
          this.incomeFacade.hideLoader();
          this.incomeFacade.showHideSnackBar(SnackBarNotificationType.ERROR , err)
        },
      }
      );
    }
  }

  showHideImageUploadLoader(showHide:boolean,dataItem:any){
    this.dependentsProofofSchools.filter((dep:any)=>dep.clientDependentId==dataItem.clientDependentId).forEach((element:any)=>{
      element["uploaingProofDoc"]=showHide;
      this.cdr.detectChanges();
    })
  }
}
