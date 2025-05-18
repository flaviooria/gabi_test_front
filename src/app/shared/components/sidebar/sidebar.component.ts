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
      { label: 'Notificaciones', icon: 'fa-envelope', url: '/' },
      // { label: 'Buscar Servicios', icon: 'fa-search', url: './services/search' },
      // { label: 'Buscar Trabajadores', icon: 'fa-users', url: './workers/search' },
      { label: 'Servicios ' + (this.userRole == 'worker' ? 'Asignados' : 'Solicitados'), icon: 'fa-receipt', url: './services/list' },
      { label: 'Historial de servicios', icon: 'fa-history', url: './services/history' },
      // { label: 'Mensajes', icon: 'fa-message', url: './messages' },
      // { label: 'Perfil', icon: 'fa-user', url: './profile' },
      // { label: 'Ajustes', icon: 'fa-cog', url: './settings' },
      { label: 'Cerrar Sesión', icon: 'fa-sign-out-alt', url: './logout' }
    ]
    if (this.userRole == 'client') {
      this.sidebarItems.splice(1, 0, { label: 'Solicitar Servicio', icon: 'fa-plus-square', url: './services/request' });
    }
  }
}
//TODO: hacer un get para recoger los servicios que ya estén terminados o no esten vigentes (historial)
//TODO: Una tabla de notificaciones