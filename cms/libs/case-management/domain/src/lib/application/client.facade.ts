import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Client } from '../entities/client';
import { ClientDataService } from '../infrastructure/client.data.service';

@Injectable({ providedIn: 'root' })
export class ClientFacade {
  private clientListSubject = new BehaviorSubject<Client[]>([]);
  clientList$ = this.clientListSubject.asObservable();

  constructor(private clientDataService: ClientDataService) {}

  load(): void {
    this.clientDataService.load().subscribe({
      next: (clientList) => {
        this.clientListSubject.next(clientList);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }
}
