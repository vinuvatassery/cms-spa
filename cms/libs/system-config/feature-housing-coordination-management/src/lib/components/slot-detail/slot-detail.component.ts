import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
@Component({
  selector: 'system-config-slot-detail',
  templateUrl: './slot-detail.component.html',
  styleUrls: ['./slot-detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SlotDetailComponent implements OnInit {
  public formUiStyle : UIFormStyle = new UIFormStyle();
  constructor() { }

  ngOnInit(): void {
  }

}
