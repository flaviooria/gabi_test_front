import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { delay, switchMap } from 'rxjs';
import { AuthService } from '../../../auth/services/auth.service';
import { ServicioService } from '../../../servicio/services/servicio.service';
import { Service } from '../../../servicio/interfaces/service.interface';
import { AlertService } from '../../../shared/services/alert.service';

@Component({
  selector: 'service-detail-page',
  standalone: false,
  templateUrl: './service-detail-page.component.html',
})
export class ServiceDetailPageComponent implements OnInit {
  public service?: Service;
  public isLoading = true;
  public userRole!:string;
  constructor(
    private servicioService: ServicioService,
    private activatedRoute: ActivatedRoute,
    private alertService: AlertService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.userRole = this.authService.decrypt(localStorage.getItem('r')!);
    this.activatedRoute.params
      .pipe(
        delay(800), // TODO: Se quitará luego
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
    this.router.navigateByUrl('/services/list');
  }

  changeServiceStatus(status: string): void {
    if (this.service) {
      this.servicioService.updateServiceStatus(this.service.id, status).subscribe({
        next: (updatedService) => {
          this.service = updatedService;
        },
        error: (err) => {
          console.error('Error al cambiar el estado del servicio:', err);
        }
      });
    }
  }

  acceptService(): void {
    this.changeServiceStatus('accepted');
    location.reload();
  }

  rejectService(): void {
    this.changeServiceStatus('cancelled');
    location.reload();
  }

  cancelService(): void {
    this.changeServiceStatus('cancelled');
    this.openRatingModal();
  }

  startService(): void {
    this.changeServiceStatus('in_progress');
    location.reload();
  }

  completeService(): void {
    this.changeServiceStatus('completed');
    this.openRatingModal();
  }

  confirmCashPayment(): void {
    if (this.service) {
      this.servicioService.confirmCashPayment(this.service.id, this.userRole).subscribe({
        next: () => {
          this.alertService.success('Pago en efectivo confirmado');
        },
        error: (err) => {
          this.alertService.error('Error al confirmar el pago');
        }
      });
    }
  }

  openRatingModal(): void {
    const modal = document.getElementById('valorarServicioModal');
    if (modal) {
      modal.classList.remove('hidden');
    }
  }

  calculateHours(startTime: string | Date, endTime: string | Date): number {
    const start = new Date(startTime);
    const end = new Date(endTime);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return 0;
    }
    const diffMs = end.getTime() - start.getTime();
    return Math.round(diffMs / (1000 * 60 * 60)); // Convertir a horas
  }
}