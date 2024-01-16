import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { UIFormStyle, UploadFileRistrictionOptions } from '@cms/shared/ui-tpa';
import {
  TabCloseEvent,
  TabStripComponent,
} from "@progress/kendo-angular-layout";
@Component({
  selector: 'system-config-email-template-new-form',
  templateUrl: './email-template-new-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmailTemplateNewFormComponent {
  public formUiStyle : UIFormStyle = new UIFormStyle();
    public uploadFileRestrictions: UploadFileRistrictionOptions = new UploadFileRistrictionOptions();
  isShowPopupClicked = false;
  isShowPreviewEmailHeaderFooterDialog = false;
  isShowSendTextDialog = false;
  isAddLanguageDetailPopup  = false;
  isRemoveLanguagePopup = false;
  isBccEnable = false;
  onToggle(){
    this.isShowPopupClicked = true;
  }
  public languageTabs = [
    {
      title: "English",
      selected: true,
      Closable: false,
    },
    {
      title: "Spanish",
      selected: false,
      Closable: true,
    },
    {
      title: "Italy",
      selected: false,
      Closable: true,
    },
  ];
  public listItems: Array<string> = [
    "Baseball",
    "Basketball",
    "Cricket",
    "Field Hockey",
    "Football",
    "Table Tennis",
    "Tennis",
    "Volleyball",
  ];
  public value: any = [];
  onPreviewEmailHeaderFooterOpenClicked(){
    this.isShowPreviewEmailHeaderFooterDialog = true;
  }
  onPreviewEmailHeaderFooterCloseClicked(){
    this.isShowPreviewEmailHeaderFooterDialog = false;
  }

  onSendTestOpenClicked(){
    this.isShowSendTextDialog = true;
  }
  onSendTestCloseClicked(){
    this.isShowSendTextDialog = false;
  }


  onOpenAddLanguageDetailClicked(){
    this.isAddLanguageDetailPopup  = true;
  }

  onCloseAddLanguageDetailClicked(){
    this.isAddLanguageDetailPopup  = false;
  }

  onOpenRemoveLanguageClicked(event: any){
    this.isRemoveLanguagePopup = true;
  }


  onCloseRemoveLanguageClicked(){
  this.isRemoveLanguagePopup = false;
}
}
