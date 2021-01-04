import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Ruta } from 'app/shared/models/ruta';
import { MatButton, MatSnackBar } from '@angular/material';
import { DevolucionPedido } from 'app/shared/models/devolucion-pedido';
import { DevolucionPedidoService } from 'app/shared/services/devolucion-pedido.service';
import { AutenticacionService } from 'app/shared/services/autenticacion.service';
import { RutaService } from './../../../../shared/services/ruta.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-generar-reporte',
  templateUrl: './generar-reporte.component.html',
  styleUrls: ['./generar-reporte.component.scss']
})
export class GenerarReporteComponent implements OnInit {

  idUsuarioLogeado;
  searchReportRouteForm: FormGroup;
  searchReportTurnForm: FormGroup;
  fechaBusquedaRuta;
  fechaBusquedaTurno;
  pipe = new DatePipe('en-US');
  rutas: Ruta[] = [];
  idRutaSeleccionada;
  noData: boolean = false;
  searchNowRoute: boolean = false;
  searchNowTurn: boolean = false;
  @ViewChild('seacrhRoute', {static: false}) submitButtonRoute: MatButton;
  @ViewChild('seacrhTurn', {static: false}) submitButtonTurn: MatButton;
  turnos = [ 
    {
      idTurno: 1,
      descripcion: 'Matutino'
    }, 
    {
      idTurno: 2,
      descripcion: 'Vespertino'
    }
  ];
  dataExportReportRoute;
  dataExportReportTurn;


  constructor(
    private devolucionPedidoService: DevolucionPedidoService,
    private autenticacionService: AutenticacionService,
    private snackBar: MatSnackBar,
    private rutaService: RutaService
  ) { }

  ngOnInit() {
    this.idUsuarioLogeado = this.autenticacionService.currentUserValue;
    this.getValidationsRoute();
    this.getValidationsTurn();
    this.getRutas();
    this.fechaBusquedaRuta = new Date(this.searchReportRouteForm.controls['fechaBusqueda'].value);
    this.fechaBusquedaRuta.setDate(this.fechaBusquedaRuta.getDate());
    this.fechaBusquedaTurno = new Date(this.searchReportTurnForm.controls['fechaBusqueda'].value);
    this.fechaBusquedaTurno.setDate(this.fechaBusquedaTurno.getDate());
  }

  getRutas() {
    this.rutaService.getSelectRutaByEmploye(this.idUsuarioLogeado).subscribe(
      (rutas: Ruta[]) => {
        this.rutas = rutas;
        console.log(this.rutas);
        this.idRutaSeleccionada = rutas[0].idRuta;
        this.searchReportRouteForm.get('idRuta').setValue(this.idRutaSeleccionada);
        this.searchReportTurnForm.get('idTurno').setValue(this.turnos[0].idTurno)
        this.getStatusValidationRoute();
        this.getStatusValidationTurn();
      },
      error => console.log(error)
    );
    
  }
  
  getStatusValidations() {
    const format = 'yyyy-MM-dd';
    this.fechaBusquedaRuta = this.pipe.transform(this.fechaBusquedaRuta, format);
    forkJoin({
      // getRoutes: this.rutaService.getSelectRutaByEmploye(this.idUsuarioLogeado),
      dataValitadionRoute:  this.devolucionPedidoService.getValidateExportRoute(this.fechaBusquedaRuta, this.idRutaSeleccionada),
      dataValitadionTurn:  this.devolucionPedidoService.getValidateExport(this.fechaBusquedaRuta)
      }).subscribe( ({dataValitadionRoute, dataValitadionTurn}) => {
        this.dataExportReportRoute =  dataValitadionRoute;
        this.dataExportReportTurn = dataValitadionTurn;
        console.log(dataValitadionRoute);
        console.log(dataValitadionTurn);
        this.dataExportReportRoute.listo === true ? this.submitButtonRoute.disabled = false : this.submitButtonRoute.disabled = true;
        this.dataExportReportTurn.listo === true ? this.submitButtonTurn.disabled = false : this.submitButtonTurn.disabled = true;
    });
  }

  getStatusValidationRoute() {
    const format = 'yyyy-MM-dd';
    this.fechaBusquedaRuta = this.pipe.transform(this.fechaBusquedaRuta, format);
    console.log(this.fechaBusquedaRuta);
    console.log(this.idRutaSeleccionada);
    this.devolucionPedidoService.getValidateExportRoute(this.fechaBusquedaRuta, this.idRutaSeleccionada).subscribe( 
      data => {
        this.dataExportReportRoute =  data;
        console.log(this.dataExportReportRoute);
        this.dataExportReportRoute.listo === true ? this.submitButtonRoute.disabled = false : this.submitButtonRoute.disabled = true;
      },
      error => console.log(error)
    );
  }

