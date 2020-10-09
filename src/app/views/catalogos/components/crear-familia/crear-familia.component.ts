import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { Router } from '@angular/router';
import { Familia } from './../../../../shared/models/familia';
import {MatSnackBar} from '@angular/material/snack-bar';
import { FamiliaService } from 'app/shared/services/familia.service';
// import { FamiliaService } from '../../../../shared/services/familia.service';
import { AutenticacionService } from './../../../../shared/services/autenticacion.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-crear-familia',
  templateUrl: './crear-familia.component.html',
  styleUrls: ['./crear-familia.component.scss']
})
export class CrearFamiliaComponent implements OnInit {

  formData = {}
  console = console;
  familiaForm: FormGroup;
  idUsuarioLogeado;
  hoy = new Date();
  pipe = new DatePipe('en-US');


  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private familiaService: FamiliaService,
    private autenticacionService: AutenticacionService
  ) { }

  ngOnInit() {
    this.getValidations();
    this.idUsuarioLogeado = this.autenticacionService.currentUserValue;
  }

  getValidations() {
    this.familiaForm = new FormGroup({
      descripcion: new FormControl('', [
        Validators.required,
      ])
    })
  }

  createCompany(){
    const format = 'yyyy/MM/dd';
    const myFormatedDate = this.pipe.transform(this.hoy, format);

    if(this.familiaForm.valid){
      const familia: Familia = {
        idFamilia: 0,
        idEmpleadoCreo: this.idUsuarioLogeado,
        // idEmpleadoModifico: this.idUsuarioLogeado,
        fechaCreacion: myFormatedDate,
        // fechaModificacion: myFormatedDate,
        ...this.familiaForm.value,
      };

      console.log(familia);

      this.familiaService.updateFamilia(familia).subscribe(
        ( (response: any) => {
          console.log(response);
          if(response.estatus === '05'){
            this.router.navigate(['/catalogos/familias']);
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

  useAlerts(message, action, className){
    this.snackBar.open(message, action, {
      duration: 4000,
      verticalPosition: 'bottom',
      horizontalPosition: 'right',
      panelClass: [className]
    });
  }

}
