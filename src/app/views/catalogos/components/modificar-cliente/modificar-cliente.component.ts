import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Cliente } from 'app/shared/models/cliente';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClienteService } from 'app/shared/services/cliente.service';
import { AutenticacionService } from 'app/shared/services/autenticacion.service';
import { DatePipe } from '@angular/common';
import { MatBottomSheet } from '@angular/material';
import { VerMapaComponent } from '../ver-mapa/ver-mapa.component';

@Component({
  selector: 'app-modificar-cliente',
  templateUrl: './modificar-cliente.component.html',
  styleUrls: ['./modificar-cliente.component.scss']
})
export class ModificarClienteComponent implements OnInit {

  clienteForm: FormGroup;
  idCliente;
  idUsuarioLogeado;
  cliente: Cliente;
  hoy = new Date();
  pipe = new DatePipe('en-US');

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private clienteService: ClienteService,
    private autenticacionService: AutenticacionService,
    private activatedRoute: ActivatedRoute,
    private bottomSheet: MatBottomSheet,
  ) { }

  ngOnInit() {
    this.getValidations();
    this.getCliente();
    this.idUsuarioLogeado = this.autenticacionService.currentUserValue;
  }

  getCliente() {
    this.activatedRoute.params.subscribe((data: Params) => {
      this.idCliente = data.idCliente;
      if (this.idCliente) {
        this.clienteService.getCliente(this.idCliente).subscribe(
          (cliente: Cliente) => {
            console.log(cliente);
            this.cliente = cliente;
            this.clienteForm.patchValue(cliente);
          },
          error => console.log(error)
        );
      }
    });
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
      ]),
      telefono: new FormControl('', [
        Validators.required,
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.email
      ]),
      ciudad: new FormControl('', [
        Validators.required,
      ]),
      latitud: new FormControl('', [
        Validators.required,
      ]),
      longitud: new FormControl('', [
        Validators.required,
      ]),
      observacion: new FormControl('', [
        Validators.required,
      ]),
    });
  }


  updateCustomer() {
    if (this.clienteForm.valid) {
      const format = 'yyyy/MM/dd';
      const myFormatedDate = this.pipe.transform(this.hoy, format);

      const cliente: Cliente = {
        idCliente: parseInt(this.idCliente),
        idEmpleadoModificacion: this.idUsuarioLogeado,
        ...this.clienteForm.value,
      };
      console.log(cliente);

      this.clienteService.updateCliente(cliente).subscribe(
        (response => {
          if (response.estatus === '05') {
            this.router.navigate(['/catalogos/clientes']);
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

  useAlerts(message, action, className) {
    this.snackBar.open(message, action, {
      duration: 4000,
      verticalPosition: 'bottom',
      horizontalPosition: 'right',
      panelClass: [className]
    });
  }

}
