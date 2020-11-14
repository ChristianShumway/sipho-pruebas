import { Component, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MatButton, MatInput, MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import {MatSnackBar} from '@angular/material/snack-bar';
import { AutenticacionService } from 'app/shared/services/autenticacion.service';
import { PedidoService } from 'app/shared/services/pedido.service';
import { ArticuloService } from 'app/shared/services/articulo.service';
import { Articulo } from 'app/shared/models/articulo';
import { Pedido, DetallesPedido } from 'app/shared/models/pedido';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-agregar-orden-pedido',
  templateUrl: './agregar-orden-pedido.component.html',
  styleUrls: ['./agregar-orden-pedido.component.scss']
})

export class AgregarOrdenPedidoComponent implements OnInit {

  @ViewChild(MatButton, {static: false}) submitButton: MatButton;
  idUsuarioLogeado;
  hoy = new Date();
  pipe = new DatePipe('en-US');
  articulos: Articulo[] = [];
  articulosSeleccionados: DetallesPedido[] = [];
  pedido: Pedido;
  dataSearch:string = '';
  searchNow: boolean = false;
  noData: boolean;
  selected;
  isSave: boolean = false;
  displayedColumns: string[] = ['no', 'nombre', 'familia', 'grupo', 'cantidad', 'accion'];
  dataSource: MatTableDataSource<DetallesPedido>;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  constructor(
    private autenticacionService: AutenticacionService,
    private articuloService: ArticuloService,
    private pedidoService: PedidoService,
    private router: Router,
    private snackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.idUsuarioLogeado = this.autenticacionService.currentUserValue;
    this.getPedido();
    console.log(this.paginator);
  }

  getPedido() {
    this.activatedRoute.params.pipe(
      switchMap((params: Params) => this.pedidoService.getPedido(params.idPedido))
    ).subscribe(
      (result: Pedido) => this.pedido = result,
      error => console.log(error)
    );
  }

  searchArticles(event) {
    const data = event.target.value.toLowerCase();
    this.searchNow = true;
    this.noData = false;
    this.articulos = [];
    this.selected = -1;
    if(data) {
      this.articuloService.getArticulosFiltro(data, 0, -1).subscribe(
        (articulos: Articulo[]) => {
          // console.log(articulos);
          articulos.length > 0 ? this.noData = false : this.noData = true;
          this.articulos = articulos;
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
    this.articulos = [];
    this.noData = false;
    this.searchNow = false;
  }

  setArticle(article: Articulo) {
    const articuloExistente = this.articulosSeleccionados.find( (art: DetallesPedido) => art.articulo.idArticulo === article.idArticulo);
    if(!articuloExistente) {
      const articuloPedido: DetallesPedido = {
        idDetPedido: 0,
        idPedido: this.pedido.idPedido,
        articulo: article,
        cantidad: 0,
        idEmpleadoModifico: this.idUsuarioLogeado
      };
      this.articulosSeleccionados = [...this.articulosSeleccionados, articuloPedido];
      console.log(this.articulosSeleccionados);
      this.dataSource = new MatTableDataSource(this.articulosSeleccionados);
      this.dataSource.paginator = this.paginator;
      this.cleanSearch();
      this.useAlerts('Artículo agregado a la lista correctamente', ' ', 'success-dialog');
      // this.modifPaginator();
    } else {
      this.useAlerts('Artículo ya se encuentra agregado en tu lista', ' ', 'error-dialog');
    }
  }

  deleteArticle(index) {
    console.log(index);
    this.articulosSeleccionados.splice(index, 1);
    this.articulosSeleccionados = [...this.articulosSeleccionados];
    console.log(this.articulosSeleccionados);
    this.useAlerts('Artículo eliminado de la lista correctamente', ' ', 'success-dialog');
    this.dataSource = new MatTableDataSource(this.articulosSeleccionados);
    this.dataSource.paginator = this.paginator;
    // this.paginator.length = this.articulosSeleccionados.length;
  }

  CrearDetallePedido() {
    if(this.articulosSeleccionados.length > 0) {
      console.log(this.articulosSeleccionados);
      this.isSave = true;
      this.submitButton.disabled = true;
      this.pedido = {
        ...this.pedido,
        detpedido: this.articulosSeleccionados
      };

      console.log(this.pedido);
      this.pedidoService.updatePedido(this.pedido).subscribe(
        response => {
          if(response.estatus === '05'){
            this.router.navigate(['/pedidos/ver-pedidos']);
            this.useAlerts(response.mensaje, ' ', 'success-dialog');
            this.submitButton.disabled = false;
            this.isSave = false;
          } else {
            this.useAlerts(response.mensaje, ' ', 'error-dialog');
            this.submitButton.disabled = false;
            this.isSave = false;
          }
        },
        error => {
          console.log(error);
          this.useAlerts(error.message, ' ', 'error-dialog');
          this.submitButton.disabled = false;
          this.isSave = false;
        }
      );
    } else {
      this.useAlerts('Debes agregar productos a la lista', ' ', 'error-dialog');
    }
    // this.submitButton.disabled = true;
    // const format = 'yyyy-MM-dd';
    // const myFormatedDate = this.pipe.transform(this.hoy, format);
    // const cliente = this.cliente[0];
    // const pedido: Pedido = {
    //   idPedido: 0,
    //   vistaCliente: cliente,
    //   fechaSurtir: myFormatedDate,
    //   idEstatus: 1,
    //   idEmpleadoModifico: this.idUsuarioLogeado
    // };
    // console.log(pedido)

    // this.pedidoService.updatePedido(pedido).subscribe(
    //   response => {
    //     if(response.estatus === '05'){
    //       this.router.navigate(['/pedidos/ver-pedidos']);
    //       this.useAlerts(response.mensaje, ' ', 'success-dialog');
    //       this.submitButton.disabled = false;
    //     } else {
    //       this.useAlerts(response.mensaje, ' ', 'error-dialog');
    //       this.submitButton.disabled = false;
    //     }
    //   },
    //   error => {
    //     console.log(error);
    //     this.useAlerts(error.message, ' ', 'error-dialog');
    //     this.submitButton.disabled = false;
    //   }
    // );
  }
  
  useAlerts(message, action, className){
    this.snackBar.open(message, action, {
      duration: 4000,
      verticalPosition: 'bottom',
      horizontalPosition: 'right',
      panelClass: [className]
    });
  }

  modifPaginator() {
    this.paginator._intl.itemsPerPageLabel ="items por pagina"
    this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => {
      const start = page * pageSize + 1;
      const end = (page + 1) * pageSize;
      return `${start} - ${end} de ${length}`;
    };
  }

}
