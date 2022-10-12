import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'cms-client-profile-management-page',
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
