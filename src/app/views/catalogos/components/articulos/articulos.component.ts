import { Component, OnInit, ViewChild, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Articulo, ArticuloContent } from 'app/shared/models/articulo'
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource, MatPaginator, PageEvent, MatBottomSheet } from '@angular/material';
import { Observable } from 'rxjs';
import { Router } from '@angular/router'
import { MatSnackBar } from '@angular/material/snack-bar';
import { ArticuloService } from 'app/shared/services/articulo.service';
import { AutenticacionService } from 'app/shared/services/autenticacion.service';
import { ModalEliminarComponent } from 'app/shared/components/modal-eliminar/modal-eliminar.component';
import { SubirImagenArticuloComponent } from '../subir-imagen-articulo/subir-imagen-articulo.component';
import { environment } from './../../../../../environments/environment';
import { FamiliaService } from 'app/shared/services/familia.service';
import { Familia } from 'app/shared/models/familia';

@Component({
  selector: 'app-articulos',
  templateUrl: './articulos.component.html',
  styleUrls: ['./articulos.component.scss']
})
export class ArticulosComponent implements OnInit {

  articulos: Articulo[] = [];
  articulosTemp: Articulo[] = [];
  idUsuarioLogeado;
  paginaActual = 0;
  estatusData = 1;
  dataSerach;
  urlImage = environment.urlImages;
  familias: Familia[] = [];
  idFamilia:number;
  tipoMateriaPrima:string;
  textSearch:string = '';

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  obs$: Observable<any>;
  dataSource: MatTableDataSource<Articulo> = new MatTableDataSource<Articulo>();

  constructor(
    public dialog: MatDialog,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private snackBar: MatSnackBar,
    private articuloService: ArticuloService,
    private autenticacionService: AutenticacionService,
    private bottomSheet: MatBottomSheet,
    private familiaService: FamiliaService
  ) { }

  ngOnInit() {
    this.getArticulos(this.paginaActual);
    this.getCatalog();
    this.changeDetectorRef.detectChanges();
    // this.dataSource.paginator = this.paginator;
    this.obs$ = this.dataSource.connect();
    this.idUsuarioLogeado = this.autenticacionService.currentUserValue;
    this.modifPaginator();
    
  }

  public pageEvent(event?: PageEvent) {
    this.getArticulos(event.pageIndex);
    console.log(event.pageIndex);
  }

  getArticulos(idPaginator) {
    this.articuloService.getArticulos(idPaginator).subscribe(
      ((articulos: ArticuloContent) => {
        this.articulos = articulos.content;
        this.paginator.length = articulos.totalItems;
        this.articulosTemp = this.articulos;
        this.dataSource.data = this.articulos;
        this.estatusData = 1;
        console.log(this.articulos);
      }),
      error => console.log(error)
    );
  }

  getCatalog() {
    this.familiaService.getSelectFamilia().subscribe(
      (result: Familia[]) => {
        console.log(result);
        this.familias = result;
      }
    );
  }

  ngOnDestroy() {
    if (this.dataSource) {
      this.dataSource.disconnect();
    }
  }

  search() {
    if(!this.textSearch && !this.idFamilia && !this.tipoMateriaPrima){
      // console.log('no traigo nada de busqueda');
      this.getArticulos(this.paginaActual);
    } else {
      let text = !this.textSearch ? '&nbsp' : this.textSearch;
      let fam = !this.idFamilia ? 0 : this.idFamilia;
      let matPrima = !this.tipoMateriaPrima ? -1 : parseInt(this.tipoMateriaPrima, 10);
     
      console.log(text);
      console.log(fam);  
      console.log(matPrima);
  
      this.articuloService.getArticulosFiltro(text, fam, matPrima).subscribe(
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
    }
  }

  updateFilter(event) {
    this.search();
    // const val = event.target.value.toLowerCase();
    // this.textSearch = val;
  
    // if(val) {
    //   this.articuloService.getArticulosFiltro(val, 1, 1).subscribe(
    //     result => {
    //       if(result.length > 0) {
    //         console.log(result);
    //         this.dataSource.data = result;
    //         this.paginator.length = result.length;
    //         this.estatusData = 1;
    //       } else {
    //         this.dataSource.data = [];
    //         this.paginator.length = 0;
    //         this.estatusData = 0;
    //         console.log('no se encontro');
    //       }
    //     },
    //     error => console.log(error)
    //   );
    // } else {
    //   this.getArticulos(this.paginaActual);
    // }
  }

  openDialoAlertDelete(idArticulo) {
    const dialogRef = this.dialog.open(ModalEliminarComponent, {
      width: '300px',
      panelClass: 'custom-dialog-container-delete',
      data: idArticulo
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        const empleadoBaja: Partial<Articulo> = {
          idArticulo: idArticulo,
        };

        console.log(empleadoBaja)

        // this.articuloService.deleteEmpleado(empleadoBaja).subscribe(
        //   response => {
        //     console.log(response);
        //     if (response.estatus === '05') {
        //       this.useAlerts(response.mensaje, ' ', 'success-dialog');
        //       this.getArticulos(this.paginaActual);
        //     } else {
        //       this.useAlerts(response.mensaje, ' ', 'error-dialog');
        //     }
        //   },
        //   error => {
        //     this.useAlerts(error.message, ' ', 'error-dialog');
        //     console.log(error);
        //   }
        // );
      }
    });
  }

  uploadImage(idArticulo) {
    console.log(idArticulo);
    let sheet = this.bottomSheet.open(SubirImagenArticuloComponent, {
      data: {
        idUsuario: this.idUsuarioLogeado,
        idArticulo
      }
    });

    sheet.backdropClick().subscribe( () => {
      console.log('clicked'+idArticulo);
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
