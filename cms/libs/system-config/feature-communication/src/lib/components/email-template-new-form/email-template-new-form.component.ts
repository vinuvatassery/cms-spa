import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UIFormStyle, UploadFileRistrictionOptions } from '@cms/shared/ui-tpa';
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
  isEmailTemplateLeavePopupShow = false;
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
    "oregon@email.com",
    "oregon1@email.com",
    "oregon12@email.com",
    "oregon123@email.com",
    "oregon2123@email.com",
    "oregon34@email.com",
    "oregon23@email.com",
    "oregon54@email.com",
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


onEmailTemplateLeaveClicked() {
  this.isEmailTemplateLeavePopupShow = true;
}
onCloseEmailTemplateLeaveClicked() {
  this.isEmailTemplateLeavePopupShow = false;
}

}
