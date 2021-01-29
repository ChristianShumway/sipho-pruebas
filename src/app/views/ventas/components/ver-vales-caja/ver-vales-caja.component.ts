import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatExpansionPanel, MatDialog, MatSnackBar, MatButton } from '@angular/material';
import {animate, state, style, transition, trigger} from '@angular/animations'
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ValeService } from 'app/shared/services/vale.service';
import { Vale } from 'app/shared/models/vale';

@Component({
  selector: 'app-ver-vales-caja',
  templateUrl: './ver-vales-caja.component.html',
  styleUrls: ['./ver-vales-caja.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class VerValesCajaComponent implements OnInit, AfterViewInit {

  @ViewChild('buscar', {static:false}) btnBuscar: MatButton;
  public fechaInicio;
  public fechaFin;
  public pipe = new DatePipe('en-US');
  public searchForm: FormGroup;
  public error:any={isError:false,errorMessage:''};
  public paginaActual: number = 0;
  public valesCajaEncontrados: Vale[] =[];
  public searchVale: boolean = false;
  public noVales: boolean = false;
  public dataSource: MatTableDataSource<Vale>;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  columnsToDisplay =   ['no','motivo', 'monto', 'registro','ruta','caja'];
  public expandedElement: any | null;
  public totalItemsNow;

  constructor(
    private valeService: ValeService,
    private snackBar: MatSnackBar,
    private changeDetectorRef: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.getValidations();
    this.changeDetectorRef.detectChanges();
    this.fechaInicio = new Date(this.searchForm.controls['fechaInicio'].value);
    this.fechaInicio.setDate(this.fechaInicio.getDate());
    this.fechaFin = new Date(this.searchForm.controls['fechaFin'].value);
    this.fechaFin.setDate(this.fechaFin.getDate());
  }

  ngAfterViewInit() {
    this.dataSource = new MatTableDataSource(this.valesCajaEncontrados);
    this.dataSource.paginator = this.paginator;
    this.modifPaginator();
  }

  getValidations(){
    this.searchForm = new FormGroup({
      fechaInicio: new FormControl(new Date(), Validators.required),
      fechaFin: new FormControl(new Date(), Validators.required)
    })
  }

  public onFechaInicio(event): void {
    this.fechaInicio = event.value;
    this.compareTwoDates();
  }

  public onFechaFin(event): void {
    this.fechaFin = event.value;
    this.compareTwoDates();
  }

  compareTwoDates(){
    const controlFechaInicio = new Date(this.searchForm.controls['fechaInicio'].value);
    const controlFechaFin = new Date(this.searchForm.controls['fechaFin'].value);

    if( controlFechaFin < controlFechaInicio){
      this.error={isError:true,errorMessage:'Fecha inicial de la busqueda no puede ser mayor a la fecha final del mismo'};
      this.searchForm.controls['fechaInicio'].setValue(new Date(this.searchForm.controls['fechaFin'].value));
      this.fechaInicio =  new Date(this.searchForm.controls['fechaInicio'].value);
      const controlFechaInicio = new Date(this.searchForm.controls['fechaInicio'].value);
      const controlFechaFin = new Date(this.searchForm.controls['fechaFin'].value);
    } else {
      this.error={isError:false};
    }
  }

  resetFlags() {
    this.searchVale = true;
    this.noVales = false;
    this.valesCajaEncontrados = [];
  }
  
  buscarVales() {
    if(this.searchForm.valid) {
      this.btnBuscar.disabled = true;
      const format = 'yyyy-MM-dd';
      const nuevaFechaInicio = this.pipe.transform(this.fechaInicio, format);
      const nuevaFechaFin = this.pipe.transform(this.fechaFin, format);
      this.resetFlags();
      
      this.valeService.getValesCajaPorPeriodo(nuevaFechaInicio, nuevaFechaFin, this.paginaActual).subscribe(
        result => {
          console.log(result);
          this.btnBuscar.disabled = false;
          this.searchVale = false;
          this.valesCajaEncontrados = result.content;
          
          if(this.valesCajaEncontrados.length) {
            this.paginator.length = result.totalItems;
            this.totalItemsNow = this.paginator.length;
            this.dataSource = new MatTableDataSource(this.valesCajaEncontrados);
            console.log(this.valesCajaEncontrados);
          } else {
            this.noVales = true;
            this.useAlerts('No se encontraron cortes en este rango de fechas', '', 'error-dialog');
          }
        }, 
        error => {
          console.log(error);
          this.useAlerts(error.message, '', 'error-dialog');
          this.btnBuscar.disabled = false;
        }
      );
    }
  }

  public pageEvent(event?:PageEvent){
    console.log(event.pageIndex);
    this.paginaActual = event.pageIndex;
    this.buscarVales();
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

  useAlerts(message, action, className){
    this.snackBar.open(message, action, {
      duration: 4000,
      verticalPosition: 'bottom',
      horizontalPosition: 'right',
      panelClass: [className]
    });
  }

}
