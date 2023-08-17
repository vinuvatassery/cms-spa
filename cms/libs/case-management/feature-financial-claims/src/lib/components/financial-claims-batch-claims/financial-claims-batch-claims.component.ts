import { ChangeDetectionStrategy, Output , EventEmitter, Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'cms-financial-claims-batch-claims',
  templateUrl: './financial-claims-batch-claims.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialClaimsBatchClaimsComponent {

  @Output() isModalBatchClaimsCloseClicked = new EventEmitter();
  @Output() isModalBatchClaimsButtonClicked = new EventEmitter<string>();
  @Input() selectedProcessClaimsCount = 0;
  batchManagerCode = new FormControl();
  ddlBatchManagers = [
    {
      "id": "c43fbe98-2f0f-4e8a-aaef-3098efe1bc78",
      "parentCode": null,
      "lovTypeCode": "BATCH_MANAGER",
      "lovCode": "MANAGER1",
      "lovDesc": "Myriam Polanco-Allen",
      "sequenceNbr": 1,
      "displayLanguageCode": null
    },
    {
      "id": "c43fbe98-2f0f-4e8a-aaef-3098efe1bc78",
      "parentCode": null,
      "lovTypeCode": "BATCH_MANAGER",
      "lovCode": "MANAGER2",
      "lovDesc": "Joanna Whitmore",
      "sequenceNbr": 1,
      "displayLanguageCode": null
    }
  ]

  closeBatchClaimsClicked(){
    this.isModalBatchClaimsCloseClicked.emit();
  }
  batchClaimsClicked(){
    if(this.batchManagerCode.valid)
    this.isModalBatchClaimsButtonClicked.emit(this.batchManagerCode.value);
  }
}
