/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter, ChangeDetectorRef, TemplateRef, ViewChild } from '@angular/core';
/** Facades **/
import { CaseFacade, StatusPeriodFacade, ClientEligibilityFacade, ClientFacade } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
import { DialogService } from '@progress/kendo-angular-dialog';
import { GridComponent } from '@progress/kendo-angular-grid';
@Component({
  selector: 'case-management-status-period',
  templateUrl: './status-period.component.html',
  styleUrls: ['./status-period.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatusPeriodComponent implements OnInit {

    @Input() clientCaseId!: any;
    @Input() clientId!: any;
    @Input() clientCaseEligibilityId!: any;

    @Output() loadStatusPeriodEvent  = new EventEmitter<any>();
  /** Public properties **/
  @ViewChild(GridComponent) statusGrid!: GridComponent;
  StatusPeriod$ = this.statusPeriodFacade.statusPeriod$;
  public expandedDetailKeys: number[] = [1];
  public sortValue = this.statusPeriodFacade.sortValue;
  public sortType = this.statusPeriodFacade.sortType;
  public pageSizes = this.statusPeriodFacade.gridPageSizes;
  public gridSkipCount = this.statusPeriodFacade.skipCount;
  public sort = this.statusPeriodFacade.sort;
  public state!: State;
  selectedEligibilityId!: any;
  selectedCaseId!: any;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  isStatusPeriodDetailOpened = false;
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  isReadOnly$=this.caseFacade.isCaseReadOnly$;
  isStatusPeriodEdit = false;
  isCopyPeriod = false;
  private statusPeriodDialog: any;
  public actions = [
    {
      buttonType: "btn-h-primary",
      text: "Copy Status Period",
      icon: "content_copy",
      click: (dataItem: any, template: TemplateRef<unknown>): void => {
        if(dataItem.clientCaseEligibilityId){
          this.isCopyPeriod = true;
          this.onEditEligibilityPeriodClicked(dataItem.clientCaseId,dataItem.clientCaseEligibilityId, template);
        }
      },
    },
    {
      buttonType: "btn-h-primary",
      text: "Edit Status Period",
      icon: "edit",
      click: (dataItem: any, template: TemplateRef<unknown>): void => {
        if(dataItem.clientCaseEligibilityId){
          this.isStatusPeriodEdit = true;
          this.onEditEligibilityPeriodClicked(dataItem.clientCaseId,dataItem.clientCaseEligibilityId, template);
        }
      },
    }
  ];
  /** Constructor **/
  constructor(
    private readonly statusPeriodFacade: StatusPeriodFacade,
    private caseFacade: CaseFacade,
    private cdr: ChangeDetectorRef,
    private clientEligibilityFacade: ClientEligibilityFacade,
    private dialogService: DialogService,
    private readonly clientFacade: ClientFacade) { }

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.state = {
      skip: this.gridSkipCount,
      take: this.pageSizes[0]?.value
    };
    this.clientEligibilityFacade.eligibilityPeriodPopupOpen$.subscribe(response=>{
      this.isStatusPeriodDetailOpened = response;
      if(!this.isStatusPeriodDetailOpened)
      {
        this.isStatusPeriodEdit = false;
        this.isCopyPeriod = false;
      }
      this.cdr.detectChanges();
    });
    this.fetchStatusPeriodDetails();
  }

  pageSelectionChange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadStatusPeriodData();
  }

  public dataStateChange(stateData: any): void {
    this.state = stateData;
    this.loadStatusPeriodData();
  }

   // Loading the grid data based on pagination
   private loadStatusPeriodData(): void {
    this.LoadStatusPeriodList(
      this.state?.skip ?? 0,
      this.state?.take ?? 0
    );
  }

  LoadStatusPeriodList(
    skipCountValue: number,
    maxResultCountValue: number
  ) {
    const gridDataRefinerValue = {
      skipCount: skipCountValue,
      pagesize: maxResultCountValue
    };
    this.loadStatusPeriodEvent.next(gridDataRefinerValue);
  }

  fetchStatusPeriodDetails() {
    this.StatusPeriod$.subscribe((res: any) => {
      if(res['data'].length > 0) {
        res['data'].forEach((x:any, index: number) => {
          this.statusGrid.collapseRow(index);
        });
      }
    })
  }

  onStatusPeriodDetailClosed(result: any) {
    this.isStatusPeriodDetailOpened = false;
    this.isStatusPeriodEdit = false;
    this.isCopyPeriod = false;
    if (result) {
      this.statusPeriodDialog.close();
    }
    this.cdr.detectChanges();
  }

  onModalSaveAndClose(result:any){
    if(result){
      this.statusPeriodDialog.close();
      this.clientEligibilityFacade.eligibilityPeriodPopupOpenSubject.next(false);
      this.isStatusPeriodDetailOpened=false;
      this.isStatusPeriodEdit = false;
      this.isCopyPeriod = false;
      this.clientFacade.runImportedClaimRules(this.clientId);
      this.loadStatusPeriodData();
    }
  }

  onEditEligibilityPeriodClicked(clientCaseId: any, clientCaseEligibilityId: any, template: TemplateRef<unknown>) {
    this.selectedCaseId = clientCaseId;
    this.selectedEligibilityId = clientCaseEligibilityId;
    this.clientEligibilityFacade.eligibilityPeriodPopupOpenSubject.next(true);
    this.statusPeriodDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    });
  }
  onStatusPeriodDetailClicked(template: TemplateRef<unknown>): void {
    this.statusPeriodDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    });
    this.isStatusPeriodEdit = false;
    this.isCopyPeriod = false;
    this.selectedCaseId = this.clientCaseId;
    this.selectedEligibilityId = this.clientCaseEligibilityId;
    this.isStatusPeriodDetailOpened = true;
  }


}



