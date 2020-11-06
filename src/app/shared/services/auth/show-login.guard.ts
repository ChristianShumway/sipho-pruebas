import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AutenticacionService } from '../autenticacion.service';

@Injectable({
  providedIn: 'root'
})

export class ShowLoginGuard implements CanActivate {
  constructor(
    private router: Router,
    private autenticacionService: AutenticacionService
  ) {}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    const currentUser =  await this.autenticacionService.currentUserValue;
    console.log(currentUser);
    if (!currentUser) {
      return true
    }
    this.router.navigate(['/dashboard']);
    return false;
  }
}
