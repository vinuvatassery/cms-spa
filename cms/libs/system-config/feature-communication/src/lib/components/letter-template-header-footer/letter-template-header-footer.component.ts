 
import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { UIFormStyle, UploadFileRistrictionOptions } from '@cms/shared/ui-tpa';
import {
  TabCloseEvent,
  TabStripComponent,
} from "@progress/kendo-angular-layout";
@Component({
  selector: 'system-config-letter-template-header-footer',
  templateUrl: './letter-template-header-footer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LetterTemplateHeaderFooterComponent {
  public formUiStyle : UIFormStyle = new UIFormStyle();
    public uploadFileRestrictions: UploadFileRistrictionOptions = new UploadFileRistrictionOptions();
  isShowPopupClicked = false;
  isShowPreviewLetterHeaderFooterDialog = false; 
  isAddLanguageDetailPopup  = false;
  isRemoveLanguagePopup = false;
  isLetterTemplateLeavePopupShow = false;
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

  onPreviewLetterHeaderFooterOpenClicked(){
    this.isShowPreviewLetterHeaderFooterDialog = true;
  }
  onPreviewLetterHeaderFooterCloseClicked(){
    this.isShowPreviewLetterHeaderFooterDialog = false;
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

onLetterTemplateLeaveClicked() {
  this.isLetterTemplateLeavePopupShow = true;
}
onCloseLetterTemplateLeaveClicked() {
  this.isLetterTemplateLeavePopupShow = false;
}
}
