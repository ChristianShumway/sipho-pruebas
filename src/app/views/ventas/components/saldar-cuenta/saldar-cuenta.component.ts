import { Component, OnInit } from '@angular/core';
import { CuentasPorRecibirService } from 'app/shared/services/cuentas-por-recibir.service';
import { CuentaPorSaldar } from 'app/shared/models/cuentas-por-recibir';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { switchMap } from 'rxjs/operators';


@Component({
  selector: 'app-saldar-cuenta',
  templateUrl: './saldar-cuenta.component.html',
  styleUrls: ['./saldar-cuenta.component.scss']
})
export class SaldarCuentaComponent implements OnInit {

  public cuentasPorSaldar: CuentaPorSaldar[] = [];
  public noData: boolean = false;
  public searching: boolean = true;

  constructor(
    private cuentasPorRecibirService: CuentasPorRecibirService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.cuentasPorSaldar = [];
    this.noData = false;
    this.searching = true;
    this.activatedRoute.params.pipe(
      switchMap( (data: Params) => this.cuentasPorRecibirService.getCuentasPorSaldar(data.idCliente))
    ).subscribe(
      result => {
        this.searching = false;
        if(!result.length) {
          this.noData = true;
        } else {
          // console.log(result);
          this.noData = false;
          result.map( cuenta => {
            this.cuentasPorSaldar = [...this.cuentasPorSaldar, {...cuenta, selected: false}];
          })
          // console.log(this.cuentasPorSaldar);
        }
      },
      error => console.log(error)
    );
  }

  onChange(idCuenta, event) {
    console.log(idCuenta);
    // console.log(event);
    this.cuentasPorSaldar.map( cuenta => {
      if(cuenta.idCuentaPorCobrar === idCuenta) {
        cuenta.selected = event.checked;
      }
    });
  }

  saldarCuentas() {
    console.log(this.cuentasPorSaldar);
  }


}
