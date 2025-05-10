import { Component } from '@angular/core';

@Component({
  selector: 'shared-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styles: ``
})
export class SidebarComponent {
  public sidebarItems = [
    { label: 'Inicio', icon: 'fa-house', url: './dashboard' },
    { label: 'Buscar Servicios', icon: 'fa-search', url: './services/search' },
    { label: 'Buscar Trabajadores', icon: 'fa-users', url: './workers/search' },
    { label: 'Solicitar Servicio', icon: 'fa-plus-square', url: './services/request' },
    { label: 'Registrar Servicio', icon: 'fa-plus-circle', url: './services/register' },
    { label: 'Historial de Servicios', icon: 'fa-history', url: './services/history' },
    { label: 'Historial de Trabajos', icon: 'fa-history', url: './jobs/history' },
    { label: 'Mensajes', icon: 'fa-envelope', url: './messages' },
    { label: 'Perfil', icon: 'fa-user', url: './profile' },
    { label: 'Ajustes', icon: 'fa-cog', url: './settings' },
    { label: 'Cerrar Sesión', icon: 'fa-sign-out-alt', url: './logout' }
  ]
}
