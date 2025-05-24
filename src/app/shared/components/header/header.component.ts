import { Component, OnDestroy } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import { FlowbiteService } from '../../../services/flowbite.service';
import { initFlowbite } from 'flowbite';
import { delay } from 'rxjs';
import { User } from '../../../auth/interfaces/user.interface';
import { Router } from '@angular/router';
import { fail } from 'assert';

@Component({
  selector: 'shared-header',
  standalone: false,
  templateUrl: './header.component.html',
})
export class HeaderComponent { // implements OnDestroy {

  public user?:User;
  public profileUrl?:string;
  public isWorker?:boolean;
  public isAdmin?:boolean = false;

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
    } else if(rol === 'client') {
      this.profileUrl = 'customer/profile';
      this.isWorker = false;
    } else {
      this.isWorker = false;
      this.isAdmin = true;
    }

  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/auth/login'])
  }
}
