import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Perfil } from 'app/shared/models/perfil';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
import { AutenticacionService } from '../../../../shared/services/autenticacion.service';
import { PerfilesService } from 'app/shared/services/perfiles.service';
import { MatButton } from '@angular/material';

@Component({
  selector: 'app-modificar-perfil',
  templateUrl: './modificar-perfil.component.html',
  styleUrls: ['./modificar-perfil.component.scss']
})
export class ModificarPerfilComponent implements OnInit {

  perfilForm: FormGroup;
  idPerfil;
  perfil: Perfil;
  hoy = new Date();
  pipe = new DatePipe('en-US');
  idUsuarioLogeado;
  @ViewChild(MatButton, {static: false}) submitButton: MatButton;

  constructor(
    private router: Router,
    private perfilesService: PerfilesService,
    private activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
    private autenticacionService: AutenticacionService,
  ) { }

  ngOnInit() {
    this.getValidations();
    this.getPerfil();
    this.idUsuarioLogeado = this.autenticacionService.currentUserValue;
  }

  getPerfil() {
    this.activatedRoute.params.subscribe((data: Params) => {
      this.idPerfil = data.idPerfil;
      if (this.idPerfil) {
        this.perfilesService.getPerfil(this.idPerfil).subscribe(
          (perfil: Perfil) => {
            console.log(perfil);
            this.perfil = perfil;
            this.perfilForm.patchValue(perfil);
          },
          error => console.log(error)
        );
      }
    });
  }

  getValidations() {
    this.perfilForm = new FormGroup({
      descripcion: new FormControl('', [
        Validators.required,
      ])
    })
  }

  updateProfile() {
    if (this.perfilForm.valid) {
      this.submitButton.disabled = true;
      const format = 'yyyy/MM/dd';
      const myFormatedDate = this.pipe.transform(this.hoy, format);

      const perfil: Perfil = {
        idPerfil: parseInt(this.idPerfil),
        idEmpleadoModifico: this.idUsuarioLogeado,
        fechaModificacion: myFormatedDate,
        ...this.perfilForm.value,
      };
      console.log(perfil);

      this.perfilesService.updatePerfil(perfil).subscribe(
        (response => {
          // console.log(response);
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
