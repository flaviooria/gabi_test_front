import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { delay, switchMap } from 'rxjs';
import { AuthService } from '../../../auth/services/auth.service';
import { WorkerService } from '../../../worker/services/worker.service';
import { Worker } from '../../../worker/interfaces/worker.interface';
import { User } from '../../../auth/interfaces/user.interface';
import { ServicioService } from '../../../servicio/services/servicio.service';
import { ServicesTypes } from '../../../servicio/interfaces/servicesTypes.interface';

@Component({
  selector: 'worker-profile-page',
  standalone: false,
  templateUrl: './profile-page.component.html',
})
export class ProfilePageComponent {
  public worker?: Worker;
  // Esto es para ver si entran al perfil ajeno o su mismo perfil
  public selfProfile: boolean = false;
  public services: ServicesTypes[] = [];

  constructor(
    private workerService: WorkerService,
    private servicioService: ServicioService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.servicioService.servicesTypes.subscribe(services => {
      this.services = services;
    });

    this.activatedRoute.params
    .pipe(
      delay(800), ///TODO se quitará luego
      switchMap(({ id }) => {
        const userRole = this.authService.currentUser?.rol;
        // Si no hay ID en la URL y el usuario es un worker, es su propio perfil
        if (!id && userRole !== 'worker') {
          this.router.navigate(['/']);
          return [];
        }
        // Determinamos si es el perfil propio (selfProfile)
        const token = localStorage.getItem('token');
        let idBuscar = id;
        if (!id) {
          this.selfProfile = true;
          idBuscar = token;
        }

        return this.workerService.getWorkerById(idBuscar);
      })
    ).subscribe((worker) => {
      if (!worker) {
        return this.router.navigate(['/helper']);
      }
      this.worker = worker;

      return;
    });
  }

  getServiceNames(servicesId: string): string[] {
    try {
      const ids = JSON.parse(servicesId) as number[];
      return ids
        .map(id => this.services.find(s => s.id === id)?.name || 'Desconocido')
        .filter(name => name !== 'Desconocido');
    } catch {
      return [];
    }
  }

  goAway(): void {
    this.router.navigateByUrl('/helper');
  }
}
