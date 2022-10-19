/** Angular **/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
/** Services **/
import { SignalrService } from './api/services/signalr.service';
export { SignalrService };
@NgModule({
  imports: [CommonModule],
})
export class SharedUtilSignalrModule {}
