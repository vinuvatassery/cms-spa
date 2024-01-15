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
  
 
}
