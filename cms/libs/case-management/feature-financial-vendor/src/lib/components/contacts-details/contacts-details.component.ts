import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'cms-contacts-details',
  templateUrl: './contacts-details.component.html',
  styleUrls: ['./contacts-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactsDetailsComponent {}
