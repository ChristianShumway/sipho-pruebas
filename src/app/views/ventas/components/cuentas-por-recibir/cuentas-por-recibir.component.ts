import { Component, OnInit, ViewChild } from '@angular/core';
import { CuentasPorRecibir, DataCuentasPorRecibir } from 'app/shared/models/cuentas-por-recibir';
import { CuentasPorRecibirService } from 'app/shared/services/cuentas-por-recibir.service';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { MatButton, MatSnackBar, MatDialog } from '@angular/material';


@Component({
  selector: 'app-cuentas-por-recibir',
  templateUrl: './cuentas-por-recibir.component.html',
  styleUrls: ['./cuentas-por-recibir.component.scss']
})
export class CuentasPorRecibirComponent implements OnInit {

  pageActual = 0;
  noData: boolean = false;
  dataAccount: DataCuentasPorRecibir[] = [];
  totalItemsNow;
  displayedColumns =   ['nombre','saldo','pendientes','saldar'];
  dataSource: MatTableDataSource<DataCuentasPorRecibir>;
  // @ViewChild(MatButton, {static: false}) submitButton: MatButton;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  // @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild(MatSort, {static: true}) sort: MatSort;


  constructor(
    private cuentasPorRecibirService: CuentasPorRecibirService,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.getDataAccount();
    // this.modifPaginator();
  }

  getDataAccount() {
    this.cuentasPorRecibirService.getCuentasPorCobrar(this.pageActual).subscribe(
      response => {
        console.log(response);
        this.dataAccount = response.content;
        this.paginator.length = response.totalItems;
        this.totalItemsNow = this.paginator.length;
        this.dataSource = new MatTableDataSource(this.dataAccount);
        // this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        console.log(this.dataAccount);
        this.modifPaginator();

      },
      error => console.log(error)
    );
  }

  public pageEvent(event?:PageEvent){
    console.log(event.pageIndex);
    this.pageActual = event.pageIndex;
    this.getDataAccount();
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
    // console.log(this.paginator);
    this.paginator._intl.itemsPerPageLabel ="items por pagina"
    this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => {
      const start = page * pageSize + 1;
      const end = (page + 1) * pageSize;
      return `${start} - ${end} de ${length}`;
    };
  }

}
