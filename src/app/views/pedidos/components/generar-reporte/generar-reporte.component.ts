import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Ruta } from 'app/shared/models/ruta';
import { MatButton, MatSnackBar } from '@angular/material';
import { DevolucionPedido } from 'app/shared/models/devolucion-pedido';
import { DevolucionPedidoService } from 'app/shared/services/devolucion-pedido.service';
import { AutenticacionService } from 'app/shared/services/autenticacion.service';
import { RutaService } from './../../../../shared/services/ruta.service';

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
  }

  getRutas() {
    this.rutaService.getSelectRutaByEmploye(this.idUsuarioLogeado).subscribe(
      (rutas: Ruta[]) => this.rutas = rutas,
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
    console.log(this.fechaBusquedaRuta);
  }

  public onFechaBusquedaTurno(event): void {
    this.fechaBusquedaTurno = event.value;
    console.log(this.fechaBusquedaTurno);
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
