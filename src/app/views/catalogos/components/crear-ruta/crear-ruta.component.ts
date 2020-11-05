import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Ruta } from 'app/shared/models/ruta';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RutaService } from 'app/shared/services/ruta.service';
import { AutenticacionService } from 'app/shared/services/autenticacion.service';
import { MatButton } from '@angular/material';

@Component({
  selector: 'app-crear-ruta',
  templateUrl: './crear-ruta.component.html',
  styleUrls: ['./crear-ruta.component.scss']
})
export class CrearRutaComponent implements OnInit {

  rutaForm: FormGroup;
  idUsuarioLogeado;
  @ViewChild(MatButton, {static: false}) submitButton: MatButton;

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private rutaService: RutaService,
    private autenticacionService: AutenticacionService
  ) { }

  ngOnInit() {
    this.getValidations();
    this.idUsuarioLogeado = this.autenticacionService.currentUserValue;
  }

  getValidations() {
    this.rutaForm = new FormGroup({
      descripcion: new FormControl('', [
        Validators.required,
      ])
    })
  }

  createRuta() {
    
    if (this.rutaForm.valid) {
      this.submitButton.disabled = true;

      const ruta: Ruta = {
        idRuta: 0,
        idEmpleadoModifico: this.idUsuarioLogeado,
        ...this.rutaForm.value,
      };

      console.log(ruta);

      this.rutaService.updateRuta(ruta).subscribe(
        ((response: any) => {
          console.log(response);
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
