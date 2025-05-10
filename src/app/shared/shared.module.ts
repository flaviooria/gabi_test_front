import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { HeaderComponent } from './components/header/header.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { Error404PageComponent } from './pages/error404-page/error404-page.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { LoadingComponent } from './components/loading/loading.component';
import { AlertComponent } from './components/alert/alert.component';


@NgModule({
  declarations: [
    HeaderComponent,
    ConfirmDialogComponent,
    Error404PageComponent,
    SidebarComponent,
    LoadingComponent,
    AlertComponent
  ],
  imports: [
    CommonModule,
    SharedRoutingModule
  ],
  exports: [
    HeaderComponent,
    SidebarComponent,
    LoadingComponent
  ]
})
export class SharedModule { }
