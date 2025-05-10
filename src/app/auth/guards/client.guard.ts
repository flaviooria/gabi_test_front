import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, GuardResult, MaybeAsync, Route, Router, RouterStateSnapshot, UrlSegment } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, tap } from 'rxjs';

@Injectable({providedIn: 'root'})
export class ClientGuard {
    constructor(
        private authService: AuthService,
        private router:Router
    ) { }
    
}