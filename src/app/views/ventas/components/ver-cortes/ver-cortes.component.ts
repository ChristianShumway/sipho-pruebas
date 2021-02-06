import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatExpansionPanel, MatDialog, MatSnackBar, MatButton } from '@angular/material';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { CortesService } from 'app/shared/services/cortes.service';
import { Cortes } from 'app/shared/models/cortes';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DesgloseMoneda, DetalleCorte } from 'app/shared/models/detalles-corte';
import { Vale } from 'app/shared/models/vale';


@Component({
  selector: 'app-ver-cortes',
  templateUrl: './ver-cortes.component.html',
  styleUrls: ['./ver-cortes.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class VerCortesComponent implements OnInit, AfterViewInit {

  @ViewChild('buscar', {static:false}) btnBuscar: MatButton;
  @ViewChild('print', {static:false}) print: MatButton;
  public fechaInicio;
  public fechaFin;
  public pipe = new DatePipe('en-US');
  public searchForm: FormGroup;
  public error:any={isError:false,errorMessage:''};
  public paginaActual: number = 0;
  public cortesEncontrados: Cortes[] =[];
  public searchCuts: boolean = false;
  public noCuts: boolean = false;
  public dataSource: MatTableDataSource<Cortes>;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  columnsToDisplay =   ['idCorte','empleado','fecha','ruta','caja'];
  public expandedElement: any | null;
  public totalItemsNow;

  public detalleCorte: DetalleCorte;
  public vales: Vale[] = [];
  public desgloseMoneda: DesgloseMoneda[] = [];
  public searchDetailsCut: boolean = false;
  public dataDet: boolean = false;
  panelOpenState = false;
  public corte: Cortes;
  public isDownload: boolean = false;

  constructor(
    private cortesService: CortesService,
    private dialog: MatDialog,
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
    this.dataSource = new MatTableDataSource(this.cortesEncontrados);
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
    this.searchCuts = true;
    this.noCuts = false;
    this.cortesEncontrados = [];
  }

  buscarCuentas() {
    if(this.searchForm.valid) {
      this.btnBuscar.disabled = true;
      const format = 'yyyy-MM-dd';
      const nuevaFechaInicio = this.pipe.transform(this.fechaInicio, format);
      const nuevaFechaFin = this.pipe.transform(this.fechaFin, format);
      this.resetFlags();

      this.cortesService.getCortesPorPeriodo(nuevaFechaInicio, nuevaFechaFin, this.paginaActual).subscribe(
        result => {
          // console.log(result);
          this.btnBuscar.disabled = false;
          this.searchCuts = false;
          this.cortesEncontrados = result.content;
          
          
          if(this.cortesEncontrados.length) {
            this.paginator.length = result.totalItems;
            this.totalItemsNow = this.paginator.length;
            this.dataSource = new MatTableDataSource(this.cortesEncontrados);
            // console.log(this.cortesEncontrados);
          } else {
            this.noCuts = true;
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
    this.buscarCuentas();
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

  verDetallesCorte(corte: Cortes, element) {
    this.corte = corte;
    if(corte !== element) {
      this.desgloseMoneda = [];
      this.detalleCorte = null;
      this.vales = [];
      this.searchDetailsCut = true;
      this.dataDet = false;

      this.cortesService.getDetallesCorte(corte.idCorte, corte.idCaja).subscribe(
        result => {
          this.dataDet = true;
          this.searchDetailsCut = false;
          this.desgloseMoneda = result.desgloseMoneda;
          this.detalleCorte = result.corte;
          this.vales = result.vales;
          console.log(this.desgloseMoneda);
          console.log(this.detalleCorte);
          console.log(this.vales);
        }, 
        error => {
          console.error(error);
          this.searchDetailsCut = false;
        }
      );
    }
  }

  imprimirReporte() {
    console.log(this.corte);
    this.print.disabled = true;
    this.isDownload = true;
    this.cortesService.generateReportCut(this.corte.idCorte, this.corte.idCaja).subscribe(
      response => {
        this.print.disabled = false;
        // this.searchNowRoute = false;
        var blob = new Blob([response], {type: 'application/pdf'});
        var link=document.createElement('a');
      
        var obj_url = window.URL.createObjectURL(blob);		    
        var link = document.createElement("a");
        link.setAttribute("target", "_blank");
        link.setAttribute("href", obj_url);
        link.setAttribute("download",`reporte-corte.pdf`);
          
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        this.useAlerts('Descargando Reporte', ' ', 'success-dialog');
        this.isDownload = false;
      },
      error => {
        console.log(error);
        this.print.disabled = false;
        // this.searchNowRoute = false;
        this.useAlerts(error.message, ' ', 'error-dialog');
        this.isDownload = false;
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

}
