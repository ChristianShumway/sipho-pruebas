import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Proveedor, TipoProveedor, PeriodoCompraProveedor } from 'app/shared/models/proveedor';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProveedorService } from 'app/shared/services/proveedor.service';
import { AutenticacionService } from 'app/shared/services/autenticacion.service';
import { DatePipe } from '@angular/common';
import { MatButton } from '@angular/material';

@Component({
  selector: 'app-modificar-proveedor',
  templateUrl: './modificar-proveedor.component.html',
  styleUrls: ['./modificar-proveedor.component.scss']
})
export class ModificarProveedorComponent implements OnInit {

  proveedorForm: FormGroup;
  idProveedor;
  idUsuarioLogeado;
  proveedor: Proveedor;
  hoy = new Date();
  pipe = new DatePipe('en-US');
  tiposProveedores: TipoProveedor[] = [];
  periodosCompra: PeriodoCompraProveedor[] = [];
  @ViewChild(MatButton, {static: false}) submitButton: MatButton;


  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private proveedorService: ProveedorService,
    private autenticacionService: AutenticacionService
  ) { }

  ngOnInit() {
    this.getValidations();
    this.getProveedor();
    this.getCatalogs();
    this.idUsuarioLogeado = this.autenticacionService.currentUserValue;
  }

  getProveedor() {
    this.activatedRoute.params.subscribe((data: Params) => {
      this.idProveedor = data.idProveedor;
      if (this.idProveedor) {
        this.proveedorService.getProveedor(this.idProveedor).subscribe(
          (proveedor: Proveedor) => {
            console.log(proveedor);
            this.proveedor = proveedor;
            this.proveedorForm.patchValue(proveedor);
            this.proveedorForm.get('tipoProveedor').setValue(proveedor.tipoProveedor.idTipoProveedor);
            this.proveedorForm.get('periodoCompra').setValue(proveedor.periodoCompra.idPeriodocompra);
          },
          error => console.log(error)
        );
      }
    });
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

  updateProveedor() {
    if (this.proveedorForm.valid) {
      this.submitButton.disabled = true;
      const format = 'yyyy/MM/dd';
      const myFormatedDate = this.pipe.transform(this.hoy, format);

      const refreshTipoProveedor: TipoProveedor = this.tiposProveedores.find((tipo: TipoProveedor) => tipo.idTipoProveedor === this.proveedorForm.value.tipoProveedor);
      const refreshPeriodoCompra: PeriodoCompraProveedor = this.periodosCompra.find((periodo: PeriodoCompraProveedor) => periodo.idPeriodocompra === this.proveedorForm.value.periodoCompra);
      // console.log(refreshProfile);

      const proveedor: Proveedor = {
        idProveedor: parseInt(this.idProveedor),
        idEmpleadoModifico: this.idUsuarioLogeado,
        ...this.proveedorForm.value,
        tipoProveedor: refreshTipoProveedor,
        periodoCompra: refreshPeriodoCompra
      };
      console.log(proveedor);

      this.proveedorService.updateProveedor(proveedor).subscribe(
        (response => {
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
