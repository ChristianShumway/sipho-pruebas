import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Ruta } from 'app/shared/models/ruta';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RutaService } from 'app/shared/services/ruta.service';
import { AutenticacionService } from 'app/shared/services/autenticacion.service';
import { MatDialog, MatButton } from '@angular/material';
import { switchMap } from 'rxjs/operators';
import { ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { EmpleadoService } from 'app/shared/services/empleado.service';
import { Empleado } from 'app/shared/models/empleado';

@Component({
  selector: 'app-modificar-ruta',
  templateUrl: './modificar-ruta.component.html',
  styleUrls: ['./modificar-ruta.component.scss']
})
export class ModificarRutaComponent implements OnInit {

  @ViewChild(MatButton, { static: false }) submitButton: MatButton;
  rutaForm: FormGroup;
  idRuta;
  idUsuarioLogeado;
  ruta: Ruta;
  empleados: Empleado[] = [];
  idPerfilEmploye: number = 3;

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private autenticacionService: AutenticacionService,
    private activatedRoute: ActivatedRoute,
    private rutaService: RutaService,
    public dialog: MatDialog,
    private empleadoService: EmpleadoService
  ) { }

  ngOnInit() {
    this.getValidations();
    this.getRuta();
    this.idUsuarioLogeado = this.autenticacionService.currentUserValue;
    this.getEmployes();
  }

  getRuta() {
    this.activatedRoute.params.pipe(
      switchMap( (params: Params) => this.rutaService.getRuta(params.idRuta))
    ).subscribe(
      (ruta: Ruta) => {
        console.log(ruta);
        this.ruta = ruta;
        this.idRuta = ruta.idRuta;
        this.rutaForm.patchValue(ruta);
        this.rutaForm.get('encargado').setValue(ruta.encargado.idEmpleado);
        this.rutaForm.get('coEncargado').setValue(ruta.coEncargado.idEmpleado);
      },
      error => console.log(error)
    );
  }

  getEmployes() {
    this.empleadoService.getEmployeByPerfil(this.idPerfilEmploye).subscribe(
      (empleados: Empleado[]) => {
        console.log(empleados);
        this.empleados = empleados;
      },
      error => console.log(error)
    );
  }


  getValidations() {
    this.rutaForm = new FormGroup({
      descripcion: new FormControl('', [
        Validators.required,
      ]),
      encargado: new FormControl('', [
        Validators.required,
      ]),
      coEncargado: new FormControl('', [
        Validators.required,
      ])
    })
  }

  
  updateRuta() {
    if (this.rutaForm.valid) {
      this.submitButton.disabled = true;

      const encargado: Empleado = this.empleados.find( (empleado: Empleado) => empleado.idEmpleado === this.rutaForm.value.encargado);
      const coEncargado: Empleado = this.empleados.find( (empleado: Empleado) => empleado.idEmpleado === this.rutaForm.value.coEncargado);

      const ruta: Ruta = {
        idRuta: parseInt(this.idRuta),
        idEmpleadoModifico: this.idUsuarioLogeado,
        ...this.rutaForm.value,
        encargado: encargado,
        coEncargado: coEncargado
      };
      console.log(ruta);

      this.rutaService.updateRuta(ruta).subscribe(
        (response => {
          if (response.estatus === '05') {
            this.router.navigate(['/catalogos/rutas']);
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
