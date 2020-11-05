import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Cliente } from 'app/shared/models/cliente';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClienteService } from 'app/shared/services/cliente.service';
import { AutenticacionService } from 'app/shared/services/autenticacion.service';
import { MatBottomSheet, MatButton } from '@angular/material';
import { VerMapaComponent } from '../ver-mapa/ver-mapa.component';
import { ViewChild } from '@angular/core';
import { RutaService } from 'app/shared/services/ruta.service';
import { Ruta } from 'app/shared/models/ruta';

@Component({
  selector: 'app-crear-cliente',
  templateUrl: './crear-cliente.component.html',
  styleUrls: ['./crear-cliente.component.scss']
})
export class CrearClienteComponent implements OnInit {

  clienteForm: FormGroup;
  idUsuarioLogeado;
  rutas: Ruta[] = [];
  @ViewChild(MatButton, {static: false}) submitButton: MatButton;

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private clienteService: ClienteService,
    private autenticacionService: AutenticacionService,
    private bottomSheet: MatBottomSheet,
    private rutaService: RutaService
  ) { }

  ngOnInit() {
    this.getValidations();
    this.getCatalog();
    this.idUsuarioLogeado = this.autenticacionService.currentUserValue;
  }

  getValidations() {
    this.clienteForm = new FormGroup({
      razonSocial: new FormControl('', [
        Validators.required,
      ]),
      rfc: new FormControl('', [
        Validators.required,
      ]),
      propietario: new FormControl('', [
        Validators.required,
      ]),
      calle: new FormControl('', [
        Validators.required,
      ]),
      numero: new FormControl('', [
        Validators.required,
      ]),
      colonia: new FormControl('', [
        Validators.required,
      ]),
      codigoPostal: new FormControl('', [
        Validators.required,
        Validators.maxLength(5),
        Validators.minLength(5),
      ]),
      telefono: new FormControl('', [
        Validators.required,
        Validators.maxLength(10)
      ]),
      email: new FormControl('', [
        Validators.email
      ]),
      ciudad: new FormControl('', [
        Validators.required,
      ]),
      latitud: new FormControl('21.8980987', [
        Validators.required,
      ]),
      longitud: new FormControl('-102.2872657', [
        Validators.required,
      ]),
      observacion: new FormControl('', [
        Validators.required,
      ]),
      vistaRuta: new FormControl('', [
        Validators.required
      ])

    })
  }

  getCatalog() {
    this.rutaService.getSelectRuta().subscribe(
      (rutas: Ruta[]) => this.rutas = rutas,
      error => console.log(error)
    );
  }

  createCustomer() {
    if (this.clienteForm.valid) {
      this.submitButton.disabled = true;
      const cliente: Cliente = {
        idCliente: 0,
        idEmpleadoModificacion: this.idUsuarioLogeado,
        ...this.clienteForm.value,
      };

      console.log(cliente);

      this.clienteService.updateCliente(cliente).subscribe(
        ((response: any) => {
          console.log(response);
          if (response.estatus === '05') {
            this.router.navigate(['/catalogos/clientes']);
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

  viewMap(): void {
    const lat = this.clienteForm.get('latitud').value;
    const lon = this.clienteForm.get('longitud').value;
    let sheet = this.bottomSheet.open(VerMapaComponent, {
      data: {
        latitude: parseFloat(lat),
        longitude: parseFloat(lon)
      }
    });

    sheet.backdropClick().subscribe( () => {
      console.log('clicked');
    });  

    sheet.afterDismissed().subscribe(
      data => {
        if(data) {
          this.clienteForm.get('latitud').setValue(data.latitude);
          this.clienteForm.get('longitud').setValue(data.longitude);
        }
      }
    )
  }


}
