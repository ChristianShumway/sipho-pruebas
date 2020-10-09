import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Vehiculo } from 'app/shared/models/vehiculo';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VehiculoService } from 'app/shared/services/vehiculo.service';
import { AutenticacionService } from 'app/shared/services/autenticacion.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-crear-vehiculo',
  templateUrl: './crear-vehiculo.component.html',
  styleUrls: ['./crear-vehiculo.component.scss']
})
export class CrearVehiculoComponent implements OnInit {

  vehiculoForm: FormGroup;
  idUsuarioLogeado;
  hoy = new Date();
  pipe = new DatePipe('en-US');

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private vehiculoService: VehiculoService,
    private autenticacionService: AutenticacionService,
  ) { }

  ngOnInit() {
    this.getValidations();
    this.idUsuarioLogeado = this.autenticacionService.currentUserValue;
  }
      
  getValidations() {
    this.vehiculoForm = new FormGroup({
      marca: new FormControl('', [
        Validators.required,
      ]),
      linea: new FormControl('', [
        Validators.required,
      ]),
      modelo: new FormControl('', [
        Validators.required,
      ]),
      placa: new FormControl('', [
        Validators.required,
      ])
    })
  }

  createVehicle() {
    const format = 'yyyy/MM/dd';
    const myFormatedDate = this.pipe.transform(this.hoy, format);

    if (this.vehiculoForm.valid) {
      const vehiculo: Vehiculo = {
        idVehiculo: 0,
        idEmpleadoModifico: this.idUsuarioLogeado,
        activo: 1,
        ...this.vehiculoForm.value,
      };

      console.log(vehiculo);

      this.vehiculoService.updateVehiculo(vehiculo).subscribe(
        ((response: any) => {
          console.log(response);
          if (response.estatus === '05') {
            this.router.navigate(['/catalogos/vehiculos']);
            this.useAlerts(response.mensaje, ' ', 'success-dialog');
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
