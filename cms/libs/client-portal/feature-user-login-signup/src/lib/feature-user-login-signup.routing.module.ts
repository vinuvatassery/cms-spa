/** Angular **/
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SigninComponent } from './component/signin/signin.component';

const routes: Routes = [
      {
        path: '',
        component: SigninComponent,
        data: {
          title: '',
        },
      },
      {
        path: 'signin',
        component: SigninComponent,
        data: {
          title: '',
        },
      },
    ];
    
    @NgModule({
      imports: [RouterModule.forChild(routes)],
      exports: [RouterModule],
    })
    export class featureUserLoginSignupRoutingModule {}

 