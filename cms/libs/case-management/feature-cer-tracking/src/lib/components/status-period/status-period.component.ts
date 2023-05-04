/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
/** Facades **/
import { CaseFacade, StatusPeriodFacade, ClientEligibilityFacade } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
@Component({
  selector: 'case-management-status-period',
  templateUrl: './status-period.component.html',
  styleUrls: ['./status-period.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatusPeriodComponent implements OnInit {

    @Input() clientCaseId!: any;
    @Input() clientId!: any;

    @Output() loadStatusPeriodEvent  = new EventEmitter<any>();
  /** Public properties **/
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

  public actions = [
    {
      buttonType: "btn-h-danger",
      text: "Remove Doc",
      icon: "delete",
      click: (dataItem: any): void => {
        //  this.onDeactivatePhoneNumberClicked()
      },
    },
    {
      buttonType: "btn-h-primary",
      text: "Edit Status Period",
      icon: "edit",
      click: (dataItem: any): void => {
        if(dataItem.clientCaseEligibilityId){
          this.onEditEligibilityPeriodClicked(dataItem.clientCaseId,dataItem.clientCaseEligibilityId);
        }
        //  this.isOpenDocAttachment = true
      },
    }
  ];
  /** Constructor **/
  constructor(
    private readonly statusPeriodFacade: StatusPeriodFacade,
    private caseFacade: CaseFacade,
    private cdr: ChangeDetectorRef,
    private clientEligibilityFacade: ClientEligibilityFacade,) { }

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.state = {
      skip: this.gridSkipCount,
      take: this.pageSizes[0]?.value
    };
    this.clientEligibilityFacade.eligibilityPeriodPopupOpen$.subscribe(response=>{
      this.isStatusPeriodDetailOpened = response;
      this.cdr.detectChanges();
    });
  }

  ngOnChanges(){
    this.state = {
      skip: this.gridSkipCount,
      take: this.pageSizes[0]?.value
    };
  }

  pageselectionchange(data: any) {
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

  onStatusPeriodDetailClosed() {
    this.isStatusPeriodDetailOpened = false;
    this.cdr.detectChanges();
  }

  onModalSaveAndClose(result:any){
    if(result){
      this.isStatusPeriodDetailOpened=false;
      this.loadStatusPeriodData();
    }
  }

  onEditEligibilityPeriodClicked(clientCaseId: any, clientCaseEligibilityId: any) {
    this.selectedCaseId = clientCaseId;
    this.selectedEligibilityId = clientCaseEligibilityId;
    this.clientEligibilityFacade.eligibilityPeriodPopupOpenSubject.next(true);
  }
}



