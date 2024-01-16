import {
  Component,
  OnInit,
  ViewEncapsulation,
  ChangeDetectionStrategy,
} from '@angular/core';
import { TemplateManagementFacade } from '@cms/system-config/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
 
@Component({
  selector: 'system-config-email-template-list',
  templateUrl: './email-template-list.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmailTemplateListComponent implements OnInit {
  public pageSize = 10;
  public skip = 0;
  public pageSizes = [
    { text: '5', value: 5 },
    { text: '10', value: 10 },
    { text: '20', value: 20 },
    { text: 'All', value: 100 },
  ];
  /** Public properties **/ 
  isEmailTemplateDeletePopupShow = false;
  isEmailTemplateDeactivatePopupShow = false;
  isEmailTemplateReactivatePopupShow = false;
  isEmailTemplateDuplicatePopupShow = false;
  
  emailTemplatesLists$ =
    this.templateManagementFacade.emailTemplatesLists$
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
        this.onEmailTemplateDuplicateClicked();
      },
    }, 
    {
      buttonType:"btn-h-primary",
      text: "Deactivate",
      icon: "block",
      click: (data: any): void => {
        this.onEmailTemplateDeactivateClicked();
      },
    }, 
    {
      buttonType:"btn-h-danger",
      text: "Delete",
      icon: "delete",
      click: (data: any): void => {
        this.onEmailTemplateDeleteClicked();
      },
    },
  ];
  /** Constructor **/
  constructor(
    private readonly templateManagementFacade: TemplateManagementFacade
  ) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadEmailTemplateLists();
  }

  /** Private  methods **/

  private loadEmailTemplateLists() {
    this.templateManagementFacade.loadEmailTemplateLists();
  }
  
 
  onEmailTemplateDeleteClicked() {
    this.isEmailTemplateDeletePopupShow = true;
  }
  onCloseEmailTemplateDeleteClicked() {
    this.isEmailTemplateDeletePopupShow = false;
  }

  onEmailTemplateDeactivateClicked() {
    this.isEmailTemplateDeactivatePopupShow = true;
  }
  onCloseEmailTemplateDeactivateClicked() {
    this.isEmailTemplateDeactivatePopupShow = false;
  }

  onEmailTemplateReactivateClicked() {
    this.isEmailTemplateReactivatePopupShow = true;
  }
  onCloseEmailTemplateReactivateClicked() {
    this.isEmailTemplateReactivatePopupShow = false;
  }

  onEmailTemplateDuplicateClicked() {
    this.isEmailTemplateDuplicatePopupShow = true;
  }
  onCloseEmailTemplateDuplicateClicked() {
    this.isEmailTemplateDuplicatePopupShow = false;
  }


}
