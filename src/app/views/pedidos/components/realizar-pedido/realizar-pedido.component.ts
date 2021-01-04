import { Component, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router, Params } from '@angular/router';
import { MatButton, MatTableDataSource } from '@angular/material';
import {MatSnackBar} from '@angular/material/snack-bar';
import { AutenticacionService } from 'app/shared/services/autenticacion.service';
import { PedidoService } from 'app/shared/services/pedido.service';
import { ClienteService } from 'app/shared/services/cliente.service';
import { Cliente } from 'app/shared/models/cliente';
import { Pedido } from 'app/shared/models/pedido';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { RutaService } from 'app/shared/services/ruta.service';
import { Ruta } from 'app/shared/models/ruta';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-realizar-pedido',
  templateUrl: './realizar-pedido.component.html',
  styleUrls: ['./realizar-pedido.component.scss']
})
export class RealizarPedidoComponent implements OnInit {

  @ViewChild('save', {static: false}) submitButton: MatButton;
  @ViewChild('btnDelete', {static: false}) deleteArticle: MatButton;
  idUsuarioLogeado;
  idRuta;
  ruta: Ruta;
  hoy = new Date();
  pipe = new DatePipe('en-US');
  clientes: Cliente[] = [];
  cliente: Cliente[] = [];
  dataSearch:string = '';
  searchNow: boolean = false;
  noData: boolean;
  selected;
  isReadOnly: boolean = false;
  displayedColumns: string[] = ['propietario', 'razonSocial', 'rfc', 'telefono', 'accion'];
  dataSource: MatTableDataSource<Cliente>;
  pin = '/assets/images/mark.png';
  idPedidoCreado: number = 0;
  pedidoCreado: Pedido;
  expansionCoustomer:boolean = true;
  expansionDetailOrder:boolean = false;

  constructor(
    private autenticacionService: AutenticacionService,
    private clienteService: ClienteService,
    private pedidoService: PedidoService,
    private router: Router,
    private snackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute,
    private rutaService: RutaService
  ) { }

  ngOnInit() {
    this.idUsuarioLogeado = this.autenticacionService.currentUserValue;
    this.activatedRoute.params.pipe( 
      switchMap( (params: Params) => this.rutaService.getRuta(params.idRuta))
    ).subscribe(
      (ruta: Ruta) => {
        this.ruta = ruta;
        this.idRuta = ruta.idRuta
        console.log(this.ruta);
        this.getCustomers();
      }
    );
  }

  getCustomers() {
    this.searchNow = true;
    this.noData = false;
    this.clienteService.getClientesPorRuta(this.idRuta).subscribe(
      (clientes: Cliente[]) => {
        console.log(clientes);
        this.searchNow = false;
        this.clientes = clientes;
        clientes.length > 0 ? this.noData = false : this.noData = true;
      },
      error => console.log(error)
    );
  }

  searchCustomers(event) {
    const data = event.target.value.toLowerCase();
    this.searchNow = true;
    this.noData = false;
    this.clientes = [];
    this.selected = -1;
    if(data) {
      this.clienteService.getClientesFiltro(data, this.idRuta).subscribe(
        (clientes: Cliente[]) => {
          clientes.length > 0 ? this.noData = false : this.noData = true;
          this.clientes = clientes;
          this.searchNow = false;
        },
        error => console.log(error)
      );
    } else {
      this.searchNow = false;
    }
  }

  cleanSearch() {
    this.dataSearch = '';
    // this.clientes = [];
    this.noData = false;
    this.searchNow = false;
  }

  setCustomer(coustomer) {
    this.cliente = [...this.cliente, coustomer];
    console.log(this.cliente);
    this.dataSource = new MatTableDataSource(this.cliente);
    this.isReadOnly = !this.isReadOnly;
    this.cleanSearch();
  }

  deleteCustomer() {
    this.cliente = [];
    this.isReadOnly = !this.isReadOnly;
    this.pedidoCreado = null;
  }

  CrearPedido() {
    this.submitButton.disabled = true;
    const format = 'yyyy-MM-dd';
    const myFormatedDate = this.pipe.transform(this.hoy, format);
    const cliente = this.cliente[0];
    const pedido: Pedido = {
      idPedido: this.idPedidoCreado,
      vistaCliente: cliente,
      fechaSurtir: myFormatedDate,
      idEstatus: 1,
      idEmpleadoModifico: this.idUsuarioLogeado
    };
    console.log(pedido)

    this.pedidoService.updatePedido(pedido).subscribe(
      response => {
        console.log(response);
        if(response.estatus === '05'){
          // this.router.navigate(['/pedidos/ver-pedidos']);
          this.useAlerts(response.mensaje, ' ', 'success-dialog');
          this.idPedidoCreado = response.response.idPedido;
          this.pedidoCreado = response.response;
          this.expansionCoustomer = false;
          this.expansionDetailOrder = true;
          this.submitButton.disabled = false;
          console.log(this.pedidoCreado);
        } else {
          this.useAlerts(response.mensaje, ' ', 'error-dialog');
          this.submitButton.disabled = false;
        }
      },
      error => {
        console.log(error);
        this.useAlerts(error.message, ' ', 'error-dialog');
        this.submitButton.disabled = false;
      }
    );
  }

  showEstatus(event):void{
    console.log(event);
    this.submitButton.disabled = true;
    this.deleteArticle.disabled = true;
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
