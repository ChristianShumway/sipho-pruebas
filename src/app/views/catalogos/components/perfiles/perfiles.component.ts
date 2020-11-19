import { Component, OnInit,  ViewChild, OnDestroy, ChangeDetectorRef  } from '@angular/core';
import { Perfil, PerfilContent } from '../../../../shared/models/perfil'
import {MatDialog} from '@angular/material/dialog';
import { MatTableDataSource, MatPaginator, PageEvent } from '@angular/material';
import { Observable } from 'rxjs';
import { Router } from '@angular/router'
import {MatSnackBar} from '@angular/material/snack-bar';
import { PerfilesService } from 'app/shared/services/perfiles.service';
import { AutenticacionService } from './../../../../shared/services/autenticacion.service';
import { ModalEliminarComponent } from '../../../../shared/components/modal-eliminar/modal-eliminar.component';

@Component({
  selector: 'app-perfiles',
  templateUrl: './perfiles.component.html',
  styleUrls: ['./perfiles.component.scss']
})
export class PerfilesComponent implements OnInit {

  perfiles: Perfil[] = [];
  perfilesTemp: Perfil[] = [];
  idUsuarioLogeado;
  paginaActual= 0;
  estatusData = 1;
  dataSerach;

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  obs$: Observable<any>;
  dataSource: MatTableDataSource<Perfil> = new MatTableDataSource<Perfil>();

  constructor(
    public dialog: MatDialog,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private snackBar: MatSnackBar,
    private perfilesService: PerfilesService,
    private autenticacionService: AutenticacionService
  ) { }

  ngOnInit() {
    this.getPerfiles(this.paginaActual);
    this.changeDetectorRef.detectChanges();
    // this.dataSource.paginator = this.paginator;
    this.obs$ = this.dataSource.connect();
    this.idUsuarioLogeado = this.autenticacionService.currentUserValue;
    this.modifPaginator();
  }

  public pageEvent(event?:PageEvent){
    this.getPerfiles(event.pageIndex);
    console.log(event.pageIndex);
  }

  getPerfiles(idPaginator){
    this.perfilesService.getPerfiles(idPaginator).subscribe(
      ( (perfiles: PerfilContent) => {
        this.perfiles = perfiles.content;
        this.paginator.length = perfiles.totalItems;
        this.perfilesTemp = this.perfiles;
        this.dataSource.data = this.perfiles;
        this.estatusData = 1;
      }),
      error => console.log(error)
    );
  }

  ngOnDestroy(){
    if (this.dataSource) { 
      this.dataSource.disconnect(); 
    }
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    this.dataSerach = val;
    if(val) {
      this.perfilesService.getPerfilesFiltro(val).subscribe(
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
      this.getPerfiles(this.paginaActual);
    }
    // const val = event.target.value.toLowerCase();
    // var columns = Object.keys(this.perfilesTemp[0]);
    // columns.splice(columns.length - 1);

    // if (!columns.length)
    //   return;

    // const rows = this.perfilesTemp.filter(function(d) {
    //   for (let i = 0; i <= columns.length; i++) {
    //     let column = columns[i];
    //     if (d[column] && d[column].toString().toLowerCase().indexOf(val) > -1) {
    //       return true;
    //     }
    //   }
    // })

    // this.dataSource.data = rows;
    // console.log(this.dataSource.data);
  }

  openDialoAlertDelete(idPerfil) {
    const dialogRef = this.dialog.open(ModalEliminarComponent, {
      width: '300px',
      panelClass: 'custom-dialog-container-delete',
      data: idPerfil
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        
        const perfilBaja: Partial<Perfil> = {
          idPerfil: idPerfil,
          idEmpleadoModifico: this.idUsuarioLogeado
        };

        console.log(perfilBaja)

        this.perfilesService.deletePerfil(perfilBaja).subscribe(
          response => {
            console.log(response);
            if(response.estatus === '05'){
              this.useAlerts(response.mensaje, ' ', 'success-dialog');
              this.getPerfiles(this.paginaActual);
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
      duration: 2000,
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
