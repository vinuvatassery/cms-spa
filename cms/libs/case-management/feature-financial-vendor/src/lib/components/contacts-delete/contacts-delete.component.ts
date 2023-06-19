import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'cms-contacts-delete',
  templateUrl: './contacts-delete.component.html',
  styleUrls: ['./contacts-delete.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactsDeleteComponent {}
