/** Angular **/
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';

@Component({
  selector: 'case-management-upload-proof-document',
  templateUrl: './upload-proof-document.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadProofDocumentComponent {
  public formUiStyle : UIFormStyle = new UIFormStyle();
  public listItems: Array<string> = [
    "Baseball",
    "Basketball",
    "Cricket",
  
  ];
}
