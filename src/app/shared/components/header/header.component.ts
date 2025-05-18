import { Component, OnDestroy } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import { FlowbiteService } from '../../../services/flowbite.service';
import { initFlowbite } from 'flowbite';
import { delay } from 'rxjs';
import { User } from '../../../auth/interfaces/user.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'shared-header',
  standalone: false,
  templateUrl: './header.component.html',
})
export class HeaderComponent { // implements OnDestroy {

  public user?:User;
  public profileUrl?:string;
  public isWorker?:boolean;

  constructor(
    private authService: AuthService,
    private flowbiteService: FlowbiteService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.flowbiteService.loadFlowbite((flowbite) => {
      initFlowbite();
    });

    setTimeout(() => {
      this.user = this.authService.currentUser;
      this.setProfileUrl();
    }, 800);
    
  }

  setProfileUrl () : void {
    const rol = this.user?.rol;
    if (rol === 'worker') {
      this.profileUrl = 'helper/profile'
      this.isWorker = true;
      return;
    }
    this.profileUrl = 'customer/profile';
    this.isWorker = false;
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/auth/login'])
  }
}
