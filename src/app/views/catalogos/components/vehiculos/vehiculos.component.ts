import { Component, OnInit, ViewChild, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Vehiculo, VehiculoContent } from '../../../../shared/models/vehiculo'
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource, MatPaginator, PageEvent } from '@angular/material';
import { Observable } from 'rxjs';
import { Router } from '@angular/router'
import { MatSnackBar } from '@angular/material/snack-bar';
import { VehiculoService } from 'app/shared/services/vehiculo.service';
import { AutenticacionService } from 'app/shared/services/autenticacion.service';
import { ModalEliminarComponent } from 'app/shared/components/modal-eliminar/modal-eliminar.component';
import { environment } from './../../../../../environments/environment';

@Component({
  selector: 'app-vehiculos',
  templateUrl: './vehiculos.component.html',
  styleUrls: ['./vehiculos.component.scss']
})
export class VehiculosComponent implements OnInit {

  vehiculos: Vehiculo[] = [];
  idUsuarioLogeado;
  paginaActual = 0;
  estatusData = 1;
  dataSerach;
  urlImagen = environment.urlImages;
  pathImagenEmpleado = '';


  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  obs$: Observable<any>;
  dataSource: MatTableDataSource<Vehiculo> = new MatTableDataSource<Vehiculo>();

  constructor(
    public dialog: MatDialog,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private snackBar: MatSnackBar,
    private vehiculoService: VehiculoService,
    private autenticacionService: AutenticacionService
  ) { }

  ngOnInit() {
    this.getVehiculos(this.paginaActual);
    this.changeDetectorRef.detectChanges();
    // this.dataSource.paginator = this.paginator;
    this.obs$ = this.dataSource.connect();
    this.idUsuarioLogeado = this.autenticacionService.currentUserValue;
    this.modifPaginator();
  }

  public pageEvent(event?: PageEvent) {
    this.getVehiculos(event.pageIndex);
    console.log(event.pageIndex);
  }

  getVehiculos(idPaginator) {
    this.vehiculoService.getVehiculos(idPaginator).subscribe(
      ((vehiculos: VehiculoContent) => {
        // this.vehiculos = vehiculos.content.filter((vehiculo: Vehiculo) => vehiculo.activo === 1);
        this.vehiculos = vehiculos.content;
        console.log(this.vehiculos);
        this.paginator.length = vehiculos.totalItems;
        this.dataSource.data = this.vehiculos;
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
      this.vehiculoService.getVehiculosFiltro(val).subscribe(
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
      this.getVehiculos(this.paginaActual);
    }
  }

  openDialoAlertDelete(vehiculo: Vehiculo) {
    const dialogRef = this.dialog.open(ModalEliminarComponent, {
      width: '300px',
      panelClass: 'custom-dialog-container-delete',
      data: vehiculo
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        const vehiculoBaja: Partial<Vehiculo> = {
          ...vehiculo,
          idVehiculo: vehiculo.idVehiculo,
          idEmpleadoModifico: this.idUsuarioLogeado,
          activo: 0
        };

        console.log(vehiculoBaja);

        this.vehiculoService.updateVehiculo(vehiculoBaja).subscribe(
          response => {
            console.log(response);
            if (response.estatus === '05') {
              this.useAlerts(response.mensaje, ' ', 'success-dialog');
              this.getVehiculos(this.paginaActual);
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
