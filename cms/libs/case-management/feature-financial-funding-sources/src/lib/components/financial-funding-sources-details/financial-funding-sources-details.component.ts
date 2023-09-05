

import {
  Component,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  Input,
  OnInit,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { Observable } from 'rxjs';

@Component({
  selector: 'cms-financial-funding-sources-details',
  templateUrl: './financial-funding-sources-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialFundingSourcesDetailsComponent implements OnInit {
  @Input() isEditFundingSource: any;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  @Output() isModalDetailsFundingSourcesCloseClicked = new EventEmitter();
  @Output() onAddFundingSourceEvent = new EventEmitter<any>();
  @Output() onUpdateFundingSourceEvent = new EventEmitter<any>();
  @Input() addFundingSource$: Observable<any> | undefined;
  @Input() updateFundingSource$: Observable<any> | undefined;
  FundingSourceCharachtersCount: any;
  maxlength = 200;
  FundingSourceCounter: any;
  FundingDescriptionCounter: any
  FundingDescriptionCharachtersCount: any
  fundingSourceForm = this.formBuilder.group({
    fundingSourceId: [null],
    fundingSourceCode: ['', Validators.required],
    fundingDesc: ['', Validators.required]
  })
  isSubmitted = false;

  constructor(public formBuilder: FormBuilder) {

  }

  ngOnInit(): void {
    if (this.isEditFundingSource) {
      this.fundingSourceForm.patchValue({
        fundingSourceId: this.isEditFundingSource.fundingSourceId,
        fundingSourceCode: this.isEditFundingSource.fundingSourceCode,
        fundingDesc: this.isEditFundingSource.fundingDesc,
      })
    }
  }

  closeDetailsFundingSourcesClicked() {
    this.isModalDetailsFundingSourcesCloseClicked.emit(true);
  }

  addUpdateFundingSource() {
    this.isSubmitted = true;
    if (this.fundingSourceForm.invalid) {
      return;
    }
    let fundingSource = {
      fundingSourceId: this.fundingSourceForm?.controls.fundingSourceId.value,
      fundingSourceCode: this.fundingSourceForm?.controls.fundingSourceCode.value,
      fundingDesc: this.fundingSourceForm?.controls.fundingDesc.value
    }
    if (fundingSource.fundingSourceId) {
      this.onUpdateFundingSourceEvent.emit(fundingSource)
      this.updateFundingSource$?.subscribe(res => {
        this.closeDetailsFundingSourcesClicked();
      })
    } else {
      this.onAddFundingSourceEvent.emit(fundingSource)
      this.addFundingSource$?.subscribe(res => {
        this.closeDetailsFundingSourcesClicked();
      })
    }
  }

  onFundingSourceValueChange(event: any) {
    this.FundingSourceCharachtersCount = event.length;
    this.FundingSourceCounter = `${this.FundingSourceCharachtersCount}/${this.maxlength}`;
  }

  onFundingDescValueChange(event: any) {
    this.FundingDescriptionCharachtersCount = event.length;
    this.FundingDescriptionCounter = `${this.FundingDescriptionCharachtersCount}/${this.maxlength}`;
  }

}