
import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
  } from '@angular/core';
  import { LoaderService } from '@cms/shared/util-core';
  
  @Component({
    selector: 'remove-notification-category',
    templateUrl: './remove-notification-category.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
  })
  
  export class RemoveNotificationCategoryComponent implements OnInit {
    @Output() close = new EventEmitter<any>();
    @Output() deleteConfimEvent = new EventEmitter<any>();
 
  
    /** Constructor **/
    constructor(private readonly loaderService: LoaderService,) {}
  
    ngOnInit(): void { }
  
    onCancelClick() {
      this.close.emit();
    }
    onDeleteConfirm(status: boolean) {
        this.deleteConfimEvent.emit(status);
      }
  
  }
  