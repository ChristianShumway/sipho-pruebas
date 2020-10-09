import { Component, OnInit, ViewChild, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Empleado, EmpleadoContent } from '../../../../shared/models/empleado'
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource, MatPaginator, PageEvent } from '@angular/material';
import { Observable } from 'rxjs';
import { Router } from '@angular/router'
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmpleadoService } from 'app/shared/services/empleado.service';
import { AutenticacionService } from './../../../../shared/services/autenticacion.service';
import { ModalEliminarComponent } from '../../../../shared/components/modal-eliminar/modal-eliminar.component';
import { environment } from './../../../../../environments/environment';

@Component({
  selector: 'app-vehiculos',
  templateUrl: './vehiculos.component.html',
  styleUrls: ['./vehiculos.component.scss']
})
export class VehiculosComponent implements OnInit {

  empleados: Empleado[] = [];
  empleadosTemp: Empleado[] = [];
  idUsuarioLogeado;
  paginaActual = 0;
  estatusData = 1;
  dataSerach;
  urlImagen = environment.urlImages;
  pathImagenEmpleado = 'employe/photo';


  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  obs$: Observable<any>;
  dataSource: MatTableDataSource<Empleado> = new MatTableDataSource<Empleado>();

  constructor(
    public dialog: MatDialog,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private snackBar: MatSnackBar,
    private empleadoService: EmpleadoService,
    private autenticacionService: AutenticacionService
  ) { }

  ngOnInit() {
    this.getEmpleados(this.paginaActual);
    this.changeDetectorRef.detectChanges();
    // this.dataSource.paginator = this.paginator;
    this.obs$ = this.dataSource.connect();
    this.idUsuarioLogeado = this.autenticacionService.currentUserValue;
    this.modifPaginator();
  }

  public pageEvent(event?: PageEvent) {
    this.getEmpleados(event.pageIndex);
    console.log(event.pageIndex);
  }

  getEmpleados(idPaginator) {
    this.empleadoService.getEmpleados(idPaginator).subscribe(
      ((empleados: EmpleadoContent) => {
        this.empleados = empleados.content;
        console.log(this.empleados);
        this.paginator.length = empleados.totalItems;
        this.empleadosTemp = this.empleados;
        this.dataSource.data = this.empleados;
        this.estatusData = 1;
      }),
      error => console.log(error)
    );
  }

  ngOnDestroy() {
    if (this.dataSource) {
      this.dataSource.disconnect();
    }
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    this.dataSerach = val;
    if(val) {
      this.empleadoService.getEmpleadososFiltro(val).subscribe(
        result => {
          if(result.length > 0) {
            console.log(result);
            this.dataSource.data = result;
            this.paginator.length = result.length;
            this.estatusData = 1;
          } else {
            this.dataSource.data = [];
            this.paginator.length = 0;
            this.estatusData = 0;
            console.log('no se encontro');
          }
        },
        error => console.log(error)
      );
    } else {
      this.getEmpleados(this.paginaActual);
    }
    // const val = event.target.value.toLowerCase();
    // var columns = Object.keys(this.empleadosTemp[0]);
    // columns.splice(columns.length - 1);

    // if (!columns.length)
    //   return;

    // const rows = this.empleadosTemp.filter(function (d) {
    //   for (let i = 0; i <= columns.length; i++) {
    //     let column = columns[i];
    //     if (d[column] && d[column].toString().toLowerCase().indexOf(val) > -1) {
    //       return true;
    //     }
    //   }
    // })

    // this.dataSource.data = rows;
    // // console.log(this.dataSource.data);
  }

  openDialoAlertDelete(idEmpleado) {
    const dialogRef = this.dialog.open(ModalEliminarComponent, {
      width: '300px',
      panelClass: 'custom-dialog-container-delete',
      data: idEmpleado
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        const empleadoBaja: Partial<Empleado> = {
          idEmpleado: idEmpleado,
          // idEmpleadoModifico: this.idUsuarioLogeado
        };

        console.log(empleadoBaja)

        this.empleadoService.deleteEmpleado(empleadoBaja).subscribe(
          response => {
            console.log(response);
            if (response.estatus === '05') {
              this.useAlerts(response.mensaje, ' ', 'success-dialog');
              this.getEmpleados(this.paginaActual);
            } else {
              this.useAlerts(response.mensaje, ' ', 'error-dialog');
            }
          },
          error => {
            this.useAlerts(error.message, ' ', 'error-dialog');
            console.log(error);
          }
        );
      }
    });
  }

  useAlerts(message, action, className) {
    this.snackBar.open(message, action, {
      duration: 2000,
      verticalPosition: 'bottom',
      horizontalPosition: 'right',
      panelClass: [className]
    });
  }

  modifPaginator() {
    this.paginator._intl.itemsPerPageLabel = "items por pagina"
    this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => {
      const start = page * pageSize + 1;
      const end = (page + 1) * pageSize;
      return `${start} - ${end} de ${length}`;
    };
  }

}
