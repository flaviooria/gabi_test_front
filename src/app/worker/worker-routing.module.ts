import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewWorkerPageComponent } from './pages/new-worker-page/new-worker-page.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { SchedulePageComponent } from './pages/schedule-page/schedule-page.component';
import { ListPageComponent } from './pages/list-page/list-page.component';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutPageComponent,
    children: [
      { path: 'new-worker', component: NewWorkerPageComponent },
      { path: 'profile/edit', component: NewWorkerPageComponent },
      { path: 'profile', component: ProfilePageComponent},
      { path: 'list', component: ListPageComponent},
      { path: 'schedule', component: SchedulePageComponent},
      { path: ':id', component: ProfilePageComponent},
      { path: '**', redirectTo:'list'},
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkerRoutingModule { }
