import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Familia } from 'app/shared/models/familia';
import {MatSnackBar} from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
import { AutenticacionService } from '../../../../shared/services/autenticacion.service';
import { FamiliaService } from 'app/shared/services/familia.service';

@Component({
  selector: 'app-modificar-familia',
  templateUrl: './modificar-familia.component.html',
  styleUrls: ['./modificar-familia.component.scss']
})
export class ModificarFamiliaComponent implements OnInit {

  formData = {}
  console = console;
  familiaForm: FormGroup; 
  idFamilia;
  familia: Familia;
  hoy = new Date();
  pipe = new DatePipe('en-US');
  idUsuarioLogeado;

  constructor(
    private router: Router,
    private familiaService: FamiliaService,
    private activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
    private autenticacionService: AutenticacionService,
  ) { }

  ngOnInit() {
    this.getValidations();
    this.getFamilia();
    this.idUsuarioLogeado = this.autenticacionService.currentUserValue;
  }

  getFamilia() {
    this.activatedRoute.params.subscribe( (data: Params) => {
      this.idFamilia = data.idFamilia;
      if(this.idFamilia) {
        this.familiaService.getFamilia(this.idFamilia).subscribe(
          (familia: Familia) => {
            console.log(familia);
            this.familia = familia;
            this.familiaForm.patchValue(familia);
          },
          error => console.log(error)
        );
      }
    });
  }

  getValidations() {
    this.familiaForm = new FormGroup({
      descripcion: new FormControl('', [
        Validators.required,
      ])
    })
  }

  updateFamilia(){
    if(this.familiaForm.valid){
      const format = 'yyyy/MM/dd';
      const myFormatedDate = this.pipe.transform(this.hoy, format);
     
      const familia: Familia = {
        idFamilia: parseInt(this.idFamilia),
        idEmpleadoModifico: this.idUsuarioLogeado,
        fechaModificacion: myFormatedDate,
        ...this.familiaForm.value,
      };
      console.log(familia);

      this.familiaService.updateFamilia(familia).subscribe(
        (response => {
          // console.log(response);
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
