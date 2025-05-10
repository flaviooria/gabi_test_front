import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ServicesTypes } from '../interfaces/servicesTypes.interface';
import { map, Observable, tap } from 'rxjs';
import { Service } from '../interfaces/service.interface';

@Injectable({
  providedIn: 'root'
})
export class ServicioService {

  private baseURL: string = environment.baseURL;

  constructor(private httpClient: HttpClient) { }

  get servicesTypes(): Observable<ServicesTypes[]> {
    return this.httpClient.get<any>(`${this.baseURL}/services/types`)
    .pipe(
      map(response => response.data)
    );
  }

  pendingServices(): Observable<Service[]> {
    const token = localStorage.getItem('token');
    return this.httpClient.get<any>(`${this.baseURL}/services/${token}/pending`)
    .pipe(
      map(response => response.data)
    );
  }

  solicitedServices(): Observable<Service[]> {
    const token = localStorage.getItem('token');
    return this.httpClient.get<any>(`${this.baseURL}/services/${token}/solicited`)
    .pipe(
      map(response => response.data)
    );
  }

  getService(servicioId: string): Observable<Service> {
    return this.httpClient.get<any>(`${this.baseURL}/services/${servicioId}`)
    .pipe(
      map(response => response.data)
    );
  }

  updateServiceStatus(servicioId: string, status: string): Observable<Service> {
    return this.httpClient.put<any>(`${this.baseURL}/services/${servicioId}/estado`, { status })
      .pipe(
        map(response => response.data)
      );
  }

  createService(serviceData: Partial<Service>): Observable<Service> {
    return this.httpClient.post<any>(`${this.baseURL}/services`, serviceData)
      .pipe(
        map(response => response.data)
      );
  }

  rateService(servicioId: string, ratingData: { client_rating?: number, worker_rating?: number, client_comments?: string, worker_comments?: string }): Observable<Service> {
    return this.httpClient.put<any>(`${this.baseURL}/services/${servicioId}/valorar`, ratingData)
      .pipe(
        map(response => response.data)
      );
  }


}
