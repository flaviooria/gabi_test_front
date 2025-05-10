import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ClientService } from '../../services/client.service';
import { loadStripe, Stripe, StripeCardElement } from '@stripe/stripe-js';
import { environment } from '../../../environments/environment';

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

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    // Cargar los métodos de pago
    const token = localStorage.getItem('token');
    if (token) {
      this.clientService.getPaymentMethods(token).subscribe(methods => {
        this.paymentMethods = methods;
        this.hasPaymentMethod = methods.length > 0;
      }, error => {
        console.error('Error al cargar métodos de pago:', error);
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