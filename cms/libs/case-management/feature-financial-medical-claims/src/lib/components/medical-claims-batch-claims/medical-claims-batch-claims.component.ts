import { ChangeDetectionStrategy, Output, Input , EventEmitter, Component } from '@angular/core'; 

@Component({
  selector: 'cms-medical-claims-batch-claims',
  templateUrl: './medical-claims-batch-claims.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalClaimsBatchClaimsComponent {
  
  @Output() isModalBatchClaimsCloseClicked = new EventEmitter();
  @Output() isModalBatchClaimsButtonClicked = new EventEmitter();
  @Input() selectedProcessClaimsCount: Number = 0; 
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
    this.isModalBatchClaimsCloseClicked.emit(true);  
  }
  batchClaimsClicked(){
    this.isModalBatchClaimsButtonClicked.emit(true);  
  }
}
