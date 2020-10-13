import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Empleado } from 'app/shared/models/empleado';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmpleadoService } from 'app/shared/services/empleado.service';
import { AutenticacionService } from 'app/shared/services/autenticacion.service';
import { DatePipe } from '@angular/common';
import { PerfilesService } from 'app/shared/services/perfiles.service';
import { Perfil } from 'app/shared/models/perfil';

@Component({
  selector: 'app-modificar-empleado',
  templateUrl: './modificar-empleado.component.html',
  styleUrls: ['./modificar-empleado.component.scss']
})
export class ModificarEmpleadoComponent implements OnInit {

  empleadoForm: FormGroup;
  idEmpleado;
  idUsuarioLogeado;
  empleado: Empleado;
  hoy = new Date();
  pipe = new DatePipe('en-US');
  perfiles: Perfil[] = [];
  fechaIngreso;

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private empleadoService: EmpleadoService,
    private autenticacionService: AutenticacionService,
    private perfilesService: PerfilesService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.getValidations();
    this.getEmpleado();
    this.getCatalogs();
    this.idUsuarioLogeado = this.autenticacionService.currentUserValue;
  }

  getEmpleado() {
    this.activatedRoute.params.subscribe((data: Params) => {
      this.idEmpleado = data.idEmpleado;
      if (this.idEmpleado) {
        this.empleadoService.getEmpleado(this.idEmpleado).subscribe(
          (empleado: Empleado) => {
            console.log(empleado);
            this.empleado = empleado;
            let fechaString = empleado.fechaIngreso;
            this.fechaIngreso = new Date(fechaString);
            this.fechaIngreso.setDate(this.fechaIngreso.getDate()+1);
            this.empleadoForm.patchValue(empleado);
            this.empleadoForm.get('perfil').setValue(empleado.perfil.idPerfil);
          },
          error => console.log(error)
        );
      }
    });
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
    // let contrasena = new FormControl('', [Validators.required,  Validators.minLength(8),]);
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
      fechaIngreso: new FormControl(this.fechaIngreso),
      // contrasena: contrasena,

    })
  }

  public onFechaIngreso(event): void {
    this.fechaIngreso = event.value;
  }


  updateEmploye() {
    if (this.empleadoForm.valid) {
      const format = 'yyyy-MM-dd';
      const myFormatedFechaIngreso = this.pipe.transform(this.fechaIngreso, format);

      const refreshProfile: Perfil = this.perfiles.find( (perfil: Perfil) => perfil.idPerfil === this.empleadoForm.value.perfil );
      // console.log(refreshProfile);

      const empleado: Empleado = {
        idEmpleado: parseInt(this.idEmpleado),
        idEmpleadoModifico: this.idUsuarioLogeado,
        ...this.empleadoForm.value,
        perfil: refreshProfile,
        fechaIngreso: myFormatedFechaIngreso
      };
      console.log(empleado);

      this.empleadoService.updateEmpleado(empleado).subscribe(
        (response => {
          // console.log(response);
          if (response.estatus === '05') {
            this.router.navigate(['/catalogos/empleados']);
            this.useAlerts(response.mensaje, ' ', 'success-dialog');
            this.autenticacionService.getEmpleadoLogeado(this.idUsuarioLogeado);
          } else {
            this.useAlerts(response.mensaje, ' ', 'error-dialog');
          }
        }),
        (error => {
          console.log(error);
          this.useAlerts(error.message, ' ', 'error-dialog');
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
