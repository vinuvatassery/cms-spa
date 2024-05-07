import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UIFormStyle, UploadFileRistrictionOptions } from '@cms/shared/ui-tpa';
@Component({
  selector: 'system-config-email-template-header-footer',
  templateUrl: './email-template-header-footer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmailTemplateHeaderFooterComponent {
  public formUiStyle : UIFormStyle = new UIFormStyle();
    public uploadFileRestrictions: UploadFileRistrictionOptions = new UploadFileRistrictionOptions();
  isShowPopupClicked = false;
  isShowPreviewEmailHeaderFooterDialog = false;
  isShowSendTextDialog = false;
  isAddLanguageDetailPopup  = false;
  isRemoveLanguagePopup = false;
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
