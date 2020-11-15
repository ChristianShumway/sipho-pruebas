import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { AutenticacionService } from 'app/shared/services/autenticacion.service';
import { Pedido, PedidoContent, DetallesPedido } from 'app/shared/models/pedido';
import { MatButton, MatSnackBar, MatDialog } from '@angular/material';
import { PedidoService } from 'app/shared/services/pedido.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { forkJoin } from 'rxjs';
import { ModalEliminarComponent } from 'app/shared/components/modal-eliminar/modal-eliminar.component';
import { ModalCerrarPedidoComponent } from '../modal-cerrar-pedido/modal-cerrar-pedido.component';

@Component({
  selector: 'app-ver-pedidos',
  templateUrl: './ver-pedidos.component.html',
  styleUrls: ['./ver-pedidos.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class VerPedidosComponent implements OnInit, AfterViewInit {

  idUsuarioLogeado;
  searchOrderForm: FormGroup;
  fechaBusqueda;
  pipe = new DatePipe('en-US');
  pedidos: Pedido[] = [];
  noData: boolean = false;
  searchNow: boolean = false;
  pageActual = 0;
  dataSource: MatTableDataSource<Pedido>;
  @ViewChild(MatButton, {static: false}) submitButton: MatButton;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  columnsToDisplay =   ['no','propietario','razonSocial','direccion','fechaSurtir','acciones'];
  expandedElement: any | null;
  totalItemsNow;

  constructor(
    private autenticacionService: AutenticacionService,
    private pedidoService: PedidoService,
    private snackBar: MatSnackBar,
    private changeDetectorRef: ChangeDetectorRef,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.idUsuarioLogeado = this.autenticacionService.currentUserValue;
    this.getValidations();
    this.changeDetectorRef.detectChanges();
    this.fechaBusqueda = new Date(this.searchOrderForm.controls['fechaBusqueda'].value);
    this.fechaBusqueda.setDate(this.fechaBusqueda.getDate());
  }
  
  ngAfterViewInit() {
    this.dataSource = new MatTableDataSource(this.pedidos);
    this.dataSource.paginator = this.paginator;
    this.modifPaginator();
  }

  getValidations(){
    this.searchOrderForm = new FormGroup({
      fechaBusqueda: new FormControl(new Date(), Validators.required)
    })
  }

  public onFechaBusqueda(event): void {
    this.fechaBusqueda = event.value;
  }

  searchOrder(){
    if(this.searchOrderForm.valid) {
      this.pedidos = [];
      this.submitButton.disabled = true;
      this.searchNow = true;
      this.noData = false;
      const format = 'yyyy-MM-dd';
      this.fechaBusqueda = this.pipe.transform(this.fechaBusqueda, format);
      console.log(this.fechaBusqueda);

      // forkJoin({
      //   sendData: this.pedidoService.getDataPedidos(nuevaFechaBusqueda, this.pageActual),
      //   getData:  this.pedidoService.orders$
      // }).subscribe( ({sendData, getData}) => {

      //   console.log(sendData);
      //   console.log(getData);

      // });
      this.pedidoService.getPedidos(this.fechaBusqueda, this.pageActual).subscribe(
        (result: PedidoContent) => {
          console.log(result);
          this.pedidos = result.content;
          this.paginator.length = result.totalItems;
          this.totalItemsNow = this.paginator.length;
          this.dataSource = new MatTableDataSource(this.pedidos);
          if(this.pedidos.length === 0) {
            this.noData = true;
            this.useAlerts('No se encontraron pedidos con esa fecha', ' ', 'error-dialog');
          } else {
            this.noData = false;
          }
          this.submitButton.disabled = false;
          this.searchNow = false;
        }, 
        error => {
          console.log(error);
          this.useAlerts(error.message, ' ', 'error-dialog');
          this.submitButton.disabled = false;
        }
      );
    }
  }

  public pageEvent(event?:PageEvent){
    console.log(event.pageIndex);
    this.pageActual = event.pageIndex;
    this.searchOrder();
  }

  closeOrder(index, order: Pedido) {
    const dialogRef = this.dialog.open(ModalCerrarPedidoComponent, {
      width: '300px',
      panelClass: 'custom-dialog-container-delete',
      data: order
    });


    dialogRef.afterClosed().subscribe(result => {
      if(result){
        let newOrder: Pedido = {...order, idEstatus: 0};
        this.pedidoService.updatePedido(newOrder).subscribe(
          response => {
            if(response.estatus === '05'){
              this.useAlerts(response.mensaje, ' ', 'success-dialog');
              let foundIndex = this.pedidos.findIndex( (order: Pedido) => order.idPedido === newOrder.idPedido);
              this.pedidos[foundIndex] = newOrder;
              this.dataSource = new MatTableDataSource(this.pedidos);
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

  deleteOrder(index, order: Pedido) {
    const dialogRef = this.dialog.open(ModalEliminarComponent, {
      width: '300px',
      panelClass: 'custom-dialog-container-delete',
      data: order
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.pedidoService.deletePedido(order).subscribe(
          response => {
            console.log(response);
            if(response.estatus === '05'){
              this.useAlerts(response.mensaje, ' ', 'success-dialog');
              this.pedidos.splice(index, 1);
              this.pedidos = [...this.pedidos];
              this.getOnlyOrders();
              this.paginator.length = this.paginator.length - 1;
              // this.dataSource = new MatTableDataSource(this.pedidos);
              // this.dataSource.paginator = this.paginator;
              // if(this.pedidos.length <= 10) {
              //   this.pageActual = 0;
              // }
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

  deleteDetOrder(index, article, order: Pedido) {
    const dialogRef = this.dialog.open(ModalEliminarComponent, {
      width: '300px',
      panelClass: 'custom-dialog-container-delete',
      data: article
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if(result){
      
        this.pedidoService.deleteDetallesPedido(article).subscribe(
          response => {
            console.log(response);
            if(response.estatus === '05'){
              this.useAlerts(response.mensaje, ' ', 'success-dialog');
              let orderSelected = order;
              let det = orderSelected.detpedido;
              det.splice(index, 1);
              det = [...det];
              orderSelected.detpedido = det;
              console.log(orderSelected);
              let foundIndex = this.pedidos.findIndex( (order: Pedido) => order.idPedido === orderSelected.idPedido);
              this.pedidos[foundIndex] = orderSelected;
              // this.pedidoService.getDataPedidos(this.fechaBusqueda, this.pageActual);
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

  getOnlyOrders() {
    this.pedidos = [];
    this.pedidoService.getPedidos(this.fechaBusqueda, this.pageActual).subscribe(
      (result: PedidoContent) => {
        console.log(result);
        this.paginator.length = result.totalItems;
        this.pedidos = result.content;
        this.dataSource = new MatTableDataSource(this.pedidos);
        this.dataSource.paginator = this.paginator;
        if(this.pedidos.length <= 10) {
          this.pageActual = 0;
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

  modifPaginator() {
    console.log(this.paginator);
    this.paginator._intl.itemsPerPageLabel ="items por pagina"
    this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => {
      const start = page * pageSize + 1;
      const end = (page + 1) * pageSize;
      return `${start} - ${end} de ${length}`;
    };
  }


}
