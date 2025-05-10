import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class WorkerGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
  //   if (this.authService.isAuthenticated() && this.authService.getUserRole() === 'worker') {
  //     return true;
  //   }
  //   this.router.navigate(['/auth/login']);
    return false;
  }
}