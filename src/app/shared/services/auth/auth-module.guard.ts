import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AutenticacionService } from '../autenticacion.service';
import { NavigationService } from '../navigation.service';

@Injectable({
  providedIn: 'root'
})
export class AuthModuleGuard implements CanActivate {

  public authToken;
  public href;
  
  constructor(
    private router: Router,
    private autenticacionService: AutenticacionService,
    private navigationService: NavigationService
  ) {
  }
  
  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    
    const currentProfile =   this.autenticacionService.currentProfileValue;
    // console.log(currentProfile);
    this.href = await window.location.hash.substr(1);
    // console.log(this.href);
    this.authToken  = await this.navigationService.getOptionsMenu().subscribe(
      (options: any[]) => {
        // console.log(options);
        const modulo = options.filter( option => option.pagina === this.href);
        // console.log(modulo);
        if(modulo.length === 1){
          const idModulo = modulo[0].idConfiguracion;
          // console.log(idModulo);
          this.autenticacionService.userAuthenticated(currentProfile.idPerfil, idModulo).subscribe(
            (result: any) =>{
              // console.log(result);
              if(result.noEstatus === 0){
                this.router.navigate(['/dashboard']);
                return false;
              } else {
                return true;
              }
            } ,
            error => console.log(error)
          );
        }
      },
      error => console.log(error)
    );

    // await console.log(this.authToken);

    // if (currentUser) {
    return true
    // }
    // this.router.navigate(['/login']);
    // return false;
  }
  
}
