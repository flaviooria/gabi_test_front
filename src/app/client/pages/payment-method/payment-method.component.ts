import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ClientService } from '../../services/client.service';
import { loadStripe, Stripe, StripeCardElement } from '@stripe/stripe-js';
import { environment } from '../../../environments/environment.prod';

@Component({
  selector: 'client-payment-method',
  standalone: false,
  templateUrl: './payment-method.component.html',
  styles: ``
})

export class PaymentMethodComponent implements OnInit {
  public add_payment_method: boolean = false;
  public paymentMethods: any[] = [];
  public hasPaymentMethod: boolean = false;
  public loading: boolean = false;

  constructor(
    private clientService: ClientService
  ) {}

  async ngOnInit(): Promise<void> {
    this.loading = true;
    // Cargar los métodos de pago
    const token = localStorage.getItem('token');
    if (token) {
      this.clientService.getPaymentMethods(token).subscribe(methods => {
        this.paymentMethods = methods;
        this.hasPaymentMethod = methods.length > 0;
        this.loading = false;
      }, error => {
        console.error('Error al cargar métodos de pago:', error);
        this.loading = false;
      });
    }
  }

  change_payment_method() {
    this.add_payment_method = true;
  }

  deletePaymentMethod() {
    const token = localStorage.getItem('token');
    if (token) {
      this.clientService.deletePaymentMethod(token).subscribe({
        next: (response) => {
          console.log('Método de pago eliminado:', response);
          this.paymentMethods = []; // Limpiar la lista localmente
        },
        error: (err) => {
          console.error('Error al eliminar método de pago:', err);
        }
      });
    }
  }

}