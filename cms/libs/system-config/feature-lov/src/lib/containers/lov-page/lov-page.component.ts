/** Angular **/
import { Component, ChangeDetectionStrategy } from '@angular/core';
/** Facades **/
import { LovFacade } from '@cms/system-config/domain';

@Component({
  selector: 'system-config-lov-page',
  templateUrl: './lov-page.component.html',
  styleUrls: ['./lov-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LovPageComponent  {
  /** Public properties **/
  lovs$ = this.lovFacade.lovs$;

  /** Constructor **/
  constructor(private readonly lovFacade: LovFacade) {}
 
}
