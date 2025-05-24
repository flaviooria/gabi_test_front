import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'shared-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styles: ``
})
export class SidebarComponent implements OnInit {
  public userRole!:string;
  public sidebarItems!:{
    label: string,
    icon: string,
    url: string
  }[];

  constructor(
    private authService: AuthService
  ) {
  }

  ngOnInit() {
    this.userRole = this.authService.decrypt(localStorage.getItem('r')!);
    this.sidebarItems = [
      { label: 'Cerrar Sesión', icon: 'fa-sign-out-alt', url: './logout' }
    ]
    if (this.userRole == 'client') {
      this.sidebarItems.splice(0, 0, { label: 'Solicitar Servicio', icon: 'fa-plus-square', url: './services/request' });
    }
    if (this.userRole != 'admin') {
      this.sidebarItems.splice(0, 0, { label: 'Servicios ' + (this.userRole == 'worker' ? 'Asignados' : 'Solicitados'), icon: 'fa-receipt', url: './services/list' });
      this.sidebarItems.splice(0, 0, { label: 'Historial de servicios', icon: 'fa-history', url: './services/history' });
    }
    if (this.userRole == 'admin') {
      this.sidebarItems.splice(0, 0, { label: 'Añadir trabajador', icon: 'fa-user-plus', url: './helper/new-helper' });
      this.sidebarItems.splice(0, 0, { label: 'Ver Trabajadores', icon: 'fa-users', url: './helper/list' });
    }

  }
}
//TODO: hacer un get para recoger los servicios que ya estén terminados o no esten vigentes (historial)
//TODO: Una tabla de notificaciones