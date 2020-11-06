import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AutenticacionService } from './../autenticacion.service';

@Injectable()
export class AuthGuard implements CanActivate {
  public authToken;
  
  constructor(
    private router: Router,
    private autenticacionService: AutenticacionService
  ) {}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    const currentUser =  await this.autenticacionService.currentUserValue;
    const currentProfile = await this.autenticacionService.currentProfileValue;
    console.log(currentUser);
    // console.log(currentProfile);
    if (currentUser) {
      return true
    }
    this.router.navigate(['/login']);
    return false;
  }
}