  getStatusValidationTurn() {
    const format = 'yyyy-MM-dd';
    this.fechaBusquedaTurno = this.pipe.transform(this.fechaBusquedaTurno, format);
    console.log(this.fechaBusquedaTurno);
    this.devolucionPedidoService.getValidateExport(this.fechaBusquedaTurno).subscribe( 
      data => {
        this.dataExportReportTurn =  data;
        console.log(this.dataExportReportTurn);
        this.dataExportReportTurn.listo === true ? this.submitButtonTurn.disabled = false : this.submitButtonTurn.disabled = true;
      },
      error => console.log(error)
    );
  }
  
  getValidationsRoute(){
    this.searchReportRouteForm = new FormGroup({
      fechaBusqueda: new FormControl(new Date(), Validators.required),
      idRuta: new FormControl('', Validators.required)
    })
  }

  getValidationsTurn(){
    this.searchReportTurnForm = new FormGroup({
      fechaBusqueda: new FormControl(new Date(), Validators.required),
      idTurno: new FormControl('', Validators.required)
    })
  }

  public onFechaBusquedaRuta(event): void {
    this.fechaBusquedaRuta = event.value;
    // console.log(this.fechaBusquedaRuta);
    this.getStatusValidationRoute();
  }

  public onFechaBusquedaTurno(event): void {
    this.fechaBusquedaTurno = event.value;
    // console.log(this.fechaBusquedaTurno);
    this.getStatusValidationTurn();
  }

  selectRoute(idRuta) {
    console.log(idRuta);
    this.idRutaSeleccionada = idRuta;
    // this.ruta = this.rutas.find((ruta: Ruta) => ruta.idRuta = idRuta);
    // console.log(this.ruta);
    this.getStatusValidationRoute();
  }

  generateReportRoute(){
    const format = 'yyyy-MM-dd';
    this.fechaBusquedaRuta = this.pipe.transform(this.fechaBusquedaRuta, format);
    this.submitButtonRoute.disabled = true;
    this.searchNowRoute = true;
    console.log(this.searchReportRouteForm.value.idRuta);
    console.log(this.fechaBusquedaRuta);

    this.devolucionPedidoService.generateReportByRoute(this.fechaBusquedaRuta, this.searchReportRouteForm.value.idRuta ).subscribe(
      response => {
        this.submitButtonRoute.disabled = false;
        this.searchNowRoute = false;
        var blob = new Blob([response], {type: 'application/pdf'});
        var link=document.createElement('a');
      
        var obj_url = window.URL.createObjectURL(blob);		    
        var link = document.createElement("a");
        link.setAttribute("target", "_blank");
        link.setAttribute("href", obj_url);
        link.setAttribute("download",`${this.fechaBusquedaRuta}-${this.searchReportRouteForm.value.idRuta}.pdf`);
          
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      },
      error => {
        console.log(error);
        this.submitButtonRoute.disabled = false;
        this.searchNowRoute = false;
        this.useAlerts(error.message, ' ', 'error-dialog');
      }
    );
  }

  generateReportTurn(){
    const format = 'yyyy-MM-dd';
    this.fechaBusquedaTurno = this.pipe.transform(this.fechaBusquedaTurno, format);
    this.submitButtonTurn.disabled = true;
    this.searchNowTurn = true;
    console.log(this.searchReportTurnForm.value.idTurno);
    console.log(this.fechaBusquedaTurno);

    this.devolucionPedidoService.generateReportByTurn(this.fechaBusquedaTurno, this.searchReportTurnForm.value.idTurno).subscribe(
      response => {
        this.submitButtonTurn.disabled = false;
        this.searchNowTurn = false;
        var blob = new Blob([response], {type: 'application/pdf'});
        var link=document.createElement('a');
      
        var obj_url = window.URL.createObjectURL(blob);		    
        var link = document.createElement("a");
        link.setAttribute("target", "_blank");
        link.setAttribute("href", obj_url);
        link.setAttribute("download",`${this.fechaBusquedaTurno}-${this.searchReportTurnForm.value.idTurno}.pdf`);
          
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      },
      error => {
        console.log(error);
        this.submitButtonTurn.disabled = false;
        this.searchNowTurn = false;
        this.useAlerts(error.message, ' ', 'error-dialog');
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
