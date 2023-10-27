import { ApprovalTypeCode } from './../../../../../domain/src/lib/enums/approval-type-code.enum';
/** Angular **/
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { Router } from '@angular/router';
import { GridDataResult } from '@progress/kendo-angular-grid';
import {
  CompositeFilterDescriptor,
  State
} from '@progress/kendo-data-query';
import { Subject } from 'rxjs';
import {
  PanelBarCollapseEvent,
} from '@progress/kendo-angular-layout';
import { DialogService } from '@progress/kendo-angular-dialog';
import { PendingApprovalGeneralTypeCode, PendingApprovalPaymentTypeCode } from '@cms/productivity-tools/domain';
import {UserDataService, UserManagementFacade } from '@cms/system-config/domain';
@Component({
  selector: 'productivity-tools-approvals-general-list',
  templateUrl: './approvals-general-list.component.html',
})
export class ApprovalsGeneralListComponent implements OnInit, OnChanges {
  @ViewChild('submitRequestModalDialog', { read: TemplateRef })
  submitRequestModalDialog!: TemplateRef<any>;

  loginUserId!:any;
  isPanelExpanded = false;
  ifApproveOrDeny: any;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  isApprovalGeneralGridLoaderShow = false;
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() gridSkipCount:any;
  @Input() approvalsGeneralLists$: any;
  @Input() clientsSubjects$ : any;
  @Input() casereassignmentExpandedInfo$: any;
  @Input() approvalsExceptionCard$:any;
  @Input() invoiceData$:any;
  @Input() isInvoiceLoading$:any;
  @Input() submitGenerealRequest$:any;
  @Output() loadApprovalsGeneralGridEvent = new EventEmitter<any>();
  @Output() loadCasereassignmentExpanedInfoParentEvent = new EventEmitter<any>();
  @Output() loadApprovalsExceptionCardEvent = new EventEmitter<any>();
  @Output() loadApprovalsExceptionInvoiceEvent = new EventEmitter<any>();
  @Output() submitGeneralRequestsEvent = new EventEmitter<any>();

  pendingApprovalGeneralTypeCode:any;
  public state!: State;
  sortColumn = 'batch';
  sortDir = 'Ascending';
  columnsReordered = false;
  filteredBy = '';
  searchValue = '';
  isFiltered = false;
  filter!: any;
  selectedColumn!: any;
  gridDataResult!: GridDataResult;
  isSubmitGeneralRequest = false;
  tAreaCessationMaxLength:any=200;
  approveStatus:string="APPROVED";
  denyStatus:string="DENIED";
  sendbackNotesRequireMessage:string = "Reason for denial is required.";
  approvalsPaymentsGridPagedResult:any =[];
  approvalsPaymentsGridUpdatedResult: any=[];
  hasDisabledSubmit:boolean=true;
  pageValidationMessage:any=null;
  caseReassignmentsCount = 0;
  exceptionsCount = 0;
  listManagementItemsCount = 0
  gridApprovalGeneralDataSubject = new Subject<any>();
  gridApprovalGeneralBatchData$ =
    this.gridApprovalGeneralDataSubject.asObservable();
  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  private editListITemsDialog: any;
  private submitRequestDialogService: any;

  approvalId!: number;
  selectedIndex: any;
  @ViewChild('editListItemDialogModal') editModalTemplate!: TemplateRef<any>;
  @Input() usersByRole$ : any;
  @Output() approvalEntityId = new EventEmitter<any>();
  @Input() selectedVendor$ : any;
  selectedSubtypeCode: any;

  /** Constructor **/
  constructor(private route: Router,
              private dialogService: DialogService,
              private readonly cd: ChangeDetectorRef,
              private readonly userDataService: UserDataService,private readonly loginUserFacade : UserManagementFacade,
    ) {}

  ngOnInit(): void {
    this.loadApprovalGeneralListGrid();
    this.pendingApprovalGeneralTypeCode=PendingApprovalGeneralTypeCode;
    this.getLoggedInUserProfile();
  }
  ngOnChanges(): void {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };

