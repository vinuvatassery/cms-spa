import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'cms-email-template-list',
  templateUrl: './email-template-list.component.html',
  styleUrls: ['./email-template-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EmailTemplateListComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
