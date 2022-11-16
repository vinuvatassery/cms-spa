import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'system-config-client-profile-management-page',
  templateUrl: './client-profile-management-page.component.html',
  styleUrls: ['./client-profile-management-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClientProfileManagementPageComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
