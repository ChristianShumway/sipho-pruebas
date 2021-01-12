import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Empleado } from 'app/shared/models/empleado';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmpleadoService } from 'app/shared/services/empleado.service';
import { AutenticacionService } from 'app/shared/services/autenticacion.service';
import { DatePipe } from '@angular/common';
import { PerfilesService } from 'app/shared/services/perfiles.service';
import { Perfil } from 'app/shared/models/perfil';
import { MatButton } from '@angular/material';
import { ViewChild } from '@angular/core';
import { environment } from './../../../../../environments/environment';
import { NavigationService } from 'app/shared/services/navigation.service';

@Component({
  selector: 'app-crear-empleado',
  templateUrl: './crear-empleado.component.html',
  styleUrls: ['./crear-empleado.component.scss']
})

export class CrearEmpleadoComponent implements OnInit {

  empleadoForm: FormGroup;
  idUsuarioLogeado;
  hoy = new Date();
  pipe = new DatePipe('en-US');
  perfiles: Perfil[] = [];
  fechaIngreso;
  @ViewChild(MatButton, {static: false}) submitButton: MatButton;
  perfil;
  nombrePermiso = 'crud-empleados';
  permisosEspecialesPermitidos: any[] = []; //array donde se agrega el nombre de las opciones a las cuales el usuario si tiene permiso

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private empleadoService: EmpleadoService,
    private autenticacionService: AutenticacionService,
    private perfilesService: PerfilesService,
    private navigationService: NavigationService
  ) { }

  ngOnInit() {
    this.getValidations();
    this.getCatalogs();
    this.idUsuarioLogeado = this.autenticacionService.currentUserValue;
    this.perfil = this.autenticacionService.currentProfileValue;
    this.fechaIngreso = new Date(this.empleadoForm.controls['fechaIngreso'].value);
    this.fechaIngreso.setDate(this.fechaIngreso.getDate());
    this.getPermisosEspeciales();
  }

  getCatalogs() {
    this.perfilesService.getSelectPerfil().subscribe(
      (perfiles) => {
        console.log(perfiles);
        this.perfiles = perfiles;
      },
      error => console.log(error)
    );
  }

  getValidations() {
    let contrasena = new FormControl('', [Validators.required,  Validators.minLength(8),]);
    this.empleadoForm = new FormGroup({
      nombre: new FormControl('', [
        Validators.required,
      ]),
      apellidoPaterno: new FormControl('', [
        Validators.required,
      ]),
      apellidoMaterno: new FormControl('', [
        Validators.required,
      ]),
      direccion: new FormControl('', [
        Validators.required,
      ]),
      telefono: new FormControl('', [
        Validators.required,
        Validators.maxLength(10)
      ]),
      telefonoEmergencia: new FormControl('', [
        Validators.required,
        Validators.maxLength(10)
      ]),
      nss: new FormControl('', [
        Validators.required,
      ]),
      gafete: new FormControl(''),
      perfil: new FormControl('', [
        Validators.required,
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.email
      ]),
      contrasena: contrasena,
      fechaIngreso: new FormControl(new Date(), [
        Validators.required,
      ]),
    })
  }

  public onFechaIngreso(event): void {
    this.fechaIngreso = event.value;
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

  createEmploye() {
    const format = 'yyyy-MM-dd';
    const myFormatedDate = this.pipe.transform(this.fechaIngreso, format);

    if (this.empleadoForm.valid) {
      this.submitButton.disabled = true;
      const empleado: Empleado = {
        idEmpleado: 0,
        idEmpleadoModifico: this.idUsuarioLogeado,
        ...this.empleadoForm.value,
        fechaIngreso: myFormatedDate,
      };

      console.log(empleado);
      this.empleadoService.createEmpleado(empleado).subscribe(
        ((response: any) => {
          console.log(response);
          if (response.estatus === '05') {
            this.router.navigate(['/catalogos/empleados']);
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
