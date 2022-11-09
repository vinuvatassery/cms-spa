import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'system-config-ps-mfr-zip-detail',
  templateUrl: './ps-mfr-zip-detail.component.html',
  styleUrls: ['./ps-mfr-zip-detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PsMfrZipDetailComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
