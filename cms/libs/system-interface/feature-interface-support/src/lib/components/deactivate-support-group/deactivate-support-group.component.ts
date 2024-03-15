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
    selector: 'deactivate-support-group',
    templateUrl: './deactivate-support-group.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
  })
  export class DeactivateSupportGroupComponent implements OnInit {
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
  