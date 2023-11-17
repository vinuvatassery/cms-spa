import { Component, OnInit } from '@angular/core';
import { ClientFacade } from '@cms/case-management/domain';

@Component({
  selector: 'case-management-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss'],
})
export class ClientComponent implements OnInit {
  clientList$ = this.clientFacade.clientList$;

  constructor(private clientFacade: ClientFacade) {}

  ngOnInit() {
    this.load();
  }

  load(): void {
    this.clientFacade.load();
  }
}
