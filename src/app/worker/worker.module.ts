import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkerRoutingModule } from './worker-routing.module';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { SchedulePageComponent } from './pages/schedule-page/schedule-page.component';
import { SchedulePipe } from './pipes/schedule.pipe';
import { NewWorkerPageComponent } from './pages/new-worker-page/new-worker-page.component';
import { ListPageComponent } from './pages/list-page/list-page.component';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { DateFormatPipe } from './pipes/date-format.pipe';
import { ServicioModule } from '../servicio/servicio.module';


@NgModule({
  declarations: [
    ProfilePageComponent,
    SchedulePageComponent,
    SchedulePipe,
    NewWorkerPageComponent,
    ListPageComponent,
    LayoutPageComponent,
    DateFormatPipe,
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    WorkerRoutingModule,
    ReactiveFormsModule,
    ServicioModule
  ]
})
export class WorkerModule { }
