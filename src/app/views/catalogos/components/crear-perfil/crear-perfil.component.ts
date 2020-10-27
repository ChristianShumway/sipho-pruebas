import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Perfil } from './../../../../shared/models/perfil';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PerfilesService } from 'app/shared/services/perfiles.service';
import { AutenticacionService } from './../../../../shared/services/autenticacion.service';
import { DatePipe } from '@angular/common';
import { MatButton } from '@angular/material';

@Component({
  selector: 'app-crear-perfil',
  templateUrl: './crear-perfil.component.html',
  styleUrls: ['./crear-perfil.component.scss']
})
export class CrearPerfilComponent implements OnInit {

  perfilForm: FormGroup;
  idUsuarioLogeado;
  hoy = new Date();
  pipe = new DatePipe('en-US');
  @ViewChild(MatButton, {static: false}) submitButton: MatButton;

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private perfilesService: PerfilesService,
    private autenticacionService: AutenticacionService
  ) { }

  ngOnInit() {
    this.getValidations();
    this.idUsuarioLogeado = this.autenticacionService.currentUserValue;
  }

  getValidations() {
    this.perfilForm = new FormGroup({
      descripcion: new FormControl('', [
        Validators.required,
      ])
    })
  }

  createProfile() {
    this.submitButton.disabled = true;
    const format = 'yyyy/MM/dd';
    const myFormatedDate = this.pipe.transform(this.hoy, format);

    if (this.perfilForm.valid) {
      const perfil: Perfil = {
        idPerfil: 0,
        idEmpleadoCreo: this.idUsuarioLogeado,
        fechaCreacion: myFormatedDate,
        ...this.perfilForm.value,
      };

      console.log(perfil);

      this.perfilesService.updatePerfil(perfil).subscribe(
        ((response: any) => {
          console.log(response);
          if (response.estatus === '05') {
            this.router.navigate(['/catalogos/perfiles']);
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
