/** Angular **/
import {
  Component,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  Input,
  OnInit,
} from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'case-management-send-id-card',
  templateUrl: './send-id-card.component.html',
  styleUrls: ['./send-id-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SendIdCardComponent implements OnInit {
  /** Input properties  **/
  @Input() mailingAddress$!: Observable<any>;
  /** Output properties  **/
  @Output() closeSendIdEvent = new EventEmitter();
  @Output() loadInitialData = new EventEmitter();

  ngOnInit(): void {
    this.loadInitialData.emit();
  }
  /** Internal event methods **/
  onCloseSendIdClicked() {
    this.closeSendIdEvent.emit();
  }
}
