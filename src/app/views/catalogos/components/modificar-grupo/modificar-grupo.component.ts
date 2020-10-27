import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Grupo } from 'app/shared/models/grupo';
import {MatSnackBar} from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
import { AutenticacionService } from '../../../../shared/services/autenticacion.service';
import { GruposService } from 'app/shared/services/grupos.service';
import { MatButton } from '@angular/material';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-modificar-grupo',
  templateUrl: './modificar-grupo.component.html',
  styleUrls: ['./modificar-grupo.component.scss']
})
export class ModificarGrupoComponent implements OnInit {

  grupoForm: FormGroup; 
  idGrupo;
  grupo: Grupo;
  hoy = new Date();
  pipe = new DatePipe('en-US');
  idUsuarioLogeado;
  @ViewChild(MatButton, {static: false}) submitButton: MatButton;

  constructor(
    private router: Router,
    private gruposService: GruposService,
    private activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
    private autenticacionService: AutenticacionService,
  ) { }

  ngOnInit() {
    this.getValidations();
    this.getGrupo();
    this.idUsuarioLogeado = this.autenticacionService.currentUserValue;
  }

  getGrupo() {
    this.activatedRoute.params.subscribe( (data: Params) => {
      this.idGrupo = data.idGrupo;
      if(this.idGrupo) {
        this.gruposService.getGrupo(this.idGrupo).subscribe(
          (grupo: Grupo) => {
            console.log(grupo);
            this.grupo = grupo;
            this.grupoForm.patchValue(grupo);
          },
          error => console.log(error)
        );
      }
    });
  }

  getValidations() {
    this.grupoForm = new FormGroup({
      descripcion: new FormControl('', [
        Validators.required,
      ])
    })
  }

  updateGrupo(){
    if(this.grupoForm.valid){
      this.submitButton.disabled = true;
      const format = 'yyyy/MM/dd';
      const myFormatedDate = this.pipe.transform(this.hoy, format);
     
      const grupo: Grupo = {
        idGrupo: parseInt(this.idGrupo),
        idEmpleadoModifico: this.idUsuarioLogeado,
        fechaModificacion: myFormatedDate,
        ...this.grupoForm.value,
      };
      console.log(grupo);

      this.gruposService.updateGrupo(grupo).subscribe(
        (response => {
          // console.log(response);
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
