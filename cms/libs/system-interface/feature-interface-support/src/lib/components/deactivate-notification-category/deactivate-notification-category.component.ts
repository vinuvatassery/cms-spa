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
    selector: 'deactivate-notification-category',
    templateUrl: './deactivate-notification-category.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
  })
  export class DeactivateNotificationCategoryComponent implements OnInit {
    @Output() close = new EventEmitter<any>();
    @Output() deactivateConfimEvent = new EventEmitter<any>();
 
  
    /** Constructor **/
    constructor(private readonly loaderService: LoaderService,) {}
  
    ngOnInit(): void { }
  
    onCancelClick() {
      this.close.emit();
    }

    onDeactivateConfirm(isDelete: boolean) {
        this.deactivateConfimEvent.emit(isDelete);
      }
  
  }
  