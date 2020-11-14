import { Component, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { MatButton, MatInput, MatTableDataSource } from '@angular/material';
import {MatSnackBar} from '@angular/material/snack-bar';
import { AutenticacionService } from 'app/shared/services/autenticacion.service';
import { PedidoService } from 'app/shared/services/pedido.service';
import { ClienteService } from 'app/shared/services/cliente.service';
import { Cliente, ClienteContent } from 'app/shared/models/cliente';
import { Pedido } from 'app/shared/models/pedido';

@Component({
  selector: 'app-realizar-pedido',
  templateUrl: './realizar-pedido.component.html',
  styleUrls: ['./realizar-pedido.component.scss']
})
export class RealizarPedidoComponent implements OnInit {

  @ViewChild(MatButton, {static: false}) submitButton: MatButton;
  idUsuarioLogeado;
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

  constructor(
    private autenticacionService: AutenticacionService,
    private clienteService: ClienteService,
    private pedidoService: PedidoService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.idUsuarioLogeado = this.autenticacionService.currentUserValue;
  }

  searchCoustomers(event) {
    const data = event.target.value.toLowerCase();
    this.searchNow = true;
    this.noData = false;
    this.clientes = [];
    this.selected = -1;
    if(data) {
      this.clienteService.getClientesFiltro(data).subscribe(
        (clientes: Cliente[]) => {
          clientes.length > 0 ? this.noData = false : this.noData = true;
          this.clientes = clientes;
          this.searchNow = false;
        },
        error => console.log(error)
      );
    } else {
      this.searchNow = false;
      // this.useAlerts('No se encontraron clientes con este nombre', ' ', 'error-dialog');
    }
  }

  cleanSearch() {
    this.dataSearch = '';
    this.clientes = [];
    this.noData = false;
    this.searchNow = false;
  }

  setCoustomer(coustomer) {
    this.cliente = [...this.cliente, coustomer];
    console.log(this.cliente);
    this.dataSource = new MatTableDataSource(this.cliente);
    this.isReadOnly = !this.isReadOnly;
    this.cleanSearch();
  }

  deleteCoustomer() {
    this.cliente = [];
    this.isReadOnly = !this.isReadOnly;
  }

  CrearPedido() {
    this.submitButton.disabled = true;
    const format = 'yyyy-MM-dd';
    const myFormatedDate = this.pipe.transform(this.hoy, format);
    const cliente = this.cliente[0];
    const pedido: Pedido = {
      idPedido: 0,
      vistaCliente: cliente,
      fechaSurtir: myFormatedDate,
      idEstatus: 1,
      idEmpleadoModifico: this.idUsuarioLogeado
    };
    console.log(pedido)

    this.pedidoService.updatePedido(pedido).subscribe(
      response => {
        if(response.estatus === '05'){
          this.router.navigate(['/pedidos/ver-pedidos']);
          this.useAlerts(response.mensaje, ' ', 'success-dialog');
          this.submitButton.disabled = false;
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
  
  useAlerts(message, action, className){
    this.snackBar.open(message, action, {
      duration: 4000,
      verticalPosition: 'bottom',
      horizontalPosition: 'right',
      panelClass: [className]
    });
  }

}
