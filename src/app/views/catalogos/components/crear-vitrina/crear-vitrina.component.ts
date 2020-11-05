import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Vitrina } from 'app/shared/models/vitrina';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VitrinaService } from 'app/shared/services/vitrina.service';
import { AutenticacionService } from 'app/shared/services/autenticacion.service';
import { MatButton } from '@angular/material';

@Component({
  selector: 'app-crear-vitrina',
  templateUrl: './crear-vitrina.component.html',
  styleUrls: ['./crear-vitrina.component.scss']
})
export class CrearVitrinaComponent implements OnInit {

  vitrinaForm: FormGroup;
  idUsuarioLogeado;
  @ViewChild(MatButton, {static: false}) submitButton: MatButton;

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private vitrinaService: VitrinaService,
    private autenticacionService: AutenticacionService
  ) { }

  ngOnInit() {
    this.getValidations();
    this.idUsuarioLogeado = this.autenticacionService.currentUserValue;
  }

  getValidations() {
    this.vitrinaForm = new FormGroup({
      descripcion: new FormControl('', [
        Validators.required,
      ]),
      color: new FormControl('', [
        Validators.required,
      ]),
      noCharolas: new FormControl('', [
        Validators.required,
      ]),
      folio: new FormControl('', [
        Validators.required,
      ])
    })
  }

  createVitrina() {
    
    if (this.vitrinaForm.valid) {
      this.submitButton.disabled = true;

      const vitrina: Vitrina = {
        idVitrina: 0,
        idEmpleadoModifico: this.idUsuarioLogeado,
        ...this.vitrinaForm.value,
        noCharolas: parseInt(this.vitrinaForm.value.noCharolas)
      };

      console.log(vitrina);

      this.vitrinaService.updateVitrina(vitrina).subscribe(
        ((response: any) => {
          console.log(response);
          if (response.estatus === '05') {
            this.router.navigate(['/catalogos/vitrinas']);
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
