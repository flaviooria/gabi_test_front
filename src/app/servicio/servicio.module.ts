import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServicioRoutingModule } from './servicio-routing.module';
import { ServicesListPageComponent } from './pages/services-list-page/services-list-page.component';
import { ServiceDetailPageComponent } from './pages/service-detail-page/service-detail-page.component';
import { StatusPipe } from './pipes/status.pipe';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { ServiceRequestPageComponent } from './pages/service-request-page/service-request-page.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { DateFormatPipe } from './pipes/date-format.pipe';


@NgModule({
  declarations: [
    ServicesListPageComponent,
    ServiceDetailPageComponent,
    StatusPipe,
    LayoutPageComponent,
    ServiceRequestPageComponent,
    DateFormatPipe
  ],
  imports: [
    CommonModule,
    RouterModule,
    ServicioRoutingModule,
    SharedModule
  ],
  exports: [
    ServicesListPageComponent,
  ]
})
export class ServicioModule { }
