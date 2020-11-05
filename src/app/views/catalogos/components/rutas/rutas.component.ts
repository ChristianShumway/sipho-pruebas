import { Component, OnInit, ViewChild, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Ruta, RutaContent } from 'app/shared/models/ruta'
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource, MatPaginator, PageEvent } from '@angular/material';
import { Observable } from 'rxjs';
import { Router } from '@angular/router'
import { MatSnackBar } from '@angular/material/snack-bar';
import { RutaService } from 'app/shared/services/ruta.service';
import { AutenticacionService } from 'app/shared/services/autenticacion.service';
import { ModalEliminarComponent } from 'app/shared/components/modal-eliminar/modal-eliminar.component';

@Component({
  selector: 'app-rutas',
  templateUrl: './rutas.component.html',
  styleUrls: ['./rutas.component.scss']
})
export class RutasComponent implements OnInit {

  rutas: Ruta[] = [];
  idUsuarioLogeado;
  paginaActual = 0;
  estatusData = 1;
  dataSerach;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  obs$: Observable<any>;
  dataSource: MatTableDataSource<Ruta> = new MatTableDataSource<Ruta>();

  constructor(
    public dialog: MatDialog,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private snackBar: MatSnackBar,
    private rutaService: RutaService,
    private autenticacionService: AutenticacionService
  ) { }

  ngOnInit() {
    this.getRutas(this.paginaActual);
    this.changeDetectorRef.detectChanges();
    // this.dataSource.paginator = this.paginator;
    this.obs$ = this.dataSource.connect();
    this.idUsuarioLogeado = this.autenticacionService.currentUserValue;
    this.modifPaginator();
  }

  public pageEvent(event?: PageEvent) {
    this.getRutas(event.pageIndex);
    console.log(event.pageIndex);
  }

  getRutas(idPaginator) {
    this.rutaService.getRutas(idPaginator).subscribe(
      ((rutas: RutaContent) => {
        this.rutas = rutas.content;
        this.paginator.length = rutas.totalItems;
        this.dataSource.data = this.rutas;
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
      this.rutaService.getRutasFiltro(val).subscribe(
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
      this.getRutas(this.paginaActual);
    }
  }

  openDialoAlertDelete(idRuta) {
    const dialogRef = this.dialog.open(ModalEliminarComponent, {
      width: '300px',
      panelClass: 'custom-dialog-container-delete',
      data: idRuta
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        const rutaBaja: Partial<Ruta> = {
          idRuta: idRuta,
          idEmpleadoModifico: this.idUsuarioLogeado
        };

        console.log(rutaBaja)

        this.rutaService.deleteRuta(rutaBaja).subscribe(
          response => {
            console.log(response);
            if (response.estatus === '05') {
              this.useAlerts(response.mensaje, ' ', 'success-dialog');
              this.getRutas(this.paginaActual);
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
