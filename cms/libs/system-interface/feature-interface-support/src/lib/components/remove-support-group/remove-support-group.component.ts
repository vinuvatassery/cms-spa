import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { LoaderService } from '@cms/shared/util-core';

@Component({
  selector: 'remove-support-group',
  templateUrl: './remove-support-group.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RemoveSupportGroupComponent  {
  @Output() close = new EventEmitter<any>();
  @Output() deleteConfimEvent = new EventEmitter<any>();


  /** Constructor **/
  constructor(private readonly loaderService: LoaderService,) {}

  onCancelClick() {
    this.close.emit();
  }
  onDeleteConfirm(status: boolean) {
      this.deleteConfimEvent.emit(status);
    }

}
