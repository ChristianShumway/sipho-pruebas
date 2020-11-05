import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Vitrina } from 'app/shared/models/vitrina';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VitrinaService } from 'app/shared/services/vitrina.service';
import { AutenticacionService } from 'app/shared/services/autenticacion.service';
import { MatDialog, MatButton } from '@angular/material';
import { switchMap } from 'rxjs/operators';
import { ViewChild } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-modificar-vitrina',
  templateUrl: './modificar-vitrina.component.html',
  styleUrls: ['./modificar-vitrina.component.scss']
})
export class ModificarVitrinaComponent implements OnInit {

  @ViewChild(MatButton, { static: false }) submitButton: MatButton;
  vitrinaForm: FormGroup;
  idVitrina;
  idUsuarioLogeado;
  vitrina: Vitrina;

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private autenticacionService: AutenticacionService,
    private activatedRoute: ActivatedRoute,
    private vitrinaService: VitrinaService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.getValidations();
    this.getVitrina();
    this.idUsuarioLogeado = this.autenticacionService.currentUserValue;
  }

  getVitrina() {
    this.activatedRoute.params.pipe(
      switchMap( (params: Params) => this.vitrinaService.getVitrina(params.idVitrina))
    ).subscribe(
      (vitrina: Vitrina) => {
        console.log(vitrina);
        this.vitrina = vitrina;
        this.idVitrina = vitrina.idVitrina;
        this.vitrinaForm.patchValue(vitrina);
      },
      error => console.log(error)
    );  
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

  updateVitrina() {
    if (this.vitrinaForm.valid) {
      this.submitButton.disabled = true;

      const vitrina: Vitrina = {
        idVitrina: parseInt(this.idVitrina),
        idEmpleadoModifico: this.idUsuarioLogeado,
        ...this.vitrinaForm.value,
        noCharolas: parseInt(this.vitrinaForm.value.noCharolas)
      };
      console.log(vitrina);
      this.vitrinaService.updateVitrina(vitrina).subscribe(
        (response => {
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
