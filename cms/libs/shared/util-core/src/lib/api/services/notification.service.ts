/** Angular **/
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  /* Public Methods */
  default(message: string, keepPrevious: boolean = false): void {
    this.show(message, 'none', keepPrevious);
  }

  info(message: string, keepPrevious: boolean = false): void {
    this.show(message, 'info', keepPrevious);
  }

  success(message: string, keepPrevious: boolean = false): void {
    this.show(message, 'success', keepPrevious);
  }

  warn(message: string, keepPrevious: boolean = false): void {
    this.show(message, 'warning', keepPrevious);
  }

  error(message: string, keepPrevious: boolean = false): void {
    this.show(message, 'error', keepPrevious);
  }

  /* Private Methods */
  private show(message: string, type: any, keepPrevious: boolean) {
    console.log('Yet to be implemented', message, type, keepPrevious);
  }
}
