import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError, delay, map, Observable, of, tap } from 'rxjs';
import { Worker } from '../interfaces/worker.interface';
import { User } from '../../auth/interfaces/user.interface';
import { WorkerTemplate } from '../interfaces/workertemplate.interface';
import { Service } from '../../servicio/interfaces/service.interface';

@Injectable({
  providedIn: 'root'
})
export class WorkerService {

  private baseURL: string = environment.baseURL;

  constructor(private httpClient: HttpClient) { }

  getWorkers(): Observable<Worker[]> {
    return this.httpClient.get<any>(`${this.baseURL}/workers`)
    .pipe(
      map(response => response.data)
    );
  }

  getWorkerById(id: string): Observable<Worker> {
    return this.httpClient.get<any>(`${this.baseURL}/workers/${id}`)
      .pipe(
        catchError(error => of(undefined)),
        map(response => response.data[0])
      );
  }

  createWorker(worker: WorkerTemplate): Observable<Worker> {
    return this.httpClient.post<any>(`${this.baseURL}/workers`, worker)
    .pipe(
      map(response => response.data)
    );
  }

  updateWorkerProfile(worker: Worker): Observable<Worker> {
    if (!worker.id) throw Error('Worker id is required');
    return this.httpClient.put<any>(`${this.baseURL}/workers/${worker.id}/profile`, worker)
      .pipe(
        map(response => response.data)
      );
  }

  updateWorkerSchedule(workerId: string, disponibilidad: any): Observable<Worker> {
    return this.httpClient.put<any>(`${this.baseURL}/workers/${workerId}/schedule`, { disponibilidad })
      .pipe(
        map(response => response.data)
      );
  }

  getWorkerHorario(workerId: string): Observable<Service> {
    return this.httpClient.get<any>(`${this.baseURL}/workers/${workerId}/schedule`)
      .pipe(
        catchError(error => of(undefined)),
        map(response => response.data)
      );
  }

  deleteWorker(id: string): Observable<void> {
    return this.httpClient.delete<any>(`${this.baseURL}/workers/${id}`)
      .pipe(
        map(response => response.data)
      );
  }

  filterWorkers(query: string): Observable<Worker[]> {
    return this.httpClient.get<any>(`${this.baseURL}/workers/filter?q=${encodeURIComponent(query)}`)
    .pipe(
      map(response => response.data)
    );
  }
}