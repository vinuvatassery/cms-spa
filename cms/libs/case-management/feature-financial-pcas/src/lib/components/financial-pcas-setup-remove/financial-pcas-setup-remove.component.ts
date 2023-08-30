
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';

@Component({
  selector: 'cms-financial-pcas-setup-remove',
  templateUrl: './financial-pcas-setup-remove.component.html',
  styles:['.mt-04{    margin-top: 4px;  }  div.break {    word-wrap: break-word;  }']
})
export class FinancialPcasSetupRemoveComponent {
  /* Input Properties */
  @Input() pcaId?: string | null;
  @Input() pcaDesc!: string;
  @Input() fundingSource!: string;

  /* Output Properties */
  @Output() closeRemoveConfirmationEvent = new EventEmitter();
  @Output() removePcaEvent = new EventEmitter<string>();
  formUiStyle: UIFormStyle = new UIFormStyle();

  closeRemovePcaSetupClicked() {
    this.closeRemoveConfirmationEvent.emit(true);
  }

  removePcaHandler(){
    if(this.pcaId){
      this.removePcaEvent.emit(this.pcaId);
    }
  }
}

