import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa'; 
@Component({
  selector: 'cms-medical-claims-print-authorization',
  templateUrl: './medical-claims-print-authorization.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalClaimsPrintAuthorizationComponent {
  public width = "100%";
  public height = "100%";
  public formUiStyle: UIFormStyle = new UIFormStyle();
  finalPrintList!: any[];
  isChecked: boolean = true;

    /** Input properties **/
  @Input() items!: any[];
  @Input() printOption: boolean = false;

  /** Output properties  **/
  @Output() onClosePrintAdviceLetterEvent = new EventEmitter<any>();

  onClosePrintAdviceLetterClicked() {
    this.onClosePrintAdviceLetterEvent.emit('Close');
  }

  toggleCheckbox(selectedKeys: any): void {
    this.finalPrintList = this.items;

  }

  onCheckboxChange(event: any): void {
    this.isChecked = event.target.checked;
  }
}
