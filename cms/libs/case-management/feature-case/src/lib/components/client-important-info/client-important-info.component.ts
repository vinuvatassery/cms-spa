/** Angular **/
import { Component, ChangeDetectionStrategy, Input } from '@angular/core';


@Component({
  selector: 'case-management-client-important-info',
  templateUrl: './client-important-info.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class ClientImportantInfoComponent {
    /** Public properties **/
    @Input() clientId! : number



}