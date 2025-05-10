import { Component, Input, input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ClientService } from '../../services/client.service';
import { loadStripe, Stripe, StripeCardElement } from '@stripe/stripe-js';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'client-add-payment-method',
  standalone: false,
  templateUrl: './add-payment-method.component.html',
  styles: ``
})
export class AddPaymentMethodComponent implements OnInit {
  paymentForm: FormGroup = new FormGroup({});
  stripe: Stripe | null = null;
  card: StripeCardElement | null = null;
  cardError: string | null = null;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private router: Router
  ) {}


    async ngOnInit(): Promise<void> {
    this.paymentForm = this.fb.group({});
  }

  async ngAfterViewInit(): Promise<void> {
    this.stripe = await loadStripe(environment.stripePublicKey);
    if (!this.stripe) {
      this.cardError = 'Clave pública de Stripe no válida o no inicializada';
      console.error('Stripe no se inicializó correctamente');
      return;
    }

    console.log('Creando elemento de tarjeta Stripe...');
    const elements = this.stripe.elements();
    this.card = elements.create('card', {
      style: {
        base: {
          fontSize: '16px',
          color: '#374151',
          '::placeholder': {
            color: '#9CA3AF',
          },
          lineHeight: '1.5',
        },
        invalid: {
          color: '#EF4444',
        },
      },
    });
    if (this.card) {
      console.log('Montando elemento de tarjeta en #card-element');
      this.card.mount('#card-element');
    } else {
      this.cardError = 'No se pudo crear el elemento de tarjeta';
      console.error('No se pudo crear el elemento de tarjeta');
    }
  }

  async onSubmit(): Promise<void> {
    if (!this.stripe || !this.card) {
      console.error('Stripe o Card no están inicializados:', { stripe: this.stripe, card: this.card });
      this.cardError = 'Stripe no está inicializado correctamente';
      return;
    }

    this.loading = true;
    const token = localStorage.getItem('token');

    if (!token) {
      console.warn('No se encontró el cliente (token no disponible)');
      this.cardError = 'No se encontró el cliente';
      this.loading = false;
      return;
    }

    try {
      console.log('Intentando crear token con Stripe...');
      const result = await this.stripe.createToken(this.card);
      console.log('Resultado de createToken:', result);

      if (result.error) {
        console.log('Error al crear token:', result.error);
        this.cardError = result.error.message || 'Error al procesar la tarjeta';
        this.loading = false;
        return;
      }

      if (result.token) {
        console.log('Token creado exitosamente:', result.token.id);
        this.clientService.addPaymentMethod(token, result.token.id).subscribe({
          next: (response) => {
            console.log('Respuesta del backend:', response);
            this.loading = false;
            this.router.navigate(['/customer/payment-method']);
          },
          error: (err) => {
            console.error('Error del backend:', err);
            this.cardError = err.error?.message || 'Error al añadir el método de pago';
            this.loading = false;
          },
        });
      } else {
        console.warn('No se recibió un token de Stripe');
        this.cardError = 'No se pudo generar el token de la tarjeta';
        this.loading = false;
      }
    } catch (err) {
      console.error('Excepción capturada en createToken:', err);
      this.cardError = 'Error al procesar la tarjeta: ' + err;
      this.loading = false;
    }
  }

}