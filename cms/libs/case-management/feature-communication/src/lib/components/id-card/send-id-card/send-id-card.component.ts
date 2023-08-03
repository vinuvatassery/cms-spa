/** Angular **/
import {
  Component,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  Input,
  OnInit,
} from '@angular/core';
import { ClientFacade } from '@cms/case-management/domain';
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
  sendNewIDCard$ = this.clientfacade.sendNewIDCard$;
  clientId : number = 0;
  
  constructor(private readonly clientfacade : ClientFacade){}

  ngOnInit(): void {
    this.mailingAddress$.subscribe(next=>{
      if(next!=null){
        this.clientId = next.clientId;
      }
    });
    this.sendNewIDCard$.subscribe(data=>{
      if(data && this.clientId!=0) {
        this.onCloseSendIdClicked()
      }
    });
    this.loadInitialData.emit();
  }
  /** Internal event methods **/
  onCloseSendIdClicked() {
    this.closeSendIdEvent.emit(true);
  }
  sendNewIdCard():void{
    this.clientfacade.sendNewIdCard(this.clientId);
  }
}
