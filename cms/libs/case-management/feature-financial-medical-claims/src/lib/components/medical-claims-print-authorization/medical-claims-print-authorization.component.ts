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
  printCount: number = 0;

    /** Input properties **/
  @Input() items!: any[];
  @Input() printOption: boolean = false;

  /** Output properties  **/
  @Output() onClosePrintAdviceLetterEvent = new EventEmitter<any>();

  // printLetterCount: number = this.items.length;
  ngOnInit(): void {
    this.finalPrintList = this.items;
    this.getPrintLetterCount();
  }

  onClosePrintAdviceLetterClicked() {
    this.onClosePrintAdviceLetterEvent.emit('Close');
  }

  onCheckboxChange(event: any, item: any): void {
    item.isChecked = event.target.checked;
    if(this.printOption){
      if(item.isChecked)
      {
      this.finalPrintList.push(item);
      }
      else{
        this.finalPrintList = this.finalPrintList.filter(element => element.item !== item.item);
      }
    }else{
      if(item.isChecked)
      {
      this.finalPrintList.push(item);
      }
      else{
        this.finalPrintList = this.finalPrintList.filter(element => element.warrantNumber !== item.warrantNumber);
      }
    }
    this.printCount = this.finalPrintList.length;
  }

  getPrintLetterCount(){
    this.printCount = this.items.length;
  }
}
