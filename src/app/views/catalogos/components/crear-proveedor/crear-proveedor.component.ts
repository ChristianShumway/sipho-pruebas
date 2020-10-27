import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Proveedor, TipoProveedor, PeriodoCompraProveedor } from 'app/shared/models/proveedor';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProveedorService } from 'app/shared/services/proveedor.service';
import { AutenticacionService } from 'app/shared/services/autenticacion.service';
import { DatePipe } from '@angular/common';
import { MatButton } from '@angular/material';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-crear-proveedor',
  templateUrl: './crear-proveedor.component.html',
  styleUrls: ['./crear-proveedor.component.scss']
})
export class CrearProveedorComponent implements OnInit {

  proveedorForm: FormGroup;
  idUsuarioLogeado;
  hoy = new Date();
  pipe = new DatePipe('en-US');
  tiposProveedores: TipoProveedor[] = [];
  periodosCompra: PeriodoCompraProveedor[] = [];
  @ViewChild(MatButton, {static: false}) submitButton: MatButton;


  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private proveedorService: ProveedorService,
    private autenticacionService: AutenticacionService,
  ) { }

  ngOnInit() {
    this.getValidations();
    this.getCatalogs();
    this.idUsuarioLogeado = this.autenticacionService.currentUserValue;
  }

  getCatalogs() {
    this.proveedorService.getTipoProveedor().subscribe(
      (tipos: TipoProveedor[]) => {
        console.log(tipos);
        this.tiposProveedores = tipos;
      },
      error => console.log(error)
    );

    this.proveedorService.getPeriodoCompraProveedor().subscribe(
      (periodos: PeriodoCompraProveedor[]) => {
        console.log(periodos);
        this.periodosCompra = periodos;
      },
      error => console.log(error)
    );
  }

  getValidations() {
    this.proveedorForm = new FormGroup({
      tipoProveedor: new FormControl('', [
        Validators.required,
      ]),
      periodoCompra: new FormControl('', [
        Validators.required,
      ]),
      nombre: new FormControl('', [
        Validators.required,
      ]),
      rfc: new FormControl('', [
        Validators.required,
      ]),
      telefono: new FormControl('', [
        Validators.required,
      ]),
      direccion: new FormControl('', [
        Validators.required,
      ]),
      observacion: new FormControl('', [
        Validators.required,
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.email
      ]),
    })
  }

  createProveedor() {
    const format = 'yyyy/MM/dd';
    const myFormatedDate = this.pipe.transform(this.hoy, format);
    
    if (this.proveedorForm.valid) {
      this.submitButton.disabled = true;
      const proveedor: Proveedor = {
        idProveedor: 0,
        idEmpleadoModifico: this.idUsuarioLogeado,
        ...this.proveedorForm.value,
      };

      console.log(proveedor);

      this.proveedorService.updateProveedor(proveedor).subscribe(
        ((response: any) => {
          // console.log(response);
          if (response.estatus === '05') {
            this.router.navigate(['/catalogos/proveedores']);
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
