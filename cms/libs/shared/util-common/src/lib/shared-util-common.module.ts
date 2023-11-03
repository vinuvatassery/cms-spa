/** Angular **/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridHelperService } from './helpers/grid-helper.service';

export { GridHelperService };
@NgModule({
  imports: [CommonModule]
})
export class SharedUtilCommonModule {}
