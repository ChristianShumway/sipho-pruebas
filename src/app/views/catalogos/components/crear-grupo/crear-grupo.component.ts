import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { Router } from '@angular/router';
import { Grupo } from './../../../../shared/models/grupo';
import {MatSnackBar} from '@angular/material/snack-bar';
import { GruposService } from 'app/shared/services/grupos.service';
import { AutenticacionService } from './../../../../shared/services/autenticacion.service';
import { DatePipe } from '@angular/common';
import { MatButton } from '@angular/material';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-crear-grupo',
  templateUrl: './crear-grupo.component.html',
  styleUrls: ['./crear-grupo.component.scss']
})
export class CrearGrupoComponent implements OnInit {

  grupoForm: FormGroup;
  idUsuarioLogeado;
  hoy = new Date();
  pipe = new DatePipe('en-US');
  @ViewChild(MatButton, {static: false}) submitButton: MatButton;

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private grupoService: GruposService,
    private autenticacionService: AutenticacionService
  ) { }

  ngOnInit() {
    this.getValidations();
    this.idUsuarioLogeado = this.autenticacionService.currentUserValue;
  }

  getValidations() {
    this.grupoForm = new FormGroup({
      descripcion: new FormControl('', [
        Validators.required,
      ])
    })
  }

  createGrupo(){
    const format = 'yyyy/MM/dd';
    const myFormatedDate = this.pipe.transform(this.hoy, format);

    if(this.grupoForm.valid){
      this.submitButton.disabled = true;
      const grupo: Grupo = {
        idGrupo: 0,
        idEmpleadoCreo: this.idUsuarioLogeado,
        fechaCreacion: myFormatedDate,
        ...this.grupoForm.value,
      };

      console.log(grupo);

      this.grupoService.updateGrupo(grupo).subscribe(
        ( (response: any) => {
          console.log(response);
          if(response.estatus === '05'){
            this.router.navigate(['/catalogos/grupos']);
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

  useAlerts(message, action, className){
    this.snackBar.open(message, action, {
      duration: 4000,
      verticalPosition: 'bottom',
      horizontalPosition: 'right',
      panelClass: [className]
    });
  }

}
