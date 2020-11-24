import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Cliente } from 'app/shared/models/cliente';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClienteService } from 'app/shared/services/cliente.service';
import { AutenticacionService } from 'app/shared/services/autenticacion.service';
import { MatBottomSheet, MatButton } from '@angular/material';
import { VerMapaComponent } from '../ver-mapa/ver-mapa.component';
import { Ruta } from 'app/shared/models/ruta';
import { RutaService } from 'app/shared/services/ruta.service';
import { switchMap } from 'rxjs/operators';
import { environment } from './../../../../../environments/environment';
import { NavigationService } from 'app/shared/services/navigation.service';

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
  rutas: Ruta[] = [];
  @ViewChild(MatButton, {static: false}) submitButton: MatButton;
  perfil;
  nombrePermiso = 'crud-clientes';
  permisosEspecialesPermitidos: any[] = []; //array donde se agrega el nombre de las opciones a las cuales el usuario si tiene permiso

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private clienteService: ClienteService,
    private autenticacionService: AutenticacionService,
    private activatedRoute: ActivatedRoute,
    private bottomSheet: MatBottomSheet,
    private rutaService: RutaService,
    private navigationService: NavigationService
  ) { }

  ngOnInit() {
    this.idUsuarioLogeado = this.autenticacionService.currentUserValue;
    this.perfil = this.autenticacionService.currentProfileValue;
    this.getValidations();
    this.getCliente();
    this.getCatalogo();
    this.getPermisosEspeciales();
  }

  getCliente() {
    this.activatedRoute.params.pipe(
      switchMap ( (params: Params) => this.clienteService.getCliente(params.idCliente) )
    ).subscribe(
      (cliente: Cliente) => {
        console.log(cliente);
        this.cliente = cliente;
        this.idCliente = cliente.idCliente;
        this.clienteForm.patchValue(cliente);
        this.clienteForm.get('vistaRuta').setValue(cliente.vistaRuta.idRuta)
      },
      error => console.log(error)
    );
  }

  getCatalogo() {
    this.rutaService.getSelectRutaByEmploye(this.idUsuarioLogeado).subscribe(
      (rutas: Ruta[]) => this.rutas = rutas, 
      error => console.log(error)
    );
  }

  getPermisosEspeciales() {
    const permisos = environment.permisosEspeciales.filter( permiso => permiso.activo === 1);
    // console.log(permisos);
    const permisosEspecialesComponente = permisos.filter( permiso => permiso.nombre === this.nombrePermiso);
    // console.log(permisosEspecialesComponente);
    permisosEspecialesComponente.map( permisoExistente => {
      this.navigationService.validatePermissions(this.perfil.idPerfil, permisoExistente.idOpcion).subscribe(
        (result:any) => {
          console.log(result);
          if(result.estatus === '05'){
            this.permisosEspecialesPermitidos.push(permisoExistente.tooltip);
          }
        },
        error => console.log(error)
      );
    });
    console.log(this.permisosEspecialesPermitidos);
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
      latitud: new FormControl('', [
        Validators.required,
      ]),
      longitud: new FormControl('', [
        Validators.required,
      ]),
      observacion: new FormControl('', [
        Validators.required,
      ]),
      vistaRuta: new FormControl('', [
        Validators.required,
      ]),
    });
  }


  updateCustomer() {
    if (this.clienteForm.valid) {
      this.submitButton.disabled = true;
      const newRuta = this.rutas.find( (ruta: Ruta) => ruta.idRuta === this.clienteForm.value.vistaRuta);
      const cliente: Cliente = {
        idCliente: parseInt(this.idCliente),
        idEmpleadoModificacion: this.idUsuarioLogeado,
        ...this.clienteForm.value,
        vistaRuta: newRuta
      };
      console.log(cliente);
      this.clienteService.updateCliente(cliente).subscribe(
        (response => {
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
