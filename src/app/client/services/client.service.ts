import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError, delay, map, Observable, of, tap } from 'rxjs';
import { Client } from '../interfaces/client.interface';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private baseURL: string = environment.baseURL

  constructor(private httpClient: HttpClient) { }

  getClientes(): Observable<Client[]> {
    return this.httpClient.get<any>(`${ this.baseURL }/clients`)
    .pipe(
      map(respuesta => respuesta.data)
    );
  }

  getClienteById(id: number): Observable<Client>{
    return this.httpClient.get<any>(`${ this.baseURL }/clients/${ id }`)
    .pipe(
      delay(800),
      catchError(error => of(undefined)),
      map(respuesta => respuesta.data[0]) 
    );
  }

  updateCliente( cliente: Client ): Observable<Client>{
    if ( !cliente.id ) throw Error ('Cliente id is required');

    return this.httpClient.patch<any>(`${this.baseURL}/clients/${ cliente.id }`, cliente)
    .pipe(
      map(resultado => resultado.data)
    );
  }

  addPaymentMethod(clientId: string, cardToken: string): Observable<any> {
    return this.httpClient.post<any>(`${this.baseURL}/clients/${clientId}/payment-method`, { card_token: cardToken })
      .pipe(
        map(respuesta => respuesta),
        catchError(error => of(error))
      );
  }

  getPaymentMethods(clientId: string): Observable<any[]> {
    return this.httpClient.get<any>(`${this.baseURL}/clients/${clientId}/payment-methods`)
      .pipe(
        map(respuesta => respuesta.data),
        catchError(error => of([]))
      );
  }

  deletePaymentMethod(clientId: string): Observable<any> {
    return this.httpClient.delete<any>(`${this.baseURL}/clients/${clientId}/payment-methods`)
      .pipe(
        map(respuesta => respuesta),
        catchError(error => of(error))
      );
  }

}
