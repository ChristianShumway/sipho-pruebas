import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { AutenticacionService } from 'app/shared/services/autenticacion.service';
import { Pedido, PedidoContent, DetallesPedido } from 'app/shared/models/pedido';
import { MatButton, MatSnackBar } from '@angular/material';
import { PedidoService } from 'app/shared/services/pedido.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

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

  constructor(
    private autenticacionService: AutenticacionService,
    private pedidoService: PedidoService,
    private snackBar: MatSnackBar,
    private changeDetectorRef: ChangeDetectorRef,
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
      const nuevaFechaBusqueda = this.pipe.transform(this.fechaBusqueda, format);
      console.log(nuevaFechaBusqueda);

      this.pedidoService.getPedidos(nuevaFechaBusqueda, this.pageActual).subscribe(
        (result: PedidoContent) => {
          console.log(result);
          this.pedidos = result.content;
          this.paginator.length = result.totalItems;
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
