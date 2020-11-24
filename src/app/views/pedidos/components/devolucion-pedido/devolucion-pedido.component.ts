import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { AutenticacionService } from 'app/shared/services/autenticacion.service';
import { DevolucionPedido } from 'app/shared/models/devolucion-pedido';
import { MatButton, MatSnackBar, MatDialog } from '@angular/material';
import { DevolucionPedidoService } from 'app/shared/services/devolucion-pedido.service';
import { forkJoin } from 'rxjs';
import { Ruta } from 'app/shared/models/ruta';
import { RutaService } from 'app/shared/services/ruta.service';

@Component({
  selector: 'app-devolucion-pedido',
  templateUrl: './devolucion-pedido.component.html',
  styleUrls: ['./devolucion-pedido.component.scss']
})
export class DevolucionPedidoComponent implements OnInit {

  idUsuarioLogeado;
  searchDeliveryForm: FormGroup;
  // deliveryForm: FormGroup;
  fechaBusqueda;
  pipe = new DatePipe('en-US');
  entrega: DevolucionPedido;
  rutas: Ruta[] = [];
  ruta: Ruta;
  noData: boolean = false;
  searchNow: boolean = false;
  isSave: boolean = false;
  respuestaEntrega: DevolucionPedido
  @ViewChild('search', {static: false}) submitButton: MatButton;

  constructor(
    private autenticacionService: AutenticacionService,
    private devolucionPedidoService: DevolucionPedidoService,
    private rutaService: RutaService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.idUsuarioLogeado = this.autenticacionService.currentUserValue;
    this.getValidationsSearch();
    this.gerRoutes();
    this.fechaBusqueda = new Date(this.searchDeliveryForm.controls['fechaBusqueda'].value);
    this.fechaBusqueda.setDate(this.fechaBusqueda.getDate());
  }

  gerRoutes() {
    this.rutaService.getSelectRutaByEmploye(this.idUsuarioLogeado).subscribe(
      (rutas: Ruta[]) => {
        this.rutas = rutas;
        console.log(rutas);
      }, 
      error => console.log(error)
    );
  }

  getValidationsSearch(){
    this.searchDeliveryForm = new FormGroup({
      fechaBusqueda: new FormControl(new Date(), Validators.required),
      idRuta: new FormControl('', Validators.required)
    });
  }

  public onFechaBusqueda(event): void {
    this.fechaBusqueda = event.value;
  }

  searchDelivery(){
    if(this.searchDeliveryForm.valid) {
      this.submitButton.disabled = true;
      this.searchNow = true;
      this.noData = false;
      const format = 'yyyy-MM-dd';
      this.fechaBusqueda = this.pipe.transform(this.fechaBusqueda, format);
      // console.log(this.fechaBusqueda);
      this.entrega = null;
      this.respuestaEntrega = null;
      this.ruta = null;

      this.devolucionPedidoService.getLogDelivery(this.fechaBusqueda, this.searchDeliveryForm.value.idRuta).subscribe(
        (result: DevolucionPedido) => {
          this.entrega = result;
          console.log(this.entrega);
          this.submitButton.disabled = false;
          this.searchNow = false;

          if(!this.entrega) {
            this.noData = true;
            this.useAlerts('No se encontro entrega con esa fecha', ' ', 'error-dialog');
          } else {
            this.noData = false;
            console.log(this.entrega);
            this.ruta = this.rutas.find((ruta: Ruta) => ruta.idRuta === this.searchDeliveryForm.value.idRuta);
            if( this.entrega.idBitacoraEntrega !== 0) {
              this.respuestaEntrega = this.entrega;
            }
          }
          
        }, 
        error => {
          console.log(error);
          this.useAlerts(error.message, ' ', 'error-dialog');
          this.submitButton.disabled = false;
        }
      );
    }
  }

  saveDelivery(data) {
    if(data) {
      this.isSave = true;
      this.respuestaEntrega = null;
      const newDelivery: DevolucionPedido = {
        ...this.entrega,
        idRuta: this.searchDeliveryForm.value.idRuta,
        cantidadDevuelta: parseInt(data.cantidadDevuelta),
        cantidadVendida: parseInt(data.cantidadVendida),
        idEmpleadoModificacion: this.idUsuarioLogeado
      };
      console.log(newDelivery);
      this.devolucionPedidoService.saveBitacoraDelivery(newDelivery).subscribe(
        response => {
          console.log(response);
          this.isSave = false;
          if(response.estatus === '05'){
            this.useAlerts(response.mensaje, ' ', 'success-dialog');
            this.respuestaEntrega = response.response;
            this.entrega = response.response;
          } else {
            this.useAlerts(response.mensaje, ' ', 'error-dialog');
          }
        },
        error => {
          console.log(error);
          this.isSave = false;
        }
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
