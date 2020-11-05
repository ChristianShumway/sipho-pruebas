import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Ruta } from 'app/shared/models/ruta';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RutaService } from 'app/shared/services/ruta.service';
import { AutenticacionService } from 'app/shared/services/autenticacion.service';
import { MatDialog, MatButton } from '@angular/material';
import { switchMap } from 'rxjs/operators';
import { ViewChild } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-modificar-ruta',
  templateUrl: './modificar-ruta.component.html',
  styleUrls: ['./modificar-ruta.component.scss']
})
export class ModificarRutaComponent implements OnInit {

  @ViewChild(MatButton, { static: false }) submitButton: MatButton;
  rutaForm: FormGroup;
  idRuta;
  idUsuarioLogeado;
  ruta: Ruta;

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private autenticacionService: AutenticacionService,
    private activatedRoute: ActivatedRoute,
    private rutaService: RutaService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.getValidations();
    this.getRuta();
    this.idUsuarioLogeado = this.autenticacionService.currentUserValue;
  }

  getRuta() {
    this.activatedRoute.params.pipe(
      switchMap( (params: Params) => this.rutaService.getRuta(params.idRuta))
    ).subscribe(
      (ruta: Ruta) => {
        console.log(ruta);
        this.ruta = ruta;
        this.idRuta = ruta.idRuta;
        this.rutaForm.patchValue(ruta);
      },
      error => console.log(error)
    );
  }


  getValidations() {
    this.rutaForm = new FormGroup({
      descripcion: new FormControl('', [
        Validators.required,
      ])
    })
  }

  
  updateRuta() {
    if (this.rutaForm.valid) {
      this.submitButton.disabled = true;

      const ruta: Ruta = {
        idRuta: parseInt(this.idRuta),
        idEmpleadoModifico: this.idUsuarioLogeado,
        ...this.rutaForm.value,
      };
      console.log(ruta);

      this.rutaService.updateRuta(ruta).subscribe(
        (response => {
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
