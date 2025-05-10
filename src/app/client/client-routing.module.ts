import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { ListPageComponent } from './pages/list-page/list-page.component';
import { PaymentMethodComponent } from './pages/payment-method/payment-method.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutPageComponent,
    children: [
      { path:'profile', component: ProfilePageComponent },
      { path:'list', component: ListPageComponent },
      { path:'payment-method', component: PaymentMethodComponent },
      { path:':id', component: ProfilePageComponent },
      { path: '**', redirectTo: 'list' }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
