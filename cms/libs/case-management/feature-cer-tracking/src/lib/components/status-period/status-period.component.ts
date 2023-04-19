/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
/** Facades **/
import { StatusPeriodFacade } from '@cms/case-management/domain';
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
  /** Public properties **/
  StatusPeriod$ = this.statusPeriodFacade.statusPeriod$;
    public expandedDetailKeys: number[] = [1];
    public sortValue = this.statusPeriodFacade.sortValue;
    public sortType = this.statusPeriodFacade.sortType;
    public pageSizes = this.statusPeriodFacade.gridPageSizes;
    public gridSkipCount = this.statusPeriodFacade.skipCount;
    public sort = this.statusPeriodFacade.sort;
    public state!: State;
    public formUiStyle : UIFormStyle = new UIFormStyle();
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
 
  public actions = [
    {
      buttonType:"btn-h-primary",
      text: "Edit Doc",
      icon: "edit",
      click: (): void => {
      //  this.isOpenDocAttachment = true
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
  constructor(private readonly statusPeriodFacade: StatusPeriodFacade) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.state = {
      skip: this.gridSkipCount,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };
  }

}



