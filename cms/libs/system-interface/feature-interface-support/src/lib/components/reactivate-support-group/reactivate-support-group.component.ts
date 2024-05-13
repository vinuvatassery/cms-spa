import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { LoaderService } from '@cms/shared/util-core';

@Component({
  selector: 'reactivate-support-group',
  templateUrl: './reactivate-support-group.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReactivateSupportGroupComponent  {
  @Output() close = new EventEmitter<any>();
  @Output() reactivateConfimEvent = new EventEmitter<any>();


  /** Constructor **/
  constructor(private readonly loaderService: LoaderService,) {}

  onCancelClick() {
    this.close.emit();
  }
  onReactivateConfirm(status: boolean) {
      this.reactivateConfimEvent.emit(status);
    }

}