    this.loadApprovalGeneralListGrid();
  }

  private loadApprovalGeneralListGrid(): void {
    this.loadApprovalGeneral(
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType
    );
  }
  loadApprovalGeneral(
    skipCountValue: number,
    maxResultCountValue: number,
    sortValue: string,
    sortTypeValue: string
  ) {
    this.isApprovalGeneralGridLoaderShow = true;
    const gridDataRefinerValue = {
      skipCount: skipCountValue,
      pagesize: maxResultCountValue,
      sortColumn: sortValue,
      sortType: sortTypeValue,
    };
    this.loadApprovalsGeneralGridEvent.emit(gridDataRefinerValue);
    this.gridDataHandle();
  }

  onChange(data: any) {
    this.defaultGridState();

    this.filterData = {
      logic: 'and',
      filters: [
        {
          filters: [
            {
              field: this.selectedColumn ?? 'batch',
              operator: 'startswith',
              value: data,
            },
          ],
          logic: 'and',
        },
      ],
    };
    const stateData = this.state;
    stateData.filter = this.filterData;
    this.dataStateChange(stateData);
  }

  defaultGridState() {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
      filter: { logic: 'and', filters: [] },
    };
  }

  onColumnReorder($event: any) {
    this.columnsReordered = true;
  }

  dataStateChange(stateData: any): void {
    this.sort = stateData.sort;
    this.sortValue = stateData.sort[0]?.field ?? this.sortValue;
    this.sortType = stateData.sort[0]?.dir ?? 'asc';
    this.state = stateData;
    this.sortDir = this.sort[0]?.dir === 'asc' ? 'Ascending' : 'Descending';
    this.loadApprovalGeneralListGrid();
  }

  // updating the pagination infor based on dropdown selection
  pageSelectionChange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadApprovalGeneralListGrid();
  }

  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
  }

  gridDataHandle() {
    this.approvalsGeneralLists$.subscribe((response: any) => {
      if (response.length > 0) {
        this.approvalsPaymentsGridPagedResult = response.map((item:any) => ({
          ...item,
          sendBackNotesInValidMsg: '',
          sendBackNotesInValid : false,
          isExpanded:false
        }));
        this.tAreaVariablesInitiation(this.approvalsPaymentsGridPagedResult);
        this.isApprovalGeneralGridLoaderShow = false;
        this.gridApprovalGeneralDataSubject.next(this.approvalsPaymentsGridPagedResult);
        if (response?.total >= 0 || response?.total === -1) {
          this.isApprovalGeneralGridLoaderShow = false;
        }
        this.cd.detectChanges();
      }
      else
      {
        this.approvalsPaymentsGridPagedResult = response;
        this.isApprovalGeneralGridLoaderShow = false;
        this.cd.detectChanges();
      }
    });
    this.isApprovalGeneralGridLoaderShow = false;
  }

  public onPanelExpand(item:any): void {
    if(item.approvalTypeCode === PendingApprovalGeneralTypeCode.GeneralAddtoMasterList)
    {
      const userObject = {
        approvalEntityId : item.approvalEntityId,
        subTypeCode : item.subTypeCode
      }
      this.selectedSubtypeCode  = item.subTypeCode;
      this.approvalEntityId.emit(userObject);
      this.isPanelExpanded = true;
      this.cd.detectChanges();
    }
  }

  approveOrDeny(index:any,result: any) {
    this.selectedIndex = index;
    this.ifApproveOrDeny = result;
  }

  onEditListItemsDetailClicked(template: TemplateRef<unknown>): void {
    this.editListITemsDialog = this.dialogService.open({
      content: template,
      animation: {
        direction: 'left',
        type: 'slide',
      },
      cssClass: 'app-c-modal app-c-modal-np app-c-modal-right-side',
    });
  }

  onSubmitClicked(template: TemplateRef<unknown>): void {
    this.submitRequestDialogService = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-lg app-c-modal-np'
    });
  }

  onCloseEditListItemsDetailClicked()  {
    this.editListITemsDialog.close();
  }

  getTitle(approvalTypeCode: string,subTypeCode:string) {
    switch (approvalTypeCode) {
      case PendingApprovalGeneralTypeCode.GeneralException:
        return 'Request to Exceed Max Benefits';
      case PendingApprovalGeneralTypeCode.GeneralCaseReassignment:
        return 'Request for Case reassignment';
      case PendingApprovalGeneralTypeCode.GeneralAddtoMasterList:
        return this.getMasterlistTitle(subTypeCode);
    }
    return null;
  }
  openEditModal(event:any){
    if(event){
      this.onEditListItemsDetailClicked(this.editModalTemplate);
    }
  }

  getMasterlistTitle(subTypeCode:string){
    switch(subTypeCode){
      case PendingApprovalGeneralTypeCode.DentalClinic:
        return 'Request to add Dental Clinics To Master List';
      case PendingApprovalGeneralTypeCode.MedicalClinic:
        return 'Request to add Medical Clinics To Master List';
      case PendingApprovalGeneralTypeCode.MedicalProvider:
        return 'Request to add Medical Providers To Master List';
      case PendingApprovalGeneralTypeCode.DentalProvider:
        return 'Request to add Dental Providers To Master List';
      case PendingApprovalGeneralTypeCode.InsuranceVendor:
        return 'Request to add Insurance Vendors To Master List';
      case PendingApprovalGeneralTypeCode.InsuranceProvider:
        return 'Request to add Insurance Providers To Master List';
      case PendingApprovalGeneralTypeCode.Pharmacy:
        return 'Request to add Pharmacies To Master List';
    }
    return null;
  }
  loadCasereassignmentExpanedInfoEvent(approvalId : any)
  {
    this.loadCasereassignmentExpanedInfoParentEvent.emit(approvalId);
  }
  loadApprovalsExceptionCard($event:any)
  {
    this.loadApprovalsExceptionCardEvent.emit($event);
  }
  loadApprovalsExceptionInvoice($event:any)
  {
    this.loadApprovalsExceptionInvoiceEvent.emit($event);
  }

  ngDirtyInValid(dataItem: any, control: any, rowIndex: any) {
    let inValid = false;

    if (control === 'sendBackNotes') {
      dataItem.sendBackNotesInValid = (dataItem.status == this.denyStatus && (dataItem.sendBackNotes == null || dataItem.sendBackNotes == undefined || dataItem.sendBackNotes == ""));
      dataItem.sendBackNotesInValidMsg = (dataItem.status == this.denyStatus && (dataItem.sendBackNotes == null || dataItem.sendBackNotes == undefined || dataItem.sendBackNotes == "")) ? this.sendbackNotesRequireMessage : "";
      inValid =  dataItem.sendBackNotesInValid;
    }
    if (inValid) {
      document.getElementById(control + rowIndex)?.classList.remove('ng-valid');
      document.getElementById(control + rowIndex)?.classList.add('ng-invalid');
      document.getElementById(control + rowIndex)?.classList.add('ng-dirty');
    }
    else {
      document.getElementById(control + rowIndex)?.classList.remove('ng-invalid');
      document.getElementById(control + rowIndex)?.classList.remove('ng-dirty');
      document.getElementById(control + rowIndex)?.classList.add('ng-valid');
    }
    return 'ng-dirty ng-invalid';
  }


  private tAreaVariablesInitiation(dataItem: any) {
    dataItem.forEach((dataItem: any) => {
      this.calculateCharacterCount(dataItem);
    });
  }

  calculateCharacterCount(dataItem: any) {
    let tAreaCessationCharactersCount = dataItem.sendBackNotes
      ? dataItem.sendBackNotes.length
      : 0;
    dataItem.tAreaCessationCounter = `${tAreaCessationCharactersCount}/${this.tAreaCessationMaxLength}`;
  }

  sendBackNotesChange(dataItem: any) {
    this.calculateCharacterCount(dataItem);
    this.assignRowDataToMainList(dataItem);
  }

  onSubmitPendingApprovalGeneralClicked(){
    this.validateApprovalsPaymentsGridRecord();
    const isValid = this.approvalsPaymentsGridPagedResult.filter((x: any) => x.sendBackNotesInValid);
    const totalCount = isValid.length;
    if (isValid.length > 0) {
     this.pageValidationMessage = totalCount +  " validation error(s) found, please review each page for errors.";
    }
    else if(this.approvalsPaymentsGridPagedResult.filter((x: any) => x.status == this.approveStatus || x.status == this.denyStatus).length <= 0){
      this.pageValidationMessage ="No data for approval";
    }
    else {
      this.pageValidationMessage = null;
      this.approvalsPaymentsGridUpdatedResult = this.approvalsPaymentsGridPagedResult.filter((x: any) => x.status == this.approveStatus || x.status == this.denyStatus);
      this.caseReassignmentsCount =  (this.approvalsPaymentsGridUpdatedResult.filter((x:any) => x.approvalTypeCode === this.pendingApprovalGeneralTypeCode.GeneralCaseReassignment)).length;
      this.listManagementItemsCount =  (this.approvalsPaymentsGridUpdatedResult.filter((x:any) => x.approvalTypeCode === this.pendingApprovalGeneralTypeCode.GeneralAddtoMasterList)).length;
      this.exceptionsCount =  (this.approvalsPaymentsGridUpdatedResult.filter((x:any) => x.approvalTypeCode === this.pendingApprovalGeneralTypeCode.GeneralException)).length;
      this.onSubmitClicked(this.submitRequestModalDialog);
    }
  }

  validateApprovalsPaymentsGridRecord() {
    this.approvalsGeneralLists$.forEach((currentPage: any, index: number) => {
      if (currentPage.status !== null
        && currentPage.status === this.denyStatus
        && currentPage.status !== undefined) {
        if (currentPage.sendBackNotes == null || currentPage.sendBackNotes === undefined || currentPage.sendBackNotes === '') {
          currentPage.sendBackNotesInValid = true;
          currentPage.sendBackNotesInValidMsg = this.sendbackNotesRequireMessage;
        }
      }
      else {
        currentPage.sendBackNotesInValid = false;
        currentPage.sendBackNotesInValidMsg = null;
      }
    });

    this.updatedResultValidation();
    this.assignPagedGridItemToUpdatedList(this.approvalsGeneralLists$);
  }

  updatedResultValidation() {
    if (this.approvalsPaymentsGridPagedResult.length > 0) {
      this.approvalsPaymentsGridPagedResult.forEach((item: any, index: number) => {
            if (this.approvalsPaymentsGridPagedResult[index].status==this.denyStatus) {
              this.updatedResultValidationSendBack(index);
            }
            else {
              this.approvalsPaymentsGridPagedResult[index].sendBackNotesInValid = false;
              this.approvalsPaymentsGridPagedResult[index].sendBackNotesInValidMsg = null;
            }
        }
      );
    }
  }

  updatedResultValidationSendBack(index: any) {
    if (this.approvalsPaymentsGridPagedResult[index].sendBackNotes === null
      || this.approvalsPaymentsGridPagedResult[index].sendBackNotes === ''
      || this.approvalsPaymentsGridPagedResult[index].sendBackNotes === undefined) {
      this.approvalsPaymentsGridPagedResult[index].sendBackNotesInValid = true;
      this.approvalsPaymentsGridPagedResult[index].sendBackNotesInValidMsg = this.sendbackNotesRequireMessage;
    }
    else
    {
      this.approvalsPaymentsGridPagedResult[index].sendBackNotesInValid = false;
      this.approvalsPaymentsGridPagedResult[index].sendBackNotesInValidMsg = null;
    }
  }
  assignPagedGridItemToUpdatedList(dataItem: any) {
    dataItem.forEach((item: any) => {
      this.assignRowDataToMainList(item);
    })
  }

  assignRowDataToMainList(dataItem: any) {
    let ifExist = this.approvalsPaymentsGridPagedResult.find((x: any) => x.generalPendingApprovalId === dataItem.generalPendingApprovalId);
    if (ifExist !== undefined) {
      this.approvalsPaymentsGridPagedResult.forEach((item: any, index: number) => {
        if (item.generalPendingApprovalId === ifExist.generalPendingApprovalId) {
          this.approvalsPaymentsGridPagedResult[index].sendBackNotesInValidMsg = dataItem?.sendBackNotesInValidMsg;
          this.approvalsPaymentsGridPagedResult[index].sendBackNotesInValid = dataItem?.sendBackNotesInValid;
          this.approvalsPaymentsGridPagedResult[index].tAreaCessationCounter = dataItem?.tAreaCessationCounter;
          this.approvalsPaymentsGridPagedResult[index].status = dataItem?.status;
          this.approvalsPaymentsGridPagedResult[index].sendBackNotes = dataItem?.sendBackNotes;
          this.approvalsPaymentsGridPagedResult[index].caseWorkerId = dataItem?.caseWorkerId;
        }
      });
    }
  }

  onRowLevelApproveClicked(e: boolean,dataItem: any, control: any, rowIndex: any)
  {
    dataItem.sendBackNotes="";
    if(dataItem.status === undefined || dataItem.status === '' || dataItem.status === null)
    {
      dataItem.status=this.approveStatus;
      dataItem.isExpanded=true;
    }
    else if(dataItem.status == this.approveStatus)
    {
      dataItem.status="";
      dataItem.sendBackNotes="";
      dataItem.sendBackNotesInValidMsg="";
      dataItem.sendBackNotesInValid = false;
      dataItem.isExpanded=false;
    }
    else if(dataItem.status == this.denyStatus)
    {
      dataItem.status=this.approveStatus;
      dataItem.sendBackNotesInValidMsg="";
      dataItem.sendBackNotesInValid = false;
      dataItem.isExpanded=true;
    }
    this.isPanelExpanded = dataItem.isExpanded;
    this.sendBackNotesChange(dataItem);
    this.assignRowDataToMainList(dataItem);
    this.enableSubmitButton();
    this.ngDirtyInValid(dataItem,control,rowIndex);
    this.cd.detectChanges();
  }

  onRowLevelDenyClicked(e: boolean,dataItem: any, control: any, rowIndex: any)
  {
    dataItem.isExpanded=false;
    this.isPanelExpanded = dataItem.isExpanded;
    if(dataItem.status === undefined || dataItem.status === '' || dataItem.status === null)
    {
      dataItem.status=this.denyStatus;
      dataItem.sendBackNotesInValidMsg= this.sendbackNotesRequireMessage;
      dataItem.sendBackNotesInValid = true;
    }
    else if(dataItem.status == this.denyStatus)
    {
      dataItem.status="";
      dataItem.sendBackNotesInValidMsg="";
      dataItem.sendBackNotes="";
      dataItem.sendBackNotesInValid = false;
      dataItem.sendBackButtonDisabled=true;
    }
    else
    {
      dataItem.status=this.denyStatus;
      dataItem.sendBackNotesInValidMsg=this.sendbackNotesRequireMessage;
      dataItem.sendBackNotesInValid = true;
      dataItem.sendBackButtonDisabled=false;
    }
    this.sendBackNotesChange(dataItem);
    this.assignRowDataToMainList(dataItem);
    this.ngDirtyInValid(dataItem,control,rowIndex);
    this.enableSubmitButton();
    this.cd.detectChanges();

  }

  enableSubmitButton()
  {
    const totalCount = this.approvalsPaymentsGridPagedResult.filter((x: any) => x.status == this.approveStatus || x.status == this.denyStatus).length;
    this.hasDisabledSubmit = (totalCount <= 0);
    this.cd.detectChanges();
  }

  getLoggedInUserProfile(){
    this.userDataService.getProfile$.subscribe((profile:any)=>{
      if(profile?.length>0){
       this.loginUserId= profile[0]?.loginUserId;
      }
    })
  }

  onCloseSubmitGeneralRequestClicked()
  {
     this.submitRequestDialogService.close();
  }

  makeRequestData()
  {
    let requests = [{}];
    for (let element of this.approvalsPaymentsGridUpdatedResult) {
      let request = {
        approvalId: element.generalPendingApprovalId,
        approvalTypeCode: element.approvalTypeCode,
        entityId : element.approvalEntityId,
        statusCode: element.status,
        denialDescription: element.sendBackNotes ? element.sendBackNotes : null,
        approvedUserId: this.loginUserId,
        asignedCaseWorkerId : element.caseWorkerId
      };
      requests.push(request);
    }
    requests.splice(0, 1);
    this.submit(requests);
  }
  submit(data:any)
  {
    this.submitGeneralRequestsEvent.emit(data);
    this.submitGenerealRequest$.subscribe((response: any) => {
      if (response !== undefined && response !== null) {
          this.loadApprovalGeneralListGrid();
      }
    });
  }

}
