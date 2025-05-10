import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { delay, switchMap } from 'rxjs';
import { AuthService } from '../../../auth/services/auth.service';
import { ClientService } from '../../../client/services/client.service';
import { Client } from '../../../client/interfaces/client.interface';

@Component({
  selector: 'client-profile-page',
  standalone: false,
  templateUrl: './profile-page.component.html',
})
export class ProfilePageComponent implements OnInit {
  public client?: Client;
  public selfProfile: boolean = false;
  public paymentMethods: any[] = [];

  constructor(
    private clientService: ClientService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        delay(800),
        switchMap(({ id }) => {
          const userRole = this.authService.currentUser?.rol;
          if (!id && userRole !== 'client') {
            this.router.navigate(['/']);
            return [];
          }
          const token = localStorage.getItem('token');
          let idBuscar = id;
          if (!id) {
            this.selfProfile = true;
            idBuscar = token;
          }

          return this.clientService.getClienteById(idBuscar);
        })
      ).subscribe((client) => {
        if (!client) {
          return this.router.navigate(['/']);
        }

        this.client = client;
        return;
      });
  }

  goAway(): void {
    this.router.navigateByUrl('/');
  }
}