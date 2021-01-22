import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { MatButton, MatSnackBar } from '@angular/material';
import { CortesPendientesService } from 'app/shared/services/cortes-pendientes.service';
import { AutenticacionService } from 'app/shared/services/autenticacion.service';
import { CortesPendientes, TipoMonedas } from 'app/shared/models/cortes-pendientes';

@Component({
  selector: 'app-cortes-pendientes',
  templateUrl: './cortes-pendientes.component.html',
  styleUrls: ['./cortes-pendientes.component.scss']
})
export class CortesPendientesComponent implements OnInit {
  public idUsuarioLogeado
  public tipoMonedas: TipoMonedas[] = [];
  public cortesPendientes: CortesPendientes[] = [];
  public corteSeleccionado: CortesPendientes;
  public noData: boolean = true;
  public cutSelected: boolean = false;
  public idCorte;
  public cutsForm: FormGroup;
  public totalSeleccionados: number = 0;
  public totalValor: number = 0;
  @ViewChild('register', {static: false}) buttonRegister: MatButton;

  constructor(
    private cortesPendientesService: CortesPendientesService,
    private autenticacionService: AutenticacionService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.idUsuarioLogeado = this.autenticacionService.currentUserValue;
    this.getValidations();
    this.getDataCuts();  
  }


  getValidations(){
    this.cutsForm = new FormGroup({
      idCorte: new FormControl('', Validators.required)
    })
  }

  getDataCuts() {
    this.corteSeleccionado = null;
    this.cutSelected = false;
    forkJoin({
      moneyType: this.cortesPendientesService.getMoneyType(),
      cutsPending:  this.cortesPendientesService.getCutsPending()
    })
    .subscribe( 
      ({moneyType, cutsPending}) => {
        this.noData = false;
        this.tipoMonedas = moneyType;
        this.cortesPendientes = cutsPending;
        // console.log(this.tipoMonedas);
        // console.log(this.cortesPendientes);
    },
    error => {
      console.log(error)
    });
  }

  getSelectedCut(data) {
    data ? this.cutSelected = true : this.cutSelected = false;
    this.corteSeleccionado = data;
    // console.log(this.corteSeleccionado);
    // console.log(data);
    // this.buttonRegister.disabled = true;
  }

  getMontosTotales() {
    this.totalSeleccionados = 0;
    this.totalValor = 0;
    this.tipoMonedas.map( moneda => {
      this.totalSeleccionados += moneda.cantidad ;
      this.totalValor += (moneda.valor * moneda.cantidad);
    });
    if(this.totalSeleccionados === 0) {
      this.buttonRegister.disabled = true;
    } else {
      this.buttonRegister.disabled = false;
    }
    // console.log(this.totalSeleccionados);
    // console.log(this.totalValor);
  }

  realizarCorte() {
    if(this.totalSeleccionados === 0){
      this.useAlerts('Debes validar al menos un tipo de moneda y/o billete', ' ', 'error-dialog');
    } else {
      this.buttonRegister.disabled = true;
      let dataSend:TipoMonedas[] = [];
      this.tipoMonedas.map(moneda => {
        if (moneda.cantidad > 0) {
          dataSend = [...dataSend, {
            ...moneda,
            monto: moneda.cantidad * moneda.valor,
            idEmpleado: this.idUsuarioLogeado,
            idFolioCorte: this.corteSeleccionado.idCorte
          }];
        }
      });
      console.log(dataSend);
      // console.log(JSON.stringify(dataSend));
      this.cortesPendientesService.SaveCut(dataSend).subscribe(
        response => {
          if(response.estatus === '05'){
            this.noData = true;
            this.getDataCuts();
            this.useAlerts(response.mensaje, ' ', 'success-dialog');
          } else {
            this.useAlerts(response.mensaje, ' ', 'error-dialog');
          }
          console.log(response);
          this.buttonRegister.disabled = false;
        },
        error => {
          console.log(error);
          this.buttonRegister.disabled = false;
          this.useAlerts(error.message, ' ', 'error-dialog');
        }
      );
    }
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
