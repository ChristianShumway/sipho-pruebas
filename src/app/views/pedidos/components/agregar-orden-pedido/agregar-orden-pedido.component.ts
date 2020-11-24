import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
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
  selector: 'app-agregar-orden-pedido',
  templateUrl: './agregar-orden-pedido.component.html',
  styleUrls: ['./agregar-orden-pedido.component.scss']
})

export class AgregarOrdenPedidoComponent implements OnInit {

  @Input() idPedido: number;
  @Output() orderClosed: EventEmitter<any> = new EventEmitter();
  @ViewChild('saveDet', {static: false}) submitButton: MatButton;
  idUsuarioLogeado;
  idRuta;
  hoy = new Date();
  pipe = new DatePipe('en-US');
  articulos: Articulo[] = [];
  articulosSeleccionados: DetallesPedido[] = [];
  pedido: Pedido;
  dataSearch:string = '';
  searchNow: boolean = false;
  noData: boolean;
  selected;
  totalProductosAgregados: number = 0;
  showClose: boolean = false;
  displayedColumns: string[] = ['no', 'nombre', 'familia', 'cantidadMatutina', 'cantidadVespertina', 'accion'];
  dataSource: MatTableDataSource<DetallesPedido>;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  detReload: boolean = true;
  isReadOnly: boolean = false;
  isReadOnlyCM: boolean = false;
  isReadOnlyCV: boolean = false;

  constructor(
    private autenticacionService: AutenticacionService,
    private articuloService: ArticuloService,
    private pedidoService: PedidoService,
    private router: Router,
    private snackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute,    
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.idUsuarioLogeado = this.autenticacionService.currentUserValue;
    this.getPedido();
    // console.log(this.paginator);
  }

  getPedido() {
    if(this.idPedido) {
      this.pedidoService.getPedido(this.idPedido).subscribe(
        (result: Pedido) => {
          this.detReload = false;
          this.pedido = result;
          this.articulosSeleccionados = result.detpedido;
          console.log(this.pedido);
          console.log(this.articulosSeleccionados);
          if( this.articulosSeleccionados.length > 0) {
            this.refreshDatasource();
            this.showClose = true;
          }
          if(this.pedido.idEstatus === 0) {
            this.isReadOnly = !this.isReadOnly;
            this.isReadOnlyCM = !this.isReadOnlyCM;
            this.isReadOnlyCV = !this.isReadOnlyCV;
          }
        },
        error => console.log(error)
      );
    } else {
      this.activatedRoute.params.subscribe( (params: Params) => {
        console.log(params);
        this.idRuta = params.idRuta;
        const idPedido = params.idPedido;
        this.pedidoService.getPedido(idPedido).subscribe(
          (result: Pedido) => {
            this.detReload = false;
            this.pedido = result;
            this.articulosSeleccionados = result.detpedido;
            console.log(this.pedido);
            console.log(this.articulosSeleccionados);
            if( this.articulosSeleccionados.length > 0) {
              this.refreshDatasource();
              this.showClose = true;
            }
            if(this.pedido.idEstatus === 0) {
              this.isReadOnly = !this.isReadOnly;
              this.isReadOnlyCM = !this.isReadOnlyCM;
              this.isReadOnlyCV = !this.isReadOnlyCV;
            }
          },
          error => {
            console.log(error);
            this.useAlerts(error.message, ' ', 'error-dialog');
          }
        );  
      });

      // this.activatedRoute.params.pipe(
      //   switchMap((params: Params) => this.pedidoService.getPedido(params.idPedido))
      // ).subscribe(
      //   (result: Pedido) => {
      //     this.detReload = false;
      //     this.pedido = result;
      //     this.articulosSeleccionados = result.detpedido;
      //     console.log(this.pedido);
      //     console.log(this.articulosSeleccionados);
      //     if( this.articulosSeleccionados.length > 0) {
      //       this.refreshDatasource();
      //       this.showClose = true;
      //     }
      //     if(this.pedido.idEstatus === 0) {
      //       this.isReadOnly = !this.isReadOnly;
      //       this.isReadOnlyCM = !this.isReadOnlyCM;
      //       this.isReadOnlyCV = !this.isReadOnlyCV;
      //     }
      //   },
      //   error => console.log(error)
      // );
    }
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
      console.log(this.articulosSeleccionados);
      this.refreshDatasource();
      this.cleanSearch();
      this.useAlerts('Artículo agregado a la lista correctamente', ' ', 'success-dialog');
    } else {
      this.useAlerts('Artículo ya se encuentra agregado en tu lista', ' ', 'error-dialog');
    }
  }

  getTotalProductosAgregados() {
    this.totalProductosAgregados = 0;
    this.articulosSeleccionados.map( (articulo:DetallesPedido ) => {
      this.totalProductosAgregados = this.totalProductosAgregados + articulo.cantidad + articulo.cantidadVespertino;
    });
  }

  deleteArticle(index, det: DetallesPedido) {
    if (det.idDetPedido !== 0) {
      this.pedidoService.deleteDetallesPedido(det).subscribe(
        response => {
          if(response.estatus === '05'){
            this.useAlerts(response.mensaje, ' ', 'success-dialog');
            this.ProccesDelete(index);
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
    }
  }

  ProccesDelete(index) {
    this.articulosSeleccionados.splice(index, 1);
    this.articulosSeleccionados = [...this.articulosSeleccionados];
    console.log(this.articulosSeleccionados);
    this.useAlerts('Artículo eliminado de la lista correctamente', ' ', 'success-dialog');
    this.refreshDatasource();
  }

  CrearDetallePedido() {
    if(this.articulosSeleccionados.length > 0) {
      this.detReload = true;
      console.log(this.articulosSeleccionados);
      this.submitButton.disabled = true;
      this.pedido = {
        ...this.pedido,
        detpedido: this.articulosSeleccionados
      };

      console.log(this.pedido);
      this.pedidoService.updatePedido(this.pedido).subscribe(
        response => {
          console.log(response);
          if(response.estatus === '05'){
            this.articulosSeleccionados = response.response.detpedido;
            this.showClose = true;
            this.actionsSaveDetailsOrder(response.mensaje, 'success-dialog');
          } else {
            this.actionsSaveDetailsOrder(response.mensaje, 'error-dialog');
          }
        },
        error => {
          console.log(error);
          this.actionsSaveDetailsOrder(error.mesage, 'error-dialog');
        }
      );
    } else {
      this.useAlerts('Debes agregar productos a la lista', ' ', 'error-dialog');
    }
  }

  actionsSaveDetailsOrder(message, type) {
    this.useAlerts(message, ' ', type);
    this.submitButton.disabled = !this.submitButton.disabled;
    this.detReload = false;
    this.refreshDatasource();
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

  refreshDatasource() {
    this.dataSource = new MatTableDataSource(this.articulosSeleccionados);
    this.dataSource.paginator = this.paginator;
    this.getTotalProductosAgregados();
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
