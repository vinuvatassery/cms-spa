
import {
  Component,
  OnInit,
  ViewEncapsulation,
  ChangeDetectionStrategy,
} from '@angular/core';
import { TemplateManagementFacade } from '@cms/system-config/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
 
@Component({
  selector: 'system-config-sms-text-template-list',
  templateUrl: './sms-text-template-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SmsTextTemplateListComponent implements OnInit {
  public pageSize = 10;
  public skip = 0;
  public pageSizes = [
    { text: '5', value: 5 },
    { text: '10', value: 10 },
    { text: '20', value: 20 },
    { text: 'All', value: 100 },
  ];
  /** Public properties **/ 
  isSmsTemplateDeletePopupShow = false;
  isSmsTemplateDeactivatePopupShow = false;
  isSmsTemplateReactivatePopupShow = false;
  isSmsTemplateDuplicatePopupShow = false;
  
  smsTemplatesLists$ =  this.templateManagementFacade.smsTemplatesLists$
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  public formUiStyle: UIFormStyle = new UIFormStyle();
  public headerFooterList = [
    {
      buttonType: 'btn-h-primary',
      text: 'CAREAssist', 
      click: (data: any): void => { 
        console.log("!")
      },
    },
    {
      buttonType: 'btn-h-primary',
      text: 'OHOP', 
      click: (data: any): void => { 
        console.log("3")
      },
    },
    
  ];
  public gridMoreActions = [
    {
      buttonType:"btn-h-primary",
      text: "Edit",
      icon: "edit",
     
    }, 
  
    {
      buttonType:"btn-h-primary",
      text: "Duplicate",
      icon: "content_copy",
      click: (data: any): void => {
        this.onSmsTemplateDuplicateClicked();
      },
    }, 
    {
      buttonType:"btn-h-primary",
      text: "Deactivate",
      icon: "block",
      click: (data: any): void => {
        this.onSmsTemplateDeactivateClicked();
      },
    }, 
    {
      buttonType:"btn-h-danger",
      text: "Delete",
      icon: "delete",
      click: (data: any): void => {
        this.onSmsTemplateDeleteClicked();
      },
    },
  ];
  /** Constructor **/
  constructor(
    private readonly templateManagementFacade: TemplateManagementFacade
  ) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadSmsTemplateLists();
  }

  /** Private  methods **/

  private loadSmsTemplateLists() {
    this.templateManagementFacade.loadSmsTemplateLists();
  }
  
 
  onSmsTemplateDeleteClicked() {
    this.isSmsTemplateDeletePopupShow = true;
  }
  onCloseSmsTemplateDeleteClicked() {
    this.isSmsTemplateDeletePopupShow = false;
  }

  onSmsTemplateDeactivateClicked() {
    this.isSmsTemplateDeactivatePopupShow = true;
  }
  onCloseSmsTemplateDeactivateClicked() {
    this.isSmsTemplateDeactivatePopupShow = false;
  }

  onSmsTemplateReactivateClicked() {
    this.isSmsTemplateReactivatePopupShow = true;
  }
  onCloseSmsTemplateReactivateClicked() {
    this.isSmsTemplateReactivatePopupShow = false;
  }

  onSmsTemplateDuplicateClicked() {
    this.isSmsTemplateDuplicatePopupShow = true;
  }
  onCloseSmsTemplateDuplicateClicked() {
    this.isSmsTemplateDuplicatePopupShow = false;
  }


}
