import { Component, OnInit } from '@angular/core';
import { WorkerService } from '../../services/worker.service';
import { ServicioService } from '../../../servicio/services/servicio.service';
import { Worker } from '../../interfaces/worker.interface';
import { ServicesTypes } from '../../../servicio/interfaces/servicesTypes.interface';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'worker-list-page',
  standalone: false,
  templateUrl: './list-page.component.html',
  styles: [`
    .rating-star {
      color: #FFD700; /* Dorado para estrellas */
    }
  `]
})
export class ListPageComponent implements OnInit {
  workers: Worker[] = [];
  filteredWorkers: Worker[] = [];
  services: ServicesTypes[] = [];
  searchControl = new FormControl('');
  selectedWorkers = new Set<string>();

  constructor(
    private workerService: WorkerService,
    private servicioService: ServicioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Cargar servicios
    this.servicioService.servicesTypes.subscribe(services => {
      this.services = services;
    });

    // Cargar trabajadores
    this.workerService.getWorkers().subscribe(workers => {
      this.workers = workers;
      this.filteredWorkers = workers;
    });

    // Configurar búsqueda
    this.searchControl.valueChanges
      .pipe(debounceTime(300))
      .subscribe(searchTerm => {
        this.filterWorkers(searchTerm || '');
      });
  }

  getServiceNames(services_id: string): string {
    try {
      const ids = JSON.parse(services_id) as number[];
      return ids
        .map(id => this.services.find(s => s.id === id)?.name || 'Desconocido')
        .join(', ');
    } catch {
      return 'Sin habilidades';
    }
  }

  getRatingStars(rating: string): number {
    return parseFloat(rating) || 0;
  }

  filterWorkers(searchTerm: string): void {
    if (!searchTerm) {
      this.filteredWorkers = this.workers;
      return;
    }
    const term = searchTerm.toLowerCase();
    this.filteredWorkers = this.workers.filter(worker =>
      worker.user.nombre.toLowerCase().includes(term) ||
      worker.user.email.toLowerCase().includes(term)
    );
  }

  toggleWorkerSelection(workerId: string): void {
    if (this.selectedWorkers.has(workerId)) {
      this.selectedWorkers.delete(workerId);
    } else {
      this.selectedWorkers.add(workerId);
    }
  }

  toggleAllSelection(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.selectedWorkers.clear();
    if (checked) {
      this.filteredWorkers.forEach(worker => this.selectedWorkers.add(worker.id));
    }
  }

  viewProfile(workerId: string): void {
    this.router.navigate(['/helper', workerId]);
  }

  performAction(action: string): void {
    console.log(`Acción: ${action} para trabajadores seleccionados`, this.selectedWorkers);
    // TODO poder eliminar o bloquear si da tiempo jejeje
  }
}