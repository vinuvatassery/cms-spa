import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomainsListComponent } from './components/domains-list/domains-list.component';
import { AssisterGroupsListComponent } from './components/assister-groups-list/assister-groups-list.component';

@NgModule({
  imports: [CommonModule],
  declarations: [
    DomainsListComponent,
    AssisterGroupsListComponent,
  ],
})
export class SystemConfigFeatureOtherListsModule {}
