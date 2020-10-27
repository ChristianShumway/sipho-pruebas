import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { Router } from '@angular/router';
import { Familia } from 'app/shared/models/familia';
import {MatSnackBar} from '@angular/material/snack-bar';
import { FamiliaService } from 'app/shared/services/familia.service';
import { AutenticacionService } from 'app/shared/services/autenticacion.service';
import { DatePipe } from '@angular/common';
import { GruposService } from 'app/shared/services/grupos.service';
import { Grupo, GrupoContent } from 'app/shared/models/grupo';
import { MatButton } from '@angular/material';

@Component({
  selector: 'app-crear-familia',
  templateUrl: './crear-familia.component.html',
  styleUrls: ['./crear-familia.component.scss']
})
export class CrearFamiliaComponent implements OnInit {

  @ViewChild(MatButton, {static: false}) submitButton: MatButton;
  familiaForm: FormGroup;
  idUsuarioLogeado;
  hoy = new Date();
  pipe = new DatePipe('en-US');
  grupos: Grupo[] = [];


  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private familiaService: FamiliaService,
    private autenticacionService: AutenticacionService,
    private gruposService: GruposService
  ) { }

  ngOnInit() {
    this.getValidations();
    this.idUsuarioLogeado = this.autenticacionService.currentUserValue;
    this.getCatalogo();
  }

  getValidations() {
    this.familiaForm = new FormGroup({
      descripcion: new FormControl('', [
        Validators.required,
      ]),
      vistaGrupo: new FormControl('', [
        Validators.required,
      ])
    })
  }

  getCatalogo() {
    this.gruposService.getGruposSelect().subscribe(
      (grupos: Grupo[]) => {
        this.grupos = grupos;
        console.log(this.grupos);
      }
    );
  }

  createFamily(){
    const format = 'yyyy/MM/dd';
    const myFormatedDate = this.pipe.transform(this.hoy, format);
    this.submitButton.disabled = true;

    if(this.familiaForm.valid){
      const familia: Familia = {
        idFamilia: 0,
        idEmpleadoCreo: this.idUsuarioLogeado,
        fechaCreacion: myFormatedDate,
        ...this.familiaForm.value,
      };

      console.log(familia);
      
      this.familiaService.updateFamilia(familia).subscribe(
        ( (response: any) => {
          console.log(response);
          if(response.estatus === '05'){
            this.router.navigate(['/catalogos/familias']);
            this.useAlerts(response.mensaje, ' ', 'success-dialog');
            this.submitButton.disabled = false;
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
