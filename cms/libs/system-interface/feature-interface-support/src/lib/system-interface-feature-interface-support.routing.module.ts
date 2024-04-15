import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InterfaceSupportPageComponent } from './container/interface-support-page/interface-support-page.component';
const routes: Routes = [
        {
          path: '',
          component: InterfaceSupportPageComponent,
          data: {
            title: 'Interface Support',
          },
        },
      
    ];
    
    @NgModule({
      imports: [CommonModule,
        RouterModule.forChild(routes),
      ], 
      exports: [RouterModule],
    })
export class  SystemInterfaceFeatureInterfaceSupportRoutingModule {}
