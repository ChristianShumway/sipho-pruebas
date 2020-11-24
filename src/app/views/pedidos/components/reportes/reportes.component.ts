import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Ruta } from 'app/shared/models/ruta';
import { MatButton, MatSnackBar } from '@angular/material';
import { DevolucionPedido } from 'app/shared/models/devolucion-pedido';
import { AutenticacionService } from 'app/shared/services/autenticacion.service';
import { RutaService } from './../../../../shared/services/ruta.service';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.scss']
})
export class ReportesComponent implements OnInit {

  idUsuarioLogeado;
  searchReportRouteForm: FormGroup;
  searchReportTurnForm: FormGroup;
  fechaBusquedaRuta;
  fechaBusquedaTurno;
  pipe = new DatePipe('en-US');
  rutas: Ruta[] = [];
  noData: boolean = false;
  searchNow: boolean = false;
  pageActual = 0;
  @ViewChild('seacrhRoute', {static: false}) submitButtonRoute: MatButton;
  @ViewChild('seacrhTurn', {static: false}) submitButtonTurn: MatButton;


  constructor(
    private devolucionPedido: DevolucionPedido,
    private autenticacionService: AutenticacionService,
    private snackBar: MatSnackBar,
    private rutaService: RutaService
  ) { }

  ngOnInit() {
    this.idUsuarioLogeado = this.autenticacionService.currentUserValue;
    this.getValidationsRoute();
    this.getValidationsTurn();
  }

  getRutas() {
    this.rutaService.getSelectRutaByEmploye(this.idUsuarioLogeado).subscribe(
      (rutas: Ruta[]) => {
        console.log(rutas);
        this.rutas = rutas;
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
    console.log(this.searchReportRouteForm.value);
  }

  generateReportTurn(){
    const format = 'yyyy-MM-dd';
    this.fechaBusquedaTurno = this.pipe.transform(this.fechaBusquedaTurno, format);
    this.submitButtonTurn.disabled = true;
    console.log(this.searchReportTurnForm);
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
