import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CortesPendientesService } from 'app/shared/services/cortes-pendientes.service';
import { CortesPendientes, TipoMonedas } from 'app/shared/models/cortes-pendientes';
import { forkJoin } from 'rxjs';
import { MatButton } from '@angular/material';

@Component({
  selector: 'app-cortes-pendientes',
  templateUrl: './cortes-pendientes.component.html',
  styleUrls: ['./cortes-pendientes.component.scss']
})
export class CortesPendientesComponent implements OnInit, AfterViewInit {

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
    private cortesPendientesService: CortesPendientesService
  ) { }

  ngOnInit() {
    this.getValidations();
    this.getDataCuts();  
  }

  ngAfterViewInit() {
    // this.buttonRegister.disabled = true;
  }

  getValidations(){
    this.cutsForm = new FormGroup({
      idCorte: new FormControl('', Validators.required)
    })
  }

  getDataCuts() {
    forkJoin({
      moneyType: this.cortesPendientesService.getMoneyType(),
      cutsPending:  this.cortesPendientesService.getCutsPending()
    })
    .subscribe( 
      ({moneyType, cutsPending}) => {
        this.noData = false;
        moneyType.map( moneda => {
          this.tipoMonedas = [...this.tipoMonedas, {...moneda, cantidadSeleccionada: 0}]
        });
        this.cortesPendientes = cutsPending;
        console.log(this.tipoMonedas);
        console.log(this.cortesPendientes);
    },
    error => {
      console.log(error)
    });
  }

  getSelectedCut(data) {
    data ? this.cutSelected = true : this.cutSelected = false;
    this.corteSeleccionado = data;
    console.log(this.corteSeleccionado);
    console.log(data);
    // this.buttonRegister.disabled = true;
  }

  getMontosTotales() {
    this.totalSeleccionados = 0;
    this.totalValor = 0;
    this.tipoMonedas.map( moneda => {
      this.totalSeleccionados += moneda.cantidadSeleccionada ;
      this.totalValor += (moneda.valor * moneda.cantidadSeleccionada);
    });
    if(this.totalSeleccionados === 0) {
      this.buttonRegister.disabled = true;
    } else {
      this.buttonRegister.disabled = false;
    }
    console.log(this.totalSeleccionados);
    console.log(this.totalValor);
  }

  realizarCorte() {
    console.log(this.tipoMonedas);
  }

}
