import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { UIFormStyle, UploadFileRistrictionOptions } from '@cms/shared/ui-tpa';

@Component({
  selector: 'system-config-template-layout-new-form',
  templateUrl: './template-layout-new-form.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TemplateLayoutNewFormComponent {
  public formUiStyle : UIFormStyle = new UIFormStyle();
  public uploadFileRestrictions: UploadFileRistrictionOptions = new UploadFileRistrictionOptions();
isShowPopupClicked = false;
isShowPreviewLetterHeaderFooterDialog = false; 
isAddLanguageDetailPopup  = false;
isRemoveLanguagePopup = false;
isBccEnable = false;
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
public listItems: Array<string> = [
  "oregon@letter.com",
  "oregon1@letter.com",
  "oregon12@letter.com",
  "oregon123@letter.com",
  "oregon2123@letter.com",
  "oregon34@letter.com",
  "oregon23@letter.com",
  "oregon54@letter.com",
];
public value: any = [];
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
