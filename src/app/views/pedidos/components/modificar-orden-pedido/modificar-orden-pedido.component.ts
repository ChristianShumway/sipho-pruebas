import { Component, OnInit, ViewChild, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MatButton, MatInput, MatTableDataSource, MatSort, MatPaginator, MatDialog } from '@angular/material';
import {MatSnackBar} from '@angular/material/snack-bar';
import { AutenticacionService } from 'app/shared/services/autenticacion.service';
import { PedidoService } from 'app/shared/services/pedido.service';
import { ArticuloService } from 'app/shared/services/articulo.service';
import { Articulo } from 'app/shared/models/articulo';
import { Pedido, DetallesPedido } from 'app/shared/models/pedido';
import { switchMap } from 'rxjs/operators';
import { ModalCerrarPedidoComponent } from '../modal-cerrar-pedido/modal-cerrar-pedido.component';

@Component({
  selector: 'app-modificar-orden-pedido',
  templateUrl: './modificar-orden-pedido.component.html',
  styleUrls: ['./modificar-orden-pedido.component.scss']
})
export class ModificarOrdenPedidoComponent implements OnInit, AfterViewInit {

  @Input() idPedido: number;
  @Output() orderClosed: EventEmitter<any> = new EventEmitter();
  @ViewChild('save', {static: false}) submitButton: MatButton;
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
  isLoadingData: boolean = true;
  showClose: boolean = false;
  isReadOnly: boolean = false;
  isReadOnlyCM: boolean = false;
  isReadOnlyCV: boolean = false;
  displayedColumns: string[] = ['no', 'nombre', 'familia', 'cantidadMatutina', 'cantidadVespertina', 'accion'];
  dataSource: MatTableDataSource<DetallesPedido>;
  totalProductosAgregados: number;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  constructor(
    private autenticacionService: AutenticacionService,
    private articuloService: ArticuloService,
    private pedidoService: PedidoService,
    private router: Router,
    private snackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.idUsuarioLogeado = this.autenticacionService.currentUserValue;
    this.getPedido();
  }

  ngAfterViewInit() {
    this.dataSource = new MatTableDataSource(this.articulosSeleccionados);
    this.dataSource.paginator = this.paginator;
    this.modifPaginator();
  }

  getPedido() {
    console.log(this.idPedido);
    this.activatedRoute.params.pipe(
      switchMap((params: Params) => this.pedidoService.getPedido(params.idPedido))
    ).subscribe(
      (result: Pedido) => {
        this.pedido = result;
        this.articulosSeleccionados = result.detpedido;
        console.log(this.articulosSeleccionados);
        this.showClose = true;
        this.isLoadingData = false;
        this.refreshDatasource();
        if(this.pedido.idEstatus === 0) {
          this.isReadOnly = !this.isReadOnly;
          this.isReadOnlyCM = !this.isReadOnlyCM;
          this.isReadOnlyCV = !this.isReadOnlyCV;
        }
      },
      error => console.log(error)
    );
  }

  getTotalProductosAgregados() {
    this.totalProductosAgregados = 0;
    this.articulosSeleccionados.map( (articulo:DetallesPedido ) => {
      // console.log(articulo);
      this.totalProductosAgregados = this.totalProductosAgregados + articulo.cantidad + articulo.cantidadVespertino;
    });
    console.log(this.totalProductosAgregados);
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
        cantidadVespertino: 0,
        idEmpleadoModifico: this.idUsuarioLogeado
      };
      this.articulosSeleccionados.splice(0, 0, articuloPedido)
      this.articulosSeleccionados = [...this.articulosSeleccionados];
      // this.articulosSeleccionados = [...this.articulosSeleccionados, articuloPedido];
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

  deleteArticle(index, det: DetallesPedido) {
    if (det.idDetPedido !== 0) {
      this.pedidoService.deleteDetallesPedido(det).subscribe(
        response => {
          if(response.estatus === '05'){
            this.useAlerts(response.mensaje, ' ', 'success-dialog');
            this.ProccesDelete(index);
            this.getTotalProductosAgregados();
          } else {
            this.useAlerts(response.mensaje, ' ', 'error-dialog');
          }
        },
        error => {
          console.log(error);
          this.useAlerts(error.message, ' ', 'error-dialog');
        }
      );
    } else {
      this.ProccesDelete(index);
      this.getTotalProductosAgregados();
    }
  }

  ProccesDelete(index) {
    this.articulosSeleccionados.splice(index, 1);
    this.articulosSeleccionados = [...this.articulosSeleccionados];
    console.log(this.articulosSeleccionados);
    this.useAlerts('Artículo eliminado de la lista correctamente', ' ', 'success-dialog');
    this.dataSource = new MatTableDataSource(this.articulosSeleccionados);
    this.dataSource.paginator = this.paginator;
  }

  CrearDetallePedido() {
    if(this.articulosSeleccionados.length > 0) {
      console.log(this.articulosSeleccionados);
      this.isLoadingData = true;
      this.submitButton.disabled = true;
      this.pedido = {
        ...this.pedido,
        detpedido: this.articulosSeleccionados
      };

      console.log(this.pedido);
      this.pedidoService.updatePedido(this.pedido).subscribe(
        response => {
          console.log(response)
          if(response.estatus === '05'){
            // this.router.navigate(['/pedidos/ver-pedidos']);
            this.articulosSeleccionados = response.response.detpedido;
            console.log(this.articulosSeleccionados);
            this.actionsSaveDetailsOrder( response.mensaje, 'success-dialog');
            // this.showClose = true;
          } else {
            this.actionsSaveDetailsOrder( response.mensaje, 'error-dialog');
          }
        },
        error => {
          console.log(error);
          this.actionsSaveDetailsOrder( error.message, 'error-dialog');
        }
      );
    } else {
      this.useAlerts('Debes agregar productos a la lista', ' ', 'error-dialog');
    }
  }

  actionsSaveDetailsOrder(message, type) {
    this.useAlerts(message, ' ', type);
    this.submitButton.disabled = !this.submitButton.disabled;
    this.isLoadingData = false;
    this.refreshDatasource();
  }

  refreshDatasource() {
    this.dataSource = new MatTableDataSource(this.articulosSeleccionados);
    this.dataSource.paginator = this.paginator;
    this.getTotalProductosAgregados();
  }


  closeOrder() {
    const dialogRef = this.dialog.open(ModalCerrarPedidoComponent, {
      width: '300px',
      panelClass: 'custom-dialog-container-delete',
      data: {}
    });


    dialogRef.afterClosed().subscribe(result => {
      if(result){
        let newOrder: Pedido = {
          ...this.pedido, 
          detpedido: this.articulosSeleccionados,
          idEstatus: 0
        };
        console.log(newOrder);
        this.pedidoService.updatePedido(newOrder).subscribe(
          response => {
            if(response.estatus === '05'){
              this.useAlerts(response.mensaje, ' ', 'success-dialog');
              if( this.idPedido){
                this.orderClosed.emit(this.pedido.idPedido);
              }
              this.getPedido();
            } else {
              this.useAlerts(response.mensaje, ' ', 'error-dialog');
            }
          }, 
          error => {
            this.useAlerts(error.mensaje, ' ', 'error-dialog');
            console.log(error);
          }
        );
      }
    });
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
