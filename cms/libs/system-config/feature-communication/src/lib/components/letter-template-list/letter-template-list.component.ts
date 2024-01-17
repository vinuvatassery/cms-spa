 
import {
  Component,
  OnInit,
  ViewEncapsulation,
  ChangeDetectionStrategy,
} from '@angular/core';
import { TemplateManagementFacade } from '@cms/system-config/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
 
@Component({
  selector: 'system-config-letter-template-list',
  templateUrl: './letter-template-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LetterTemplateListComponent implements OnInit {
  public pageSize = 10;
  public skip = 0;
  public pageSizes = [
    { text: '5', value: 5 },
    { text: '10', value: 10 },
    { text: '20', value: 20 },
    { text: 'All', value: 100 },
  ];
  /** Public properties **/ 
  isLetterTemplateDeletePopupShow = false;
  isLetterTemplateDeactivatePopupShow = false;
  isLetterTemplateReactivatePopupShow = false;
  isLetterTemplateDuplicatePopupShow = false;
  
  letterTemplatesLists$ =
    this.templateManagementFacade.letterTemplatesLists$
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
        this.onLetterTemplateDuplicateClicked();
      },
    }, 
    {
      buttonType:"btn-h-primary",
      text: "Deactivate",
      icon: "block",
      click: (data: any): void => {
        this.onLetterTemplateDeactivateClicked();
      },
    }, 
    {
      buttonType:"btn-h-danger",
      text: "Delete",
      icon: "delete",
      click: (data: any): void => {
        this.onLetterTemplateDeleteClicked();
      },
    },
  ];
  /** Constructor **/
  constructor(
    private readonly templateManagementFacade: TemplateManagementFacade
  ) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadLetterTemplateLists();
  }

  /** Private  methods **/

  private loadLetterTemplateLists() {
    this.templateManagementFacade.loadLetterTemplateLists();
  }
  
 
  onLetterTemplateDeleteClicked() {
    this.isLetterTemplateDeletePopupShow = true;
  }
  onCloseLetterTemplateDeleteClicked() {
    this.isLetterTemplateDeletePopupShow = false;
  }

  onLetterTemplateDeactivateClicked() {
    this.isLetterTemplateDeactivatePopupShow = true;
  }
  onCloseLetterTemplateDeactivateClicked() {
    this.isLetterTemplateDeactivatePopupShow = false;
  }

  onLetterTemplateReactivateClicked() {
    this.isLetterTemplateReactivatePopupShow = true;
  }
  onCloseLetterTemplateReactivateClicked() {
    this.isLetterTemplateReactivatePopupShow = false;
  }

  onLetterTemplateDuplicateClicked() {
    this.isLetterTemplateDuplicatePopupShow = true;
  }
  onCloseLetterTemplateDuplicateClicked() {
    this.isLetterTemplateDuplicatePopupShow = false;
  }


}
