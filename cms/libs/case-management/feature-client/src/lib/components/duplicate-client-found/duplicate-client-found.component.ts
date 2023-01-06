/** Angular **/
import { Component, ChangeDetectionStrategy } from '@angular/core';
import {
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  ChangeDetectorRef,
} from '@angular/core';
@Component({
  selector: 'case-management-duplicate-client-found',
  templateUrl: './duplicate-client-found.component.html',
  styleUrls: ['./duplicate-client-found.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DuplicateClientFoundComponent implements OnInit {

  @Input() currentClientInfo: any = {};
  @Input() matchingClientInfo: any = {};

  @Output() closeModalClick = new EventEmitter<any>();
  ssn: string = '';
  constructor() {

  }

  ngOnInit(): void {
    if (this.currentClientInfo.ssn != this.matchingClientInfo.ssn) {
      this.ssn = '000-00-0000'
    }
    else {
      this.ssn = this.currentClientInfo.ssn
    }
  }

  onDuplicateFoundClick() {
    this.closeModalClick.next(true);
  }

  onNotaDuplicateClick() {
    this.closeModalClick.next(true);
  }
}

