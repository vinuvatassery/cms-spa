/** Angular **/
import { Injectable } from '@angular/core';
/** External libraries **/
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
/** Entities **/
import { DirectMessage } from '../entities/direct-message';
/** Data services **/
import { DirectMessageDataService } from '../infrastructure/direct-message.data.service';

@Injectable({ providedIn: 'root' })
export class DirectMessageFacade {
  /** Private properties **/
  private directMessagesSubject = new BehaviorSubject<DirectMessage[]>([]);

  /** Public properties **/
  directMessages$ = this.directMessagesSubject.asObservable();

  /** Constructor **/
  constructor(
    private readonly directMessageDataService: DirectMessageDataService
  ) {}

  /** Public methods **/
  loadDirectMessages(): void {
    this.directMessageDataService.loadDirectMessages().subscribe({
      next: (directMessageResponse) => {
        this.directMessagesSubject.next(directMessageResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }
}
