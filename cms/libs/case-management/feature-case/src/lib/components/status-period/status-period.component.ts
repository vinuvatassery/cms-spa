/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
/** Facades **/
import { StatusPeriodFacade } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
@Component({
  selector: 'case-management-status-period',
  templateUrl: './status-period.component.html',
  styleUrls: ['./status-period.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatusPeriodComponent implements OnInit {

  /** Public properties **/
  StatusPeriod$ = this.statusPeriodFacade.statusPeriod$;
    public expandedDetailKeys: number[] = [1];
    public pageSize = 10;
    public skip = 5;
    public pageSizes = [
      {text: '5', value: 5}, 
      {text: '10', value: 10},
      {text: '20', value: 20},
      {text: 'All', value: 100}
    ];
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
    this.loadStatusPeriod();
  }

  /** Private methods **/
  private loadStatusPeriod() {
    this.statusPeriodFacade.loadStatusPeriod();
 
  }


}



