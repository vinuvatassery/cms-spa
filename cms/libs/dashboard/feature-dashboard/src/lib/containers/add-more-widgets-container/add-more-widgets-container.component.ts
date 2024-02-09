import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'dashboard-add-more-widgets-container',
  templateUrl: './add-more-widgets-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddMoreWidgetsContainerComponent {
  @Output() addItem = new EventEmitter<any>();

  addItemComp(widgetName : any)
  {
    this.addItem.emit(widgetName)
  }
}
