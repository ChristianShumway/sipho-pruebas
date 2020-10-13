import { Component, OnInit } from '@angular/core';
import { NavigationService } from './../../../../shared/services/navigation.service';
import {MatDialog} from '@angular/material/dialog';
import { ModalPermisosComponent } from './../modal-permisos/modal-permisos.component';
import { PerfilesService } from '../../../../shared/services/perfiles.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { AutenticacionService } from 'app/shared/services/autenticacion.service';

@Component({
  selector: 'app-permisos',
  templateUrl: './permisos.component.html',
  styleUrls: ['./permisos.component.scss']
})
export class PermisosComponent implements OnInit {

  menu = [];
  permisos = [];
  perfiles = [];
  arbol = [];
  listaPermisosEspeciales = [];
  panelOpenState = false;
  firstSubPanelOpenState = false;
  secondSubPanelOpenState = false;

  constructor(
    private navigationService: NavigationService,
    public dialog: MatDialog,
    private perfilesService: PerfilesService,
    private snackBar: MatSnackBar,
    private autenticacionService: AutenticacionService
  ) { }

  ngOnInit() {
    this.navigation();
    // this.getOptionsToPermisosEspeciales();
  }

  navigation() {
    const currentProfile =   this.autenticacionService.currentProfileValue;
    this.navigationService.getMenuLoad(currentProfile.idPerfil).subscribe(
      menu => {
        console.log(menu);
        this.menu = menu.filter( opcion => opcion.type == 'dropDown' || opcion.type == 'link' || opcion.type == 'icon');
        console.log(this.menu);
        //  OBTENEMOS PERFILES
        this.perfilesService.getPerfiles(0).subscribe(
          (perfiles => {
            console.log(perfiles)
            this.perfiles = perfiles.content;
          }),
          (error => console.log(error))
        );
        
        // OBTENEMOS CATALOGO DE MODULOS CON PERMISOS
        this.navigationService.getPermisosMenu().subscribe(
          modulosPermisos => {
            this.permisos = modulosPermisos;
            console.log(this.permisos);
          },
          error => console.log(error)
        );
        
      },
      error => {
        console.log(error);
      }
    );
  }

  // getOptionsToPermisosEspeciales(){
  //   this.navigationService.getOptionsToPermisosEspeciales(1, 2).subscribe(
  //     options => this.listaPermisosEspeciales = options,
  //     error => console.log(error)
  //   );
  // }

  openModalPermisos(idModulo) {
    this.perfilesService.getAuthorizedProfiles(idModulo).subscribe(
      perfiles => this.loadModal(perfiles),
      error => console.log(error)
    );
  }

  loadModal(profile){
    const dialogRef = this.dialog.open(ModalPermisosComponent, {
      width: '300px',
      data: profile
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        console.log(JSON.stringify(result));
        this.perfilesService.updateAuthorizedProfile(result).subscribe(
          response => {
            if(response.estatus === '05'){
              this.useAlerts(response.mensaje, ' ', 'success-dialog');
            }
          },
          error => console.log(error)
        );
      }
    });
  }

  useAlerts(message, action, className){
    this.snackBar.open(message, action, {
      duration: 4000,
      verticalPosition: 'bottom',
      horizontalPosition: 'right',
      panelClass: [className]
    });
  }
  
  generaArbolModulo(obj){
    if(obj.sub) {
      obj.sub.find( modulo => {
        this.arbol.push(modulo.id);
        return this.generaArbolModulo(modulo);
      })
    }
  }

}
