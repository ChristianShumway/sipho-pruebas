import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AutenticacionService } from '../autenticacion.service';

@Injectable({
  providedIn: 'root'
})
export class AuthModuleGuard implements CanActivate {

  public authToken;
  public href;
  
  constructor(
    private router: Router,
    private autenticacionService: AutenticacionService
  ) {
    console.log(this.router.url);
  }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    const currentUser =  await this.autenticacionService.currentUserValue;
    console.log(currentUser);
    this.href = await this.router.url.substr(1);
    console.log(this.href);
    if (currentUser) {
      return true
    }
    this.router.navigate(['/login']);
    return false;
  }
  
}
