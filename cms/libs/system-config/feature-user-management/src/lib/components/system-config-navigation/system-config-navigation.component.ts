import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
@Component({
  selector: 'system-config-system-config-navigation',
  templateUrl: './system-config-navigation.component.html',
  styleUrls: ['./system-config-navigation.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SystemConfigNavigationComponent implements OnInit {
  public formUiStyle : UIFormStyle = new UIFormStyle();
  constructor() { }

  ngOnInit(): void {
  }

  

}
