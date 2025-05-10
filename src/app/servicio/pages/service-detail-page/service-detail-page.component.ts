import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { delay, switchMap } from 'rxjs';
import { AuthService } from '../../../auth/services/auth.service';
import { ServicioService } from '../../../servicio/services/servicio.service';
import { Service } from '../../../servicio/interfaces/service.interface';

@Component({
  selector: 'service-detail-page',
  standalone: false,
  templateUrl: './service-detail-page.component.html',
})
export class ServiceDetailPageComponent implements OnInit {
  public service?: Service;
  public isLoading = true;

  constructor(
    private servicioService: ServicioService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        delay(800), // TODO: Se quitará luego, como en tu ejemplo
        switchMap(({ id }) => {
          if (!id) {
            this.router.navigate(['/']);
            return [];
          }
          return this.servicioService.getService(id);
        })
      )
      .subscribe((service) => {
        this.isLoading = false;
        if (!service) {
          this.router.navigate(['/']);
          return;
        }

        // Verificar si el usuario actual es el cliente o el trabajador del servicio
        const currentUser = this.authService.currentUser;
        if (!currentUser) {
          this.router.navigate(['/']);
          return;
        }

        const isClient = service.client?.user?.id === currentUser.id;
        const isWorker = service.worker?.user?.id === currentUser.id;

        if (!isClient && !isWorker) {
          this.router.navigate(['/']);
          return;
        }

        this.service = service;
      });
  }

  goBack(): void {
    this.router.navigateByUrl('/');
  }

  acceptService(): void {
    if (this.service) {
      this.servicioService.updateServiceStatus(this.service.id, 'accepted').subscribe({
        next: (updatedService) => {
          this.service = updatedService;
          location.reload();
        },
        error: (err) => {
          console.error('Error al aceptar el servicio:', err);
        }
      });
    }
  }

  rejectService(): void {
    if (this.service) {
      this.servicioService.updateServiceStatus(this.service.id, 'cancelled').subscribe({
        next: (updatedService) => {
          this.service = updatedService;
          location.reload();
        },
        error: (err) => {
          console.error('Error al rechazar el servicio:', err);
        }
      });
    }
  }

  cancelService(): void {
    if (this.service) {
      this.servicioService.updateServiceStatus(this.service.id, 'cancelled').subscribe({
        next: (updatedService) => {
          this.service = updatedService;
          location.reload();
        },
        error: (err) => {
          console.error('Error al cancelar el servicio:', err);
        }
      });
    }
  }
}