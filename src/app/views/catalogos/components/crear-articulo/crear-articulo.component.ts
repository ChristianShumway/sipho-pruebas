import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Articulo, EstatusArticulo } from 'app/shared/models/articulo';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ArticuloService } from 'app/shared/services/articulo.service';
import { AutenticacionService } from 'app/shared/services/autenticacion.service';
import { FamiliaService } from 'app/shared/services/familia.service';
import { Familia } from 'app/shared/models/familia';
import { MatButton } from '@angular/material';
import { environment } from './../../../../../environments/environment';
import { NavigationService } from 'app/shared/services/navigation.service';

@Component({
  selector: 'app-crear-articulo',
  templateUrl: './crear-articulo.component.html',
  styleUrls: ['./crear-articulo.component.scss']
})
export class CrearArticuloComponent implements OnInit {

  articuloForm: FormGroup;
  idUsuarioLogeado;
  familias: Familia[] = [];
  catalogEstatus: EstatusArticulo[] = [];
  @ViewChild(MatButton, {static: false}) submitButton: MatButton;
  perfil;
  nombrePermiso = 'crud-articulos';
  permisosEspecialesPermitidos: any[] = []; //array donde se agrega el nombre de las opciones a las cuales el usuario si tiene permiso

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private articuloService: ArticuloService,
    private autenticacionService: AutenticacionService,
    private familiaService: FamiliaService,
    private navigationService: NavigationService
  ) { }

  ngOnInit() {
    this.idUsuarioLogeado = this.autenticacionService.currentUserValue;
    this.perfil = this.autenticacionService.currentProfileValue;
    this.getValidations();
    this.getCatalogs();
    this.getPermisosEspeciales();
  }

  getCatalogs() {
    this.familiaService.getSelectFamilia().subscribe(
      (familias: Familia[]) => {
        this.familias = familias;
      },
      error => console.log(error)
    );

    this.articuloService.getSelectEstatusArticulo().subscribe(
      (data: EstatusArticulo[]) => {
        this.catalogEstatus = data;
      }
    );
  }

  getValidations() {
    this.articuloForm = new FormGroup({
      nombre: new FormControl('', [
        Validators.required,
      ]),
      familia: new FormControl('', [
        Validators.required,
      ]),
      estatusArticulo: new FormControl('', [
        Validators.required,
      ]),
      precioPublico: new FormControl('', [
        Validators.required,
      ]),
      costo: new FormControl('', [
        Validators.required,
      ]), 
      cantidadCharola: new FormControl('', [
        Validators.required,
      ]),
      materiaPrima: new FormControl('', [
        Validators.required,
      ])
    })
  }

  getPermisosEspeciales() {
    const permisos = environment.permisosEspeciales.filter( permiso => permiso.activo === 1);
    // console.log(permisos);
    const permisosEspecialesComponente = permisos.filter( permiso => permiso.nombre === this.nombrePermiso);
    // console.log(permisosEspecialesComponente);
    permisosEspecialesComponente.map( permisoExistente => {
      this.navigationService.validatePermissions(this.perfil.idPerfil, permisoExistente.idOpcion).subscribe(
        (result:any) => {
          console.log(result);
          if(result.estatus === '05'){
            this.permisosEspecialesPermitidos.push(permisoExistente.tooltip);
          }
        },
        error => console.log(error)
      );
    });
    console.log(this.permisosEspecialesPermitidos);
  }

  createArticle() {
    if (this.articuloForm.valid) {
      this.submitButton.disabled = true;
      const articulo: Articulo = {
        idArticulo: 0,
        idEmpleadoModifico: this.idUsuarioLogeado,
        ...this.articuloForm.value,
        materiaPrima: parseInt(this.articuloForm.get('materiaPrima').value),
        cantidadCharola: parseInt(this.articuloForm.get('cantidadCharola').value)
      };

      console.log(articulo);

      this.articuloService.updateArticulo(articulo).subscribe(
        ((response: any) => {
          console.log(response);
          if (response.estatus === '05') {
            this.router.navigate(['/catalogos/articulos']);
            this.useAlerts(response.mensaje, ' ', 'success-dialog');
          } else {
            this.useAlerts(response.mensaje, ' ', 'error-dialog');
            this.submitButton.disabled = false;
          }
        }),
        (error => {
          console.log(error);
          this.useAlerts(error.message, ' ', 'error-dialog');
          this.submitButton.disabled = false;
        })
      );
    }
  }

  useAlerts(message, action, className) {
    this.snackBar.open(message, action, {
      duration: 4000,
      verticalPosition: 'bottom',
      horizontalPosition: 'right',
      panelClass: [className]
    });
  }


}
