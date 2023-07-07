import { Component, Input } from '@angular/core';

@Component({
  selector: 'productivity-tools-approvals-general-list',
  templateUrl: './approvals-general-list.component.html',
  styleUrls: ['./approvals-general-list.component.scss'],
})
export class ApprovalsGeneralListComponent {

  @Input() approvalsLists : any;
}
