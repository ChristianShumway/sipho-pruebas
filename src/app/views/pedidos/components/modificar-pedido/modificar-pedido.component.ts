import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MatButton, MatTableDataSource } from '@angular/material';
import {MatSnackBar} from '@angular/material/snack-bar';
import { AutenticacionService } from 'app/shared/services/autenticacion.service';
import { PedidoService } from 'app/shared/services/pedido.service';
import { ClienteService } from 'app/shared/services/cliente.service';
import { Cliente } from 'app/shared/models/cliente';
import { Pedido } from 'app/shared/models/pedido';
import { switchMap } from 'rxjs/operators';
import { Ruta } from 'app/shared/models/ruta';
import { RutaService } from 'app/shared/services/ruta.service';

@Component({
  selector: 'app-modificar-pedido',
  templateUrl: './modificar-pedido.component.html',
  styleUrls: ['./modificar-pedido.component.scss']
})
export class ModificarPedidoComponent implements OnInit {

  @ViewChild('save', {static: false}) submitButton: MatButton;
  @ViewChild('btnDelete', {static: false}) deleteArticle: MatButton;
  idUsuarioLogeado;
  idRuta;
  idPedido;
  ruta: Ruta;
  clientes: Cliente[] = [];
  cliente: Cliente[] = [];
  pedido: Pedido;
  dataSearch:string = '';
  searchNow: boolean = false;
  noData: boolean;
  isLoadingData: boolean = true;
  selected;
  isReadOnly: boolean = false;
  displayedColumns: string[] = ['propietario', 'razonSocial', 'rfc', 'telefono', 'accion'];
  dataSource: MatTableDataSource<Cliente>;
  pin = '/assets/images/mark.png';
  expansionCoustomer: boolean = true;
  expansionDetailOrder: boolean = false;
  idPedidoCreado: number;
  showDetailOrder: boolean = false;

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
    this.getOrder();
  }

  getOrder() {
    this.activatedRoute.params.subscribe( (params: Params) => {
      console.log(params);
      this.idRuta = params.idRuta;
      this.idPedido = params.idPedido;
      this.getCustomers();
      this.pedidoService.getPedido(this.idPedido).subscribe(
        (pedido: Pedido) => {
          console.log(pedido);
          this.pedido = pedido;
          this.setCustomer(pedido.vistaCliente);
          this.idPedidoCreado = this.pedido.idPedido;
          this.showDetailOrder = true;
        },
        error => {
          console.log(error);
          this.useAlerts(error.message, ' ', 'error-dialog');
        }
      );
      this.rutaService.getRuta(this.idRuta).subscribe(
        (ruta: Ruta) => {
          this.ruta = ruta;
          // this.idRuta = ruta.idRuta
          console.log(this.ruta);
        }, error => console.log(error)
      );
    });
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
    this.isLoadingData = false;
  }

  setCustomer(coustomer) {
    this.isLoadingData = true;
    this.cliente = [...this.cliente, coustomer];
    console.log(this.cliente);
    this.dataSource = new MatTableDataSource(this.cliente);
    this.isReadOnly = !this.isReadOnly;
    this.cleanSearch();
  }

  deleteCustomer() {
    this.cliente = [];
    this.isReadOnly = !this.isReadOnly;
    this.showDetailOrder = false;
  }

  CrearPedido() {
    this.submitButton.disabled = true;
    this.pedido = {
      ...this.pedido,
      vistaCliente: this.cliente[0],
      idEmpleadoModifico: this.idUsuarioLogeado
    };
    console.log(this.pedido);
    this.pedidoService.updatePedido(this.pedido).subscribe(
      response => {
        if(response.estatus === '05'){
          // this.router.navigate(['/pedidos/ver-pedidos']);
          this.useAlerts(response.mensaje, ' ', 'success-dialog');
          this.submitButton.disabled = false;
          this.expansionCoustomer = false;
          this.expansionDetailOrder = true;
          this.showDetailOrder = true;
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
