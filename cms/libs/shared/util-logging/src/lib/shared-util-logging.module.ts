import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoggingService } from './services/logging.service';
export { LoggingService };
@NgModule({
  imports: [CommonModule],
})
export class SharedUtilLoggingModule {}
