import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartComponent } from './components/chart/chart.component';
import { SharedUiKendoModule } from '@cms/shared/ui-kendo';
import { PlaceholderDirective } from './directives/placeholder.directive';

@NgModule({
  imports: [CommonModule, SharedUiKendoModule],
  declarations: [
    ChartComponent,
    PlaceholderDirective
  ],
  exports:[ChartComponent, PlaceholderDirective]
})
export class SharedUiCommonModule {}